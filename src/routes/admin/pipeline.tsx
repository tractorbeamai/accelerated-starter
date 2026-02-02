"use client";

import { useMemo, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { motion } from "motion/react";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { CandidateCard } from "@/components/taurean/candidate-card";
import { PipelineColumn } from "@/components/taurean/pipeline-column";
import type { Candidate, PipelineStage } from "@/db/schema";
import { adminStore } from "@/lib/admin-store";
import {
  candidatesQueryOptions,
  updateCandidatePipeline,
} from "@/server/candidates";

export const Route = createFileRoute("/admin/pipeline")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(candidatesQueryOptions());
    return {};
  },
  component: PipelinePage,
});

const PIPELINE_STAGES: { id: PipelineStage; title: string }[] = [
  { id: "new_submissions", title: "New Submissions" },
  { id: "under_review", title: "Under Review" },
  { id: "qualified", title: "Qualified" },
  { id: "outreach_sent", title: "Outreach Sent" },
  { id: "in_conversation", title: "In Conversation" },
  { id: "placed", title: "Placed" },
];

function PipelinePage() {
  const navigate = useNavigate();
  const isAuthenticated = useStore(adminStore, (s) => s.isAuthenticated);
  const { data: candidates, refetch } = useSuspenseQuery(
    candidatesQueryOptions(),
  );
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(
    null,
  );

  const pipelineMutation = useMutation({
    mutationFn: ({
      id,
      pipelineStage,
    }: {
      id: string;
      pipelineStage: PipelineStage;
    }) => updateCandidatePipeline({ data: { id, pipelineStage } }),
    onSuccess: () => refetch(),
  });

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Group candidates by pipeline stage
  const candidatesByStage = useMemo(() => {
    const grouped: Record<PipelineStage, Candidate[]> = {
      new_submissions: [],
      under_review: [],
      qualified: [],
      outreach_sent: [],
      in_conversation: [],
      placed: [],
    };

    // Only include qualified candidates in the pipeline
    for (const candidate of candidates.filter((c) => c.qualified)) {
      const stage = candidate.pipelineStage ?? "new_submissions";
      if (grouped[stage]) {
        grouped[stage].push(candidate);
      }
    }

    return grouped;
  }, [candidates]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/admin" });
    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = candidates.find((c) => c.id === active.id);
    if (candidate) {
      setActiveCandidate(candidate);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const candidateId = active.id as string;
    const overData = over.data.current;

    // Determine the target stage
    let targetStage: PipelineStage | null = null;

    if (overData?.type === "column") {
      targetStage = overData.stage;
    } else if (overData?.type === "candidate") {
      // Dropped on a candidate - use their stage
      const targetCandidate = candidates.find((c) => c.id === over.id);
      if (targetCandidate) {
        targetStage = targetCandidate.pipelineStage ?? "new_submissions";
      }
    }

    if (!targetStage) return;

    // Find the candidate being moved
    const movedCandidate = candidates.find((c) => c.id === candidateId);
    if (!movedCandidate) return;

    // Only update if the stage changed
    if (movedCandidate.pipelineStage !== targetStage) {
      pipelineMutation.mutate({
        id: candidateId,
        pipelineStage: targetStage,
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-medium text-white">
            Pipeline
          </h1>
          <p className="mt-1 text-muted-foreground">
            Drag and drop candidates between stages
          </p>
        </div>

        {/* Kanban board */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-x-auto pb-4"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4">
              {PIPELINE_STAGES.map((stage) => (
                <PipelineColumn
                  key={stage.id}
                  id={stage.id}
                  title={stage.title}
                  candidates={candidatesByStage[stage.id]}
                />
              ))}
            </div>

            <DragOverlay>
              {activeCandidate && (
                <div className="scale-105 rotate-3">
                  <CandidateCard candidate={activeCandidate} isDragging />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
