import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { VectorStore } from "./vector-store";
import chatPrompt from "@/prompts/chat-prompt";
import type { Document } from "@langchain/core/documents";

export const chat = async ({
  question,
  history,
  vectorStore,
  filter,
}: {
  question: string;
  history: [string, string][];
  vectorStore: VectorStore;
  filter: {
    profile_id: string;
    namespace: string;
  };
}) => {
  const chain = await vectorStore.createVectorStoreRetrivalChain({
    prompt: chatPrompt,
    filter,
  });
  const { answer, context } = (await chain.invoke({
    chat_history: history.flatMap(([human, ai]: [string, string]) => [
      new HumanMessage(human),
      new AIMessage(ai),
    ]),
    input: question.trim().replaceAll("\n", " "),
  })) as {
    answer: string;
    context: Document[];
  };

  return { answer, question, context };
};
