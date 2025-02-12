"use server";
import { VectorStore } from "@/services/vector-store";
import { createClient } from "@/utils/supabase/server";

export async function loader(params: Promise<{ id: string }>) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: upload } = await supabase
    .from("uploads")
    .select("*")
    .eq("id", id)
    .single();

  const vectorStore = new VectorStore({ supabase });
  const documents = await vectorStore.queryVectorStore({
    query: "",
    filter: { upload_id: id },
    k: 1,
  });

  return { upload, documents };
}
