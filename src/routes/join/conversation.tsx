"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { ArrowRight, Mic, Phone, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as z from "zod";

import { ChatMessage } from "@/components/taurean/chat-message";
import { TaureanLogo } from "@/components/taurean/logo";
import { TypingIndicator } from "@/components/taurean/typing-indicator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  COMPLETION_MESSAGE,
  INITIAL_MESSAGE,
  INTAKE_QUESTIONS,
} from "@/lib/intake-questions";
import { cn } from "@/lib/utils";
import { candidateQueryOptions, saveIntakeResponse } from "@/server/candidates";

const searchSchema = z.object({
  id: z.uuid(),
});

export const Route = createFileRoute("/join/conversation")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ id: search.id }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(candidateQueryOptions(deps.id));
    return { id: deps.id };
  },
  component: ConversationPage,
});

interface Message {
  id: string;
  content: string;
  from: "ai" | "user";
  timestamp: Date;
}

function ConversationPage() {
  const { id } = Route.useSearch();
  const { data: candidate } = useSuspenseQuery(candidateQueryOptions(id));

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [hasShownVoicePrompt, setHasShownVoicePrompt] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Save response mutation
  const saveMutation = useMutation({
    mutationFn: async ({
      questionKey,
      questionText,
      response,
    }: {
      questionKey: string;
      questionText: string;
      response: string;
    }) => {
      return saveIntakeResponse({
        data: {
          candidateId: id,
          questionKey,
          questionText,
          response,
        },
      });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initial message
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages([
          {
            id: "initial",
            content: INITIAL_MESSAGE(candidate?.firstName),
            from: "ai",
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    }, 500);

    return () => clearTimeout(timer);
  }, [candidate?.firstName]);

  // Fire confetti on completion
  useEffect(() => {
    if (isComplete) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C9A962", "#FFFFFF", "#4ADE80"],
      });
    }
  }, [isComplete]);

  const addAIMessage = useCallback((content: string) => {
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            content,
            from: "ai",
            timestamp: new Date(),
          },
        ]);
      },
      1000 + Math.random() * 1000,
    );
  }, []);

  const handleStartConversation = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-start`,
        content: "Let's do it",
        from: "user",
        timestamp: new Date(),
      },
    ]);
    setCurrentQuestionIndex(0);
    addAIMessage(INTAKE_QUESTIONS[0].text);
  }, [addAIMessage]);

  const handleAskQuestion = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-question`,
        content: "I have a question first",
        from: "user",
        timestamp: new Date(),
      },
    ]);
    addAIMessage(
      "Of course! What would you like to know? Feel free to ask anything about the process or what we're looking for.",
    );
  }, [addAIMessage]);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        content: userMessage,
        from: "user",
        timestamp: new Date(),
      },
    ]);

    // If we're not in the question flow yet, start it
    if (currentQuestionIndex === -1) {
      setCurrentQuestionIndex(0);
      addAIMessage(INTAKE_QUESTIONS[0].text);
      return;
    }

    // Save the response
    const currentQuestion = INTAKE_QUESTIONS[currentQuestionIndex];
    if (currentQuestion) {
      saveMutation.mutate({
        questionKey: currentQuestion.key,
        questionText: currentQuestion.text,
        response: userMessage,
      });
    }

    // Check if we should show voice prompt (after question 2)
    if (currentQuestionIndex === 1 && !hasShownVoicePrompt) {
      setHasShownVoicePrompt(true);
      // Continue to next question but show voice prompt
    }

    // Move to next question or complete
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < INTAKE_QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
      addAIMessage(INTAKE_QUESTIONS[nextIndex].text);
    } else {
      // Complete the conversation
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: "completion",
              content: COMPLETION_MESSAGE,
              from: "ai",
              timestamp: new Date(),
            },
          ]);
          setIsComplete(true);
        }, 1500);
      }, 500);
    }
  }, [
    input,
    isTyping,
    currentQuestionIndex,
    hasShownVoicePrompt,
    addAIMessage,
    saveMutation,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showInitialButtons =
    messages.length === 1 && currentQuestionIndex === -1;
  const totalQuestions = INTAKE_QUESTIONS.length;
  const progress =
    currentQuestionIndex >= 0
      ? Math.min(((currentQuestionIndex + 1) / totalQuestions) * 100, 100)
      : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <TaureanLogo />
          {currentQuestionIndex >= 0 && !isComplete && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Question {Math.min(currentQuestionIndex + 1, totalQuestions)} of{" "}
                {totalQuestions}
              </span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                from={message.from}
                timestamp={message.timestamp}
              />
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Mic className="size-4" />
                  </div>
                  <div className="rounded-lg bg-card px-4 py-3">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Initial response buttons */}
            <AnimatePresence>
              {showInitialButtons && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-wrap gap-3 pl-11"
                >
                  <Button
                    onClick={handleStartConversation}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Let&apos;s do it
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                  <Button
                    onClick={handleAskQuestion}
                    variant="outline"
                    className="border-white/10 bg-transparent text-white hover:bg-white/5"
                  >
                    I have a question first
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Voice call prompt (after question 2) */}
            <AnimatePresence>
              {currentQuestionIndex === 2 && !hasShownVoicePrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto max-w-md rounded-lg border border-white/10 bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-accent/10">
                      <Phone className="size-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        Prefer to talk through this?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        We can continue over voice.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setShowVoiceModal(true)}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Switch to voice call
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completion state */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center pt-6"
                >
                  <a
                    href="https://taureanco.com"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
                  >
                    Return to Taurean
                    <ArrowRight className="size-4" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input area */}
      {!isComplete && currentQuestionIndex >= 0 && (
        <div className="sticky bottom-0 border-t border-white/5 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-6 py-4">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your response..."
                disabled={isTyping}
                className={cn(
                  "min-h-[52px] resize-none rounded-lg border-white/10 bg-card pr-12 text-white placeholder:text-muted-foreground",
                  "focus:border-accent focus:ring-accent",
                )}
                rows={1}
              />
              <Button
                type="button"
                size="icon"
                onClick={handleSubmit}
                disabled={!input.trim() || isTyping}
                className={cn(
                  "absolute right-2 bottom-2 size-8",
                  "bg-accent text-accent-foreground hover:bg-accent/90",
                  "disabled:opacity-50",
                )}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Voice call modal */}
      <Dialog open={showVoiceModal} onOpenChange={setShowVoiceModal}>
        <DialogContent className="border-white/10 bg-card text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Voice calls coming soon
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              We&apos;re building voice-enabled conversations. For now,
              let&apos;s continue via text.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setShowVoiceModal(false)}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Continue in chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
