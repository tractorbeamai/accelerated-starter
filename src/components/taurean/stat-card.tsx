"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("rounded-lg border border-white/10 bg-card p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs",
                trend.value >= 0 ? "text-success" : "text-destructive",
              )}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
