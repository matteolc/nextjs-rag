import UploadPage from "@/components/pages/upload-page";
import { VectorStore } from "@/services/vector-store";
import { createClient } from "@/utils/supabase/server";
import { loader } from "./loader";

export type PdfMetadata = {
  info?: {
    Creator?: string;
    ModDate?: string;
    Trapped?: { name: string };
    Producer?: string;
    CreationDate?: string;
    IsXFAPresent?: boolean;
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
  };
  metadata?: {
    _metadata?: {
      "xmp:createdate"?: string;
      "xmp:modifydate"?: string;
      "xmp:creatortool"?: string;
      // Add other needed xmp fields
    } & Record<string, unknown>;
  };
  version?: string;
  totalPages?: number;
};

export type DocumentMetadata = {
  pdf?: PdfMetadata;
  domain?: string;
  topics?: string[];
  key_entities?: string[];
  document_type?: string;
  technical_level?: string;
  content?: string;
};

export default async function Screen({ params }: { params: { id: string } }) {
  const { upload, documents } = await loader({ params });

  if (!upload) {
    return <div>Upload not found</div>;
  }

  return <UploadPage upload={upload} documents={documents} />;
}
