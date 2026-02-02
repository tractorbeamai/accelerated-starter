"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Candidate, PipelineStage } from "@/db/schema";
import { cn } from "@/lib/utils";

import { CandidateCard } from "./candidate-card";

interface PipelineColumnProps {
  id: PipelineStage;
  title: string;
  candidates: Candidate[];
}

export function PipelineColumn({ id, title, candidates }: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      stage: id,
    },
  });

  return (
    <div
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-lg border border-white/10 bg-card/50",
        isOver && "border-accent/50 bg-accent/5",
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <h3 className="font-medium text-white">{title}</h3>
        <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-xs text-muted-foreground">
          {candidates.length}
        </span>
      </div>

      {/* Cards container */}
      <div
        ref={setNodeRef}
        className="flex min-h-[200px] flex-1 flex-col gap-3 overflow-y-auto p-4"
      >
        <SortableContext
          items={candidates.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>

        {candidates.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">No candidates</p>
          </div>
        )}
      </div>
    </div>
  );
}
