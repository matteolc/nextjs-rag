import type { AIMessage } from "@langchain/core/messages";

declare module "@langchain/core/outputs" {
  export interface Generation {
    /**
     * Generated text output
     */
    text: string;
    /**
     * Raw generation info response from the provider.
     * May include things like reason for finishing (e.g. in {@link OpenAI})
     */
    generationInfo?: Record<string, unknown>;
    message: AIMessage;
  }

  export interface LLMResult {
    generations: Generation[][];
    llmOutput?: Record<string, unknown>;
    /**
     * Dictionary of run metadata
     */
    [RUN_KEY]?: Record<string, unknown>;
  }
}
