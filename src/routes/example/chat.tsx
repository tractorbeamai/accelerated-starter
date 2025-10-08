"use client";

import { FormEvent, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { MessageSquare } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";

export const Route = createFileRoute("/example/chat")({
  component: ChatPage,
});

function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/example/api/chat",
    }),
  });

  const handleSubmit = (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const text = message.text?.trim();
    if (text) {
      sendMessage({ text });
      setInput("");
    }
  };

  return (
    <div className="relative mx-auto size-full h-[600px] max-w-4xl rounded-lg border p-6">
      <div className="flex h-full flex-col">
        <Conversation>
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<MessageSquare className="size-12" />}
                title="Start a conversation"
                description="Type a message below to begin chatting"
              />
            ) : (
              messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts?.map((part) => {
                      switch (part.type) {
                        case "text": {
                          return (
                            <Response
                              key={`${message.id}-text-${part.text.slice(0, 20)}`}
                            >
                              {part.text}
                            </Response>
                          );
                        }
                        default: {
                          return null;
                        }
                      }
                    })}
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput
          onSubmit={handleSubmit}
          className="relative mx-auto mt-4 w-full max-w-2xl"
        >
          <PromptInputTextarea
            value={input}
            placeholder="Say something..."
            onChange={(e) => {
              setInput(e.currentTarget.value);
            }}
            className="pr-12"
          />
          <PromptInputSubmit
            status={status === "streaming" ? "streaming" : "ready"}
            disabled={!input.trim()}
            className="absolute bottom-1 right-1"
          />
        </PromptInput>
      </div>
    </div>
  );
}
