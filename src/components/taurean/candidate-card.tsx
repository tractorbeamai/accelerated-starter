"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@tanstack/react-router";
import { GripVertical, User } from "lucide-react";

import type { Candidate } from "@/db/schema";
import { cn } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  isDragging?: boolean;
}

export function CandidateCard({ candidate, isDragging }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: candidate.id,
    data: {
      type: "candidate",
      candidate,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragging = isDragging ?? isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border border-white/10 bg-card p-4 transition-all",
        dragging && "opacity-50 shadow-lg",
        !dragging && "hover:border-white/20",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        {/* Avatar */}
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          {candidate.firstName ? (
            <span className="text-sm font-medium">
              {candidate.firstName.charAt(0)}
            </span>
          ) : (
            <User className="size-4" />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <Link
            to="/admin/candidates/$id"
            params={{ id: candidate.id }}
            className="block truncate font-medium text-white hover:underline"
          >
            {candidate.firstName} {candidate.lastName}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {candidate.email}
          </p>
        </div>

        {/* Score badge */}
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-full text-xs font-medium",
            candidate.aiScore && candidate.aiScore >= 70
              ? "bg-success/20 text-success"
              : candidate.aiScore && candidate.aiScore >= 50
                ? "bg-warning/20 text-warning"
                : "bg-muted text-muted-foreground",
          )}
        >
          {candidate.aiScore ?? 0}
        </div>
      </div>
    </div>
  );
}
