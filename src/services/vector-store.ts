import type { Document, DocumentInterface } from "@langchain/core/documents";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import type {
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { createServerClient } from "@supabase/ssr";
import { env } from "@/utils/env.server";
import { createClient } from "@/utils/supabase/server";
import type { Database } from "@/app/db.types";
import { ChatOpenAIClient } from "@/utils/openai/server";
import condensePrompt from "@/prompts/condense-prompt";
import type { LLMResult } from "@langchain/core/outputs";
import { saveTokenUsage } from "@/services/account-usage";

export class VectorStore {
  private readonly vectorStore: SupabaseVectorStore;
  private readonly embeddings: OpenAIEmbeddings;
  private readonly supabase: ReturnType<typeof createServerClient<Database>>;

  constructor({ supabase }: { supabase: SupabaseClient<Database> }) {
    this.supabase = supabase;
    this.embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: env.OPENAI_API_KEY,
    });
    this.vectorStore = new SupabaseVectorStore(this.embeddings, {
      client: supabase,
      tableName: "documents",
      queryName: "match_documents",
    });
  }

  async addDocumentsToVectorStore({
    documents,
  }: {
    documents: Document[];
  }): Promise<string[]> {
    return await this.vectorStore.addDocuments(documents);
  }

  async deleteDocumentsFromVectorStore({
    uploadIds,
    profileId,
    namespace,
  }: {
    uploadIds: string[];
    profileId: string;
    namespace: string;
  }): Promise<
    PostgrestSingleResponse<
      {
        id: string;
      }[]
    >
  > {
    return await this.supabase
      .from("documents")
      .delete()
      .eq("metadata->>profile_id", profileId)
      .eq("metadata->>namespace", namespace)
      .in("metadata->>upload_id", uploadIds)
      .select("id");
  }

  async createVectorStoreRetrivalChain({
    prompt,
    filter,
    k = 100,
  }: {
    prompt: string;
    filter: Record<string, string>;
    k?: number;
  }): Promise<ReturnType<typeof createRetrievalChain>> {
    const { llm } = new ChatOpenAIClient({
      callbacks: [
        {
          handleLLMEnd: (output: LLMResult) => {
            saveTokenUsage({
              namespace: filter.namespace,
              profile_id: filter.profile_id,
              supabase: this.supabase,
              service: "chat",
            })(output);
          },
        },
      ],
    });
    const retriever = this.vectorStore.asRetriever(k, filter);

    // Contextualize question
    const historyAwareRetriever = await createHistoryAwareRetriever({
      llm,
      retriever,
      rephrasePrompt: ChatPromptTemplate.fromMessages([
        ["system", condensePrompt],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
      ]),
    });

    // Answer question
    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt: ChatPromptTemplate.fromMessages([
        ["system", prompt],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
      ]),
    });

    return await createRetrievalChain({
      retriever: historyAwareRetriever,
      combineDocsChain: questionAnswerChain,
    });
  }

  async queryVectorStore({
    query,
    filter,
    k = 100,
  }: {
    query: string;
    filter: Record<string, string>;
    k: number;
  }): Promise<DocumentInterface<Record<string, string>>[]> {
    return await this.vectorStore.similaritySearch(query, k, filter);
  }
}
