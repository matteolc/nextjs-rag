import type { LLMResult } from "@langchain/core/outputs";
import { ChatOpenAI } from "@langchain/openai";
import { env } from "@/utils/env.server";

export type ChatOpenAIModel = "gpt-4o-mini" | "gpt-4o";

export class ChatOpenAIClient {
  llm: ChatOpenAI;

  constructor({
    temperature,
    model,
    callbacks,
  }: {
    temperature?: number;
    model?: ChatOpenAIModel;
    callbacks?: {
      handleLLMEnd: (output: LLMResult) => void;
    }[];
  }) {
    this.llm = new ChatOpenAI({
      temperature: temperature ?? 0,
      model: model ?? "gpt-4o-mini",
      apiKey: env.OPENAI_API_KEY,
      callbacks,
    });
  }
}
