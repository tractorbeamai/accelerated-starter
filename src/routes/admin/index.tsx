"use client";

import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { LogIn } from "lucide-react";
import { motion } from "motion/react";

import { TaureanLogo } from "@/components/taurean/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminStore, login } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useStore(adminStore, (s) => s.isAuthenticated);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    navigate({ to: "/admin/dashboard" });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email);
      navigate({ to: "/admin/dashboard" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <TaureanLogo className="mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-medium text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the recruiter dashboard
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@taurean.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <LogIn className="mr-2 size-4" />
              Sign in
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo mode: Enter any email to continue
          </p>
        </div>
      </motion.div>
    </div>
  );
}
