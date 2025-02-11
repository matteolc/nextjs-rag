"use server";
import { VectorStore } from "@/services/vector-store";
import { createClient } from "@/utils/supabase/server";

export async function loader({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: upload } = await supabase
    .from("uploads")
    .select("*")
    .eq("id", params.id)
    .single();

  const vectorStore = new VectorStore({ supabase });
  const documents = await vectorStore.queryVectorStore({
    query: "",
    filter: { upload_id: params.id },
    k: 1,
  });

  return { upload, documents };
}
