import { VectorStore } from "@/services/vector-store";
import { createClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { chatWithStreaming } from "@/services/chat";

export const dynamic = "force-dynamic";

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
    const stream = await chatWithStreaming({
      question,
      history,
      vectorStore,
      filter: { profile_id: profileId, namespace: workspace },
    });

    // Convert the stream to a proper format
    const responseStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            value.answer && controller.enqueue(value.answer);
          }
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
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
