"use client";

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { format } from "date-fns";
import { ChartBar, Eye, Kanban, Search, UserCheck, Users } from "lucide-react";
import { motion } from "motion/react";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { StatCard } from "@/components/taurean/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CandidateStatus } from "@/db/schema";
import { adminStore } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import { candidatesQueryOptions } from "@/server/candidates";

export const Route = createFileRoute("/admin/dashboard")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(candidatesQueryOptions());
    return {};
  },
  component: DashboardPage,
});

const statusColors: Record<CandidateStatus, string> = {
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  reviewing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  qualified: "bg-green-500/20 text-green-400 border-green-500/30",
  contacted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  placed: "bg-accent/20 text-accent border-accent/30",
};

const statusLabels: Record<CandidateStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  qualified: "Qualified",
  contacted: "Contacted",
  rejected: "Rejected",
  placed: "Placed",
};

function DashboardPage() {
  const navigate = useNavigate();
  const isAuthenticated = useStore(adminStore, (s) => s.isAuthenticated);
  const { data: candidates } = useSuspenseQuery(candidatesQueryOptions());
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const stats = useMemo(() => {
    const total = candidates.length;
    const qualified = candidates.filter((c) => c.qualified).length;
    const inPipeline = candidates.filter(
      (c) => c.status !== "rejected" && c.status !== "placed",
    ).length;
    const avgScore = total
      ? Math.round(
          candidates.reduce((sum, c) => sum + (c.aiScore ?? 0), 0) / total,
        )
      : 0;

    return { total, qualified, inPipeline, avgScore };
  }, [candidates]);

  // Filter candidates by search query
  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates;

    const query = searchQuery.toLowerCase();
    return candidates.filter(
      (c) =>
        c.firstName?.toLowerCase().includes(query) ??
        c.lastName?.toLowerCase().includes(query) ??
        c.email.toLowerCase().includes(query),
    );
  }, [candidates, searchQuery]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/admin" });
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-medium text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Overview of your talent pipeline
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Candidates"
            value={stats.total}
            icon={<Users className="size-5" />}
          />
          <StatCard
            label="Qualified This Week"
            value={stats.qualified}
            icon={<UserCheck className="size-5" />}
            trend={{ value: 12, label: "from last week" }}
          />
          <StatCard
            label="In Active Pipeline"
            value={stats.inPipeline}
            icon={<Kanban className="size-5" />}
          />
          <StatCard
            label="Average AI Score"
            value={stats.avgScore}
            icon={<ChartBar className="size-5" />}
          />
        </div>

        {/* Candidates Table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-white/10 bg-card"
        >
          <div className="flex items-center justify-between border-b border-white/10 p-6">
            <h2 className="font-serif text-xl font-medium text-white">
              Recent Candidates
            </h2>
            <div className="relative w-64">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-muted-foreground focus:border-accent"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Email</TableHead>
                <TableHead className="text-muted-foreground">
                  Submitted
                </TableHead>
                <TableHead className="text-muted-foreground">
                  AI Score
                </TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? "No candidates match your search"
                      : "No candidates yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCandidates.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white">
                      {candidate.firstName} {candidate.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {candidate.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {candidate.createdAt
                        ? format(new Date(candidate.createdAt), "MMM d, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={cn(
                              "h-full transition-all",
                              candidate.aiScore && candidate.aiScore >= 70
                                ? "bg-success"
                                : candidate.aiScore && candidate.aiScore >= 50
                                  ? "bg-warning"
                                  : "bg-destructive",
                            )}
                            style={{
                              width: `${candidate.aiScore ?? 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-white">
                          {candidate.aiScore ?? 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border",
                          (candidate.status &&
                            statusColors[candidate.status]) ??
                            statusColors.new,
                        )}
                      >
                        {(candidate.status && statusLabels[candidate.status]) ??
                          "New"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to="/admin/candidates/$id"
                        params={{ id: candidate.id }}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:bg-white/5 hover:text-white"
                        >
                          <Eye className="mr-2 size-4" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
