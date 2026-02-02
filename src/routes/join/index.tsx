"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";

import { TaureanLogo } from "@/components/taurean/logo";
import { UploadZone } from "@/components/taurean/upload-zone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { createCandidate } from "@/server/candidates";

export const Route = createFileRoute("/join/")({
  component: JoinPage,
});

function JoinPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!file || !email) {
        throw new Error("Please upload your resume and enter your email");
      }

      // Extract text from file (simplified - in production use pdf-parse/mammoth)
      const text = await extractTextFromFile(file);

      // Parse name from filename or email
      const nameParts = parseNameFromEmail(email);

      const candidate = await createCandidate({
        data: {
          email,
          firstName: nameParts.firstName,
          lastName: nameParts.lastName,
          resumeText: text,
          resumeFileName: file.name,
        },
      });

      return candidate;
    },
    onSuccess: (candidate) => {
      // Navigate to review page with candidate ID
      navigate({
        to: "/join/review",
        search: { id: candidate.id },
      });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  };

  const isValid = file && email && email.includes("@");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 right-0 left-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <TaureanLogo />
          <a
            href="https://taureanco.com"
            className="text-sm text-muted-foreground transition-colors hover:text-white"
          >
            About Taurean
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex min-h-screen items-center pt-16">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <p className="mb-4 text-xs font-medium tracking-[0.2em] text-accent uppercase">
              Taurean Talent Network
            </p>

            <h1 className="font-serif text-4xl leading-tight font-medium text-white md:text-5xl lg:text-6xl">
              Join the network that places PE&apos;s top operators
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We connect exceptional value creation talent with the firms that
              need them. Submit your background and we&apos;ll be in touch when
              the right opportunity emerges.
            </p>

            {/* Feature callouts */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <FeatureCallout
                icon={<Lock className="size-5" />}
                text="Confidential and discrete"
              />
              <FeatureCallout
                icon={<Sparkles className="size-5" />}
                text="Curated opportunities only"
              />
              <FeatureCallout
                icon={<Users className="size-5" />}
                text="Direct access to decision-makers"
              />
            </div>
          </motion.div>

          {/* Right side - Upload card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center lg:justify-end"
          >
            <div className="w-full max-w-md rounded-lg border border-white/10 bg-card p-8">
              <h2 className="mb-6 font-serif text-2xl font-medium text-white">
                Get started
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <UploadZone
                  onFileSelect={setFile}
                  disabled={mutation.isPending}
                />

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      and
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={mutation.isPending}
                    className="border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  disabled={!isValid || mutation.isPending}
                  className={cn(
                    "w-full bg-accent text-accent-foreground hover:bg-accent/90",
                    "disabled:opacity-50",
                  )}
                >
                  {mutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="size-4" />
                      Processing...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <a href="#" className="underline hover:text-white">
                    privacy policy
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCallout({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-accent">
        {icon}
      </div>
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

// Helper function to extract text from file
async function extractTextFromFile(file: File): Promise<string> {
  // For this prototype, we'll read the file as text
  // In production, use pdf-parse for PDFs and mammoth for DOCX

  if (file.type === "application/pdf") {
    // For PDFs, we'd use pdf-parse on the server
    // For now, return a placeholder that indicates it's a PDF
    return `[PDF Resume: ${file.name}]\n\nNote: PDF parsing would extract full text content here.`;
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword"
  ) {
    // For DOCX, we'd use mammoth on the server
    return `[DOCX Resume: ${file.name}]\n\nNote: DOCX parsing would extract full text content here.`;
  }

  // For text files, read directly
  try {
    const text = await file.text();
    return text;
  } catch {
    return `[Resume: ${file.name}]`;
  }
}

// Helper function to parse name from email
function parseNameFromEmail(email: string): {
  firstName?: string;
  lastName?: string;
} {
  const [localPart] = email.split("@");
  const parts = localPart
    .replaceAll(/[._]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());

  if (parts.length >= 2) {
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(" "),
    };
  } else if (parts.length === 1) {
    return { firstName: parts[0] };
  }

  return {};
}
