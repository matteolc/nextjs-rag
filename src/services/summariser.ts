import { StructuredOutputParser } from "@langchain/core/output_parsers";
import type { LLMResult } from "@langchain/core/outputs";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import type { ZodRawShape } from "zod";
import type { ZodObject } from "zod";
import { ChatOpenAIClient } from "@/utils/openai/server";
import summarisePrompt from "@/prompts/summarise-prompt";
import { saveTokenUsage } from "@/services/account-usage";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/app/db.types";

const Summariser = {
  summarise: async ({
    text,
    profile_id,
    namespace,
    supabase,
  }: {
    text: string;
    profile_id: string;
    namespace: string;
    supabase: SupabaseClient<Database>;
  }) => {
    const { llm } = new ChatOpenAIClient({
      callbacks: [
        {
          handleLLMEnd: (output: LLMResult) => {
            saveTokenUsage({
              namespace,
              profile_id,
              supabase,
              service: "summarization",
            })(output);
          },
        },
      ],
    });
    return await ChatPromptTemplate.fromTemplate(summarisePrompt)
      .pipe(llm)
      .invoke({ text });
  },

  structureChain: ({
    schema,
    prompt,
    profile_id,
    namespace,
    supabase,
  }: {
    schema: ZodObject<ZodRawShape>;
    prompt: string;
    profile_id: string;
    namespace: string;
    supabase: SupabaseClient<Database>;
  }) => {
    const parser = StructuredOutputParser.fromZodSchema(schema);
    const { llm } = new ChatOpenAIClient({
      callbacks: [
        {
          handleLLMEnd: (output: LLMResult) => {
            saveTokenUsage({
              namespace,
              profile_id,
              supabase,
              service: "extraction",
            })(output);
          },
        },
      ],
    });
    const chain = RunnableSequence.from([
      ChatPromptTemplate.fromTemplate(prompt),
      llm,
      parser,
    ]);
    const formatInstructions = parser.getFormatInstructions();
    return { chain, formatInstructions };
  },

  structure: async ({
    text,
    schema,
    prompt,
    profile_id,
    namespace,
    supabase,
  }: {
    text: string;
    schema: ZodObject<ZodRawShape>;
    prompt: string;
    profile_id: string;
    namespace: string;
    supabase: SupabaseClient<Database>;
  }) => {
    const { chain, formatInstructions } = Summariser.structureChain({
      schema,
      prompt,
      profile_id,
      namespace,
      supabase,
    });
    return await chain.invoke({
      text,
      format_instructions: formatInstructions,
    });
  },
};

export { Summariser };
