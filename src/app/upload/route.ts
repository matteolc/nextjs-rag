import { workspaces } from "@/const/workspaces";
import { createClient } from "@/utils/supabase/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { env } from "@/utils/env.server";
import { PDFProcessor } from "@/services/pdf-processor";
import { VectorStore } from "@/services/vector-store";
import { del } from "@vercel/blob";
import { createUploads } from "@/services/uploads";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const namespace = searchParams.get("namespace") ?? workspaces[0].id;
  const body = (await request.json()) as HandleUploadBody;
  const supabase = await createClient();
  const vectorStore = new VectorStore({ supabase });

  const response = await handleUpload({
    token: env.BLOB_READ_WRITE_TOKEN,
    body,
    request,
    onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
      console.log("Token generation request received:", {
        pathname,
        clientPayload,
        multipart,
      });
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not found");
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();
      if (!profile) {
        throw new Error("Profile not found");
      }

      const payload = clientPayload ? JSON.parse(clientPayload) : {};
      return {
        allowedContentTypes: ["application/pdf"],
        tokenPayload: JSON.stringify({
          profileId: profile.id,
          namespace: payload.namespace || namespace,
          keepInCloud: payload.keepInCloud || true,
        }),
      };
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      console.log("Upload completed callback received:", {
        blob,
        tokenPayload,
      });
      try {
        const parsedPayload = tokenPayload ? JSON.parse(tokenPayload) : {};
        const uploadNamespace = parsedPayload.namespace || namespace;
        const profileId = parsedPayload.profileId;

        const { downloadUrl } = blob;
        const response = await fetch(downloadUrl);
        const fileBlob = await response.blob();
        const fileName = blob.pathname.split("/").pop() || "document.pdf";
        const file = new File([fileBlob], fileName, {
          type: "application/pdf",
        });

        const url = parsedPayload.keepInCloud ? downloadUrl : null;

        const { ids, error } = await createUploads({
          profileId,
          namespace: uploadNamespace,
          supabase,
        })([file], [{ url }]);

        if (error) {
          return;
        }

        const documents = await PDFProcessor.convertToStructuredDocuments({
          files: [file],
          metadata: {
            namespace: uploadNamespace,
            profile_id: profileId,
            upload_id: ids[0],
            url,
          },
          supabase,
        });
        await vectorStore.addDocumentsToVectorStore({
          documents,
        });

        if (!parsedPayload.keepInCloud) {
          await del(blob.url);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return new NextResponse(JSON.stringify(response));
}
