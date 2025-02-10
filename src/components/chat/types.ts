import type { Document } from "@langchain/core/documents";

export const MessageRole = {
  user: "userMessage",
  system: "apiMessage",
} as const;

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];

export type Message = {
  type: MessageRole;
  message: string;
  isStreaming?: boolean;
  context?: Document[];
};
