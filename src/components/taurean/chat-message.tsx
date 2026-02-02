"use client";

import { motion } from "motion/react";

import { TaureanIcon } from "@/components/taurean/logo";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  from: "ai" | "user";
  timestamp?: Date;
  className?: string;
}

export function ChatMessage({
  content,
  from,
  timestamp,
  className,
}: ChatMessageProps) {
  const isAI = from === "ai";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3",
        isAI ? "justify-start" : "justify-end",
        className,
      )}
    >
      {isAI && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
          <TaureanIcon className="size-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3",
          isAI ? "bg-card text-white" : "bg-accent text-accent-foreground",
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p
            className={cn(
              "mt-1 text-xs",
              isAI ? "text-muted-foreground" : "text-accent-foreground/70",
            )}
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      {!isAI && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
          <span className="text-xs font-medium">You</span>
        </div>
      )}
    </motion.div>
  );
}
