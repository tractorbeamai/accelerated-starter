"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import { motion } from "motion/react";

import { TaureanLogo } from "@/components/taurean/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <TaureanLogo />
          <Link
            to="/admin"
            className="text-sm text-muted-foreground transition-colors hover:text-white"
          >
            Recruiter Login
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Private Equity Performance Architects
          </p>

          <h1 className="font-serif text-4xl leading-tight font-medium text-white md:text-5xl lg:text-6xl">
            Where exceptional talent meets transformational opportunity
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Taurean connects world-class operators with private equity firms
            seeking value creation leaders.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/join">
              <Button
                size="lg"
                className="bg-accent px-8 text-accent-foreground hover:bg-accent/90"
              >
                <Users className="mr-2 size-5" />
                Join the Network
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>

            <Link to="/admin">
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 bg-transparent px-8 text-white hover:bg-white/5"
              >
                <Briefcase className="mr-2 size-5" />
                Recruiter Access
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-20 border-t border-white/10 pt-10">
            <p className="mb-6 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Trusted by leading PE firms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
              {["KKR", "Blackstone", "Carlyle", "TPG", "Vista"].map((firm) => (
                <span
                  key={firm}
                  className="font-serif text-lg tracking-wide text-white"
                >
                  {firm}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm text-muted-foreground">
          <p>&copy; 2026 Taurean. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
