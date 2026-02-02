"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import * as z from "zod";

import { TaureanLogo } from "@/components/taurean/logo";
import { Button } from "@/components/ui/button";
import { candidateQueryOptions } from "@/server/candidates";

const searchSchema = z.object({
  id: z.uuid(),
});

export const Route = createFileRoute("/join/review")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(candidateQueryOptions(deps.id));
    return { id: deps.id };
  },
  component: ReviewPage,
});

function ReviewPage() {
  const { id } = Route.useSearch();
  const { data: candidate } = useSuspenseQuery(candidateQueryOptions(id));
  const navigate = useNavigate();

  if (!candidate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Candidate not found</p>
      </div>
    );
  }

  const isQualified = candidate.qualified;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <TaureanLogo />
        </div>
      </header>

      {/* Main content */}
      <main className="flex min-h-screen items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl text-center"
        >
          {isQualified ? (
            <QualifiedContent
              firstName={candidate.firstName}
              onContinue={() => {
                void navigate({
                  to: "/join/conversation",
                  search: { id: candidate.id },
                });
              }}
            />
          ) : (
            <NotQualifiedContent />
          )}
        </motion.div>
      </main>
    </div>
  );
}

function QualifiedContent({
  firstName,
  onContinue,
}: {
  firstName?: string | null;
  onContinue: () => void;
}) {
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
        className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-success/10"
      >
        <CheckCircle2 className="size-10 text-success" />
      </motion.div>

      <h1 className="font-serif text-3xl font-medium text-white md:text-4xl">
        Thank you{firstName ? `, ${firstName}` : ""}
      </h1>

      <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
        Based on your background, we&apos;d like to learn more about you. Our
        intake process takes about 10 minutes and helps us understand where
        you&apos;d be the best fit.
      </p>

      <Button
        onClick={onContinue}
        className="mt-10 bg-accent px-8 text-accent-foreground hover:bg-accent/90"
      >
        Continue
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </>
  );
}

function NotQualifiedContent() {
  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
        className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full bg-muted/50"
      >
        <XCircle className="size-10 text-muted-foreground" />
      </motion.div>

      <h1 className="font-serif text-3xl font-medium text-white md:text-4xl">
        Thank you for your interest
      </h1>

      <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
        We&apos;ve reviewed your background and don&apos;t currently have
        opportunities that align with your experience. We&apos;ll keep your
        information on file and reach out if that changes.
      </p>

      <Link
        to="/"
        className="mt-10 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-white"
      >
        Return to Taurean
        <ArrowRight className="ml-2 size-4" />
      </Link>
    </>
  );
}
