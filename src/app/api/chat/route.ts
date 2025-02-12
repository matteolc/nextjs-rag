import { VectorStore } from "@/services/vector-store";
import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { chat } from "@/services/chat";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const question = formData.get("question") as string;
  const history = JSON.parse(formData.get("history") as string) as [
    string,
    string,
  ][];
  const workspace = formData.get("workspace") as string;
  const profileId = formData.get("profile_id") as string;

  const supabase = await createClient();
  const vectorStore = new VectorStore({ supabase });

  try {
    const { answer, context } = await chat({
      question,
      history,
      vectorStore,
      filter: { profile_id: profileId, namespace: workspace },
    });

    return NextResponse.json({
      answer,
      question,
      context,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      success: false,
      answer:
        "I apologise, I am unable to answer this question right now, please try again.",
      question,
    });
  }
}
