import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import * as z from "zod";

import { db } from "@/db/client";
import {
  candidates,
  intakeResponses,
  type Candidate,
  type InsertCandidate,
  type InsertIntakeResponse,
  type IntakeResponse,
  type PipelineStage,
} from "@/db/schema";
import { screenResume } from "@/lib/screening-rules";

// Input schemas
const createCandidateSchema = z.object({
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  resumeText: z.string(),
  resumeFileName: z.string().optional(),
});

const candidateIdSchema = z.object({
  id: z.uuid(),
});

const candidateStageSchema = z.object({
  stage: z.string(),
});

const updateStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum([
    "new",
    "reviewing",
    "qualified",
    "contacted",
    "rejected",
    "placed",
  ]),
});

const updatePipelineSchema = z.object({
  id: z.uuid(),
  pipelineStage: z.enum([
    "new_submissions",
    "under_review",
    "qualified",
    "outreach_sent",
    "in_conversation",
    "placed",
  ]),
});

const saveIntakeResponseSchema = z.object({
  candidateId: z.uuid(),
  questionKey: z.string(),
  questionText: z.string(),
  response: z.string(),
});

// Create a new candidate with resume screening
export const createCandidate = createServerFn({ method: "POST" })
  .inputValidator(createCandidateSchema)
  .handler(async ({ data }): Promise<Candidate> => {
    // Screen the resume
    const screeningResult = screenResume(data.resumeText);

    const candidateData: InsertCandidate = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      resumeText: data.resumeText,
      resumeFileName: data.resumeFileName,
      aiScore: screeningResult.score,
      aiAnalysis: screeningResult.analysis,
      qualified: screeningResult.qualified,
      status: screeningResult.qualified ? "qualified" : "rejected",
      pipelineStage: screeningResult.qualified ? "new_submissions" : undefined,
    };

    const [candidate] = await db
      .insert(candidates)
      .values(candidateData)
      .returning();

    return candidate;
  });

// Get a single candidate by ID
export const getCandidate = createServerFn({ method: "GET" })
  .inputValidator(candidateIdSchema)
  .handler(async ({ data: { id } }): Promise<Candidate | null> => {
    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.id, id))
      .limit(1);

    return candidate ?? null;
  });

// Get all candidates
export const getCandidates = createServerFn({ method: "GET" }).handler(
  async (): Promise<Candidate[]> => {
    return await db
      .select()
      .from(candidates)
      .orderBy(desc(candidates.createdAt));
  },
);

// Get candidates by pipeline stage
export const getCandidatesByStage = createServerFn({ method: "GET" })
  .inputValidator(candidateStageSchema)
  .handler(async ({ data: { stage } }): Promise<Candidate[]> => {
    return await db
      .select()
      .from(candidates)
      .where(eq(candidates.pipelineStage, stage as PipelineStage))
      .orderBy(desc(candidates.createdAt));
  });

// Update candidate status
export const updateCandidateStatus = createServerFn({ method: "POST" })
  .inputValidator(updateStatusSchema)
  .handler(async ({ data: { id, status } }): Promise<Candidate> => {
    const [candidate] = await db
      .update(candidates)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, id))
      .returning();

    return candidate;
  });

// Update candidate pipeline stage
export const updateCandidatePipeline = createServerFn({ method: "POST" })
  .inputValidator(updatePipelineSchema)
  .handler(async ({ data: { id, pipelineStage } }): Promise<Candidate> => {
    const [candidate] = await db
      .update(candidates)
      .set({
        pipelineStage,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, id))
      .returning();

    return candidate;
  });

// Save an intake response
export const saveIntakeResponse = createServerFn({ method: "POST" })
  .inputValidator(saveIntakeResponseSchema)
  .handler(async ({ data }): Promise<IntakeResponse> => {
    const responseData: InsertIntakeResponse = {
      candidateId: data.candidateId,
      questionKey: data.questionKey,
      questionText: data.questionText,
      response: data.response,
    };

    const [intakeResponse] = await db
      .insert(intakeResponses)
      .values(responseData)
      .returning();

    return intakeResponse;
  });

// Get intake responses for a candidate
export const getIntakeResponses = createServerFn({ method: "GET" })
  .inputValidator(candidateIdSchema)
  .handler(async ({ data: { id } }): Promise<IntakeResponse[]> => {
    return await db
      .select()
      .from(intakeResponses)
      .where(eq(intakeResponses.candidateId, id))
      .orderBy(intakeResponses.createdAt);
  });

// Query options for React Query
export const candidatesQueryOptions = () =>
  queryOptions({
    queryKey: ["candidates"],
    queryFn: () => getCandidates(),
  });

export const candidateQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["candidate", id],
    queryFn: () => getCandidate({ data: { id } }),
  });

export const intakeResponsesQueryOptions = (candidateId: string) =>
  queryOptions({
    queryKey: ["intakeResponses", candidateId],
    queryFn: () => getIntakeResponses({ data: { id: candidateId } }),
  });
