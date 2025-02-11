import type { LLMResult } from "@langchain/core/outputs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/app/db.types";

export const getTokenUsage = ({ output }: { output: LLMResult }) => {
  const { message } = output.generations[0][0];
  const tokenUsage = message.response_metadata?.tokenUsage;
  const promptTokens = tokenUsage?.promptTokens;
  const completionTokens = tokenUsage?.completionTokens;
  const model = message.response_metadata?.model_name;
  const messageId = message.id;
  return {
    promptTokens,
    completionTokens,
    model,
    messageId,
  };
};

export const saveTokenUsage = ({
  namespace,
  profile_id,
  service,
  supabase,
}: {
  namespace: string;
  profile_id: string;
  supabase: SupabaseClient<Database>;
  service: "chat" | "summarization" | "extraction" | "other";
}) => {
  return async (output: LLMResult) => {
    try {
      const { promptTokens, completionTokens, model, messageId } =
        getTokenUsage({
          output,
        });

      await supabase.from("token_consumption").insert({
        prompt_tokens: promptTokens as number,
        completion_tokens: completionTokens as number,
        model,
        message_id: messageId as string,
        namespace,
        profile_id,
        service,
      });
    } catch (error) {
      console.error("Failed to save token usage", error);
    }
  };
};

export const getServiceUsage = (
  service: "chat" | "summarization" | "extraction",
  tokenUsage: Tables<"token_aggregation">[],
) => {
  const daily =
    tokenUsage
      ?.filter(
        (entry) =>
          entry.service === service &&
          new Date(entry.time_bucket).toDateString() ===
            new Date().toDateString(),
      )
      .reduce((sum, entry) => sum + (entry.total_tokens || 0), 0) || 0;

  const total =
    tokenUsage
      ?.filter((entry) => entry.service === service)
      .reduce((sum, entry) => sum + (entry.total_tokens || 0), 0) || 0;

  return { daily, total };
};
