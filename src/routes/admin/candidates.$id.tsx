"use client";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  ChartPie,
  CheckCircle,
  Download,
  FileText,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { ChatMessage } from "@/components/taurean/chat-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CandidateStatus, PipelineStage } from "@/db/schema";
import { adminStore } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import {
  candidateQueryOptions,
  intakeResponsesQueryOptions,
  updateCandidatePipeline,
  updateCandidateStatus,
} from "@/server/candidates";

export const Route = createFileRoute("/admin/candidates/$id")({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(candidateQueryOptions(params.id)),
      context.queryClient.ensureQueryData(
        intakeResponsesQueryOptions(params.id),
      ),
    ]);
    return { id: params.id };
  },
  component: CandidateDetailPage,
});

const statusOptions: { value: CandidateStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "qualified", label: "Qualified" },
  { value: "contacted", label: "Contacted" },
  { value: "rejected", label: "Rejected" },
  { value: "placed", label: "Placed" },
];

const pipelineOptions: { value: PipelineStage; label: string }[] = [
  { value: "new_submissions", label: "New Submissions" },
  { value: "under_review", label: "Under Review" },
  { value: "qualified", label: "Qualified" },
  { value: "outreach_sent", label: "Outreach Sent" },
  { value: "in_conversation", label: "In Conversation" },
  { value: "placed", label: "Placed" },
];

function CandidateDetailPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const isAuthenticated = useStore(adminStore, (s) => s.isAuthenticated);
  const { data: candidate, refetch: refetchCandidate } = useSuspenseQuery(
    candidateQueryOptions(id),
  );
  const { data: intakeResponses } = useSuspenseQuery(
    intakeResponsesQueryOptions(id),
  );

  const statusMutation = useMutation({
    mutationFn: (status: CandidateStatus) =>
      updateCandidateStatus({ data: { id, status } }),
    onSuccess: () => refetchCandidate(),
  });

  const pipelineMutation = useMutation({
    mutationFn: (pipelineStage: PipelineStage) =>
      updateCandidatePipeline({ data: { id, pipelineStage } }),
    onSuccess: () => refetchCandidate(),
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/admin" });
    return null;
  }

  if (!candidate) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Candidate not found</p>
        </div>
      </AdminLayout>
    );
  }

  const analysis = candidate.aiAnalysis;

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Back button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* Left column - Profile & Analysis */}
          <div className="space-y-6">
            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-white/10 bg-card p-6"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <User className="size-6" />
                  </div>
                  <div>
                    <h1 className="font-serif text-2xl font-medium text-white">
                      {candidate.firstName} {candidate.lastName}
                    </h1>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="size-3.5" />
                      {candidate.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Select
                    value={candidate.status ?? "new"}
                    onValueChange={(value) =>
                      statusMutation.mutate(value as CandidateStatus)
                    }
                  >
                    <SelectTrigger className="w-36 border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-card">
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-muted-foreground">
                    Pipeline Stage
                  </span>
                  <Select
                    value={candidate.pipelineStage ?? "new_submissions"}
                    onValueChange={(value) =>
                      pipelineMutation.mutate(value as PipelineStage)
                    }
                  >
                    <SelectTrigger className="w-40 border-white/10 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-card">
                      {pipelineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-muted-foreground">
                    Submitted
                  </span>
                  <span className="text-sm text-white">
                    {candidate.createdAt
                      ? format(
                          new Date(candidate.createdAt),
                          "MMM d, yyyy 'at' h:mm a",
                        )
                      : "-"}
                  </span>
                </div>

                {candidate.resumeFileName && (
                  <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm text-muted-foreground">
                      Resume
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 bg-transparent text-white hover:bg-white/5"
                    >
                      <Download className="mr-2 size-3.5" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* AI Score card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-lg border border-white/10 bg-card p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <ChartPie className="size-5 text-accent" />
                <h2 className="font-serif text-lg font-medium text-white">
                  AI Score
                </h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative size-24">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/10"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${candidate.aiScore ?? 0}, 100`}
                      strokeLinecap="round"
                      className={cn(
                        candidate.aiScore && candidate.aiScore >= 70
                          ? "text-success"
                          : candidate.aiScore && candidate.aiScore >= 50
                            ? "text-warning"
                            : "text-destructive",
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-white">
                      {candidate.aiScore ?? 0}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "mb-2",
                      candidate.qualified
                        ? "border-success/30 bg-success/20 text-success"
                        : "border-destructive/30 bg-destructive/20 text-destructive",
                    )}
                  >
                    {candidate.qualified ? "Qualified" : "Not Qualified"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {candidate.qualified
                      ? "This candidate meets the qualification criteria"
                      : "Does not meet current qualification criteria"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* AI Analysis card */}
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-lg border border-white/10 bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <FileText className="size-5 text-accent" />
                  <h2 className="font-serif text-lg font-medium text-white">
                    AI Assessment
                  </h2>
                </div>

                {/* Fit scores */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <ScoreBar label="PE Exposure" value={analysis.peExposure} />
                  <ScoreBar label="Seniority" value={analysis.seniority} />
                  <ScoreBar
                    label="Functional Depth"
                    value={analysis.functionalDepth}
                  />
                  <ScoreBar
                    label="Culture Signals"
                    value={analysis.cultureSignals}
                  />
                </div>

                {/* Strengths */}
                {analysis.strengths.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                      <CheckCircle className="size-4 text-success" />
                      Key Strengths
                    </h3>
                    <ul className="space-y-1 pl-6">
                      {analysis.strengths.map((strength) => (
                        <li
                          key={strength}
                          className="text-sm text-muted-foreground"
                        >
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Concerns */}
                {analysis.concerns.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                      <AlertCircle className="size-4 text-warning" />
                      Potential Concerns
                    </h3>
                    <ul className="space-y-1 pl-6">
                      {analysis.concerns.map((concern) => (
                        <li
                          key={concern}
                          className="text-sm text-muted-foreground"
                        >
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reasons */}
                {analysis.reasons.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-white">
                      Qualification Reasons
                    </h3>
                    <ul className="space-y-1">
                      {analysis.reasons.map((reason) => (
                        <li
                          key={reason}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => pipelineMutation.mutate("qualified")}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Move to Pipeline
              </Button>
              <Button
                onClick={() => statusMutation.mutate("rejected")}
                variant="outline"
                className="flex-1 border-destructive/30 bg-transparent text-destructive hover:bg-destructive/10"
              >
                <XCircle className="mr-2 size-4" />
                Mark Rejected
              </Button>
            </div>
          </div>

          {/* Right column - Conversation transcript */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-lg border border-white/10 bg-card"
          >
            <div className="border-b border-white/10 p-6">
              <h2 className="font-serif text-lg font-medium text-white">
                Conversation Transcript
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {intakeResponses.length > 0
                  ? `${intakeResponses.length} responses recorded`
                  : "No conversation yet"}
              </p>
            </div>

            <div className="max-h-[600px] overflow-y-auto p-6">
              {intakeResponses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white/5">
                    <FileText className="size-5 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    This candidate hasn&apos;t completed the intake conversation
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {intakeResponses.map((response) => (
                    <div key={response.id} className="space-y-3">
                      <ChatMessage
                        content={response.questionText}
                        from="ai"
                        timestamp={
                          response.createdAt
                            ? new Date(response.createdAt)
                            : undefined
                        }
                      />
                      <ChatMessage
                        content={response.response}
                        from="user"
                        timestamp={
                          response.createdAt
                            ? new Date(response.createdAt)
                            : undefined
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-white">{value}/10</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            "h-full transition-all",
            value >= 7
              ? "bg-success"
              : value >= 5
                ? "bg-warning"
                : "bg-destructive",
          )}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}
