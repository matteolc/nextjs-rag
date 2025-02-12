import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { z } from "zod";
import { Summariser } from "./summariser";
import extractMetadataPrompt from "@/prompts/extract-metadata-prompt";
import type { SupabaseClient } from "@supabase/supabase-js";

const PDFProcessor = {
  convertFileToRawDocuments: async (file: File) => {
    const loader = new PDFLoader(file, { splitPages: false });
    const rawDocuments = await loader.load();
    for (const document of rawDocuments) {
      document.pageContent = document.pageContent.replace(/\n/g, " ");
      document.metadata = {
        ...document.metadata,
        source: file.name,
      };
    }
    return rawDocuments;
  },

  convertToRawDocuments: async (files: File[]) => {
    const rawDocumentsByFile = await Promise.all(
      files.map(async (file) => {
        return await PDFProcessor.convertFileToRawDocuments(file);
      }),
    );
    return rawDocumentsByFile.flat(1);
  },

  convertToStructuredDocuments: async ({
    files,
    metadata,
    supabase,
  }: {
    files: File[];
    metadata: Record<string, string | null>;
    supabase: SupabaseClient;
  }) => {
    const rawDocuments = await PDFProcessor.convertToRawDocuments(files);
    const structuredObjects = await Promise.all(
      rawDocuments.map(async (document) => {
        return await Summariser.structure({
          text: document.pageContent,
          schema: z.object({
            document_type: z
              .string()
              .describe(
                "Determine the type of document (e.g., research paper, technical report, email, blog post, news article)",
              ),
            topics: z
              .array(z.string())
              .describe("List 3-5 main topics or themes discussed"),
            key_entities: z
              .array(z.string())
              .describe(
                "Extract important named entities (people, organizations, products, technologies)",
              ),
            time_references: z
              .array(z.string())
              .describe(
                "Extract any dates, time periods, or temporal references",
              ),
            domain: z
              .string()
              .describe(
                "Identify the primary domain/field (e.g., technology, finance, healthcare)",
              ),
            technical_level: z
              .string()
              .describe(
                "Rate technical complexity on scale: basic/intermediate/advanced",
              ),
            target_audience: z.string().describe("Identify intended audience"),
            key_terms: z
              .array(z.string())
              .describe("List important domain-specific terminology used"),
            content_structure: z
              .string()
              .describe(
                "Describe document structure (e.g., sections, headers)",
              ),
            language_style: z
              .string()
              .describe(
                "Identify writing style (formal/technical/conversational)",
              ),
          }),
          prompt: extractMetadataPrompt,
          profile_id: metadata.profile_id as string,
          namespace: metadata.namespace as string,
          supabase,
        });
      }),
    );
    return structuredObjects.map((structuredObject, index) => {
      return new Document({
        pageContent: rawDocuments[index].pageContent.replace(
          // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
          /[\x00-\x1F]/g,
          " ",
        ),
        metadata: {
          ...rawDocuments[index].metadata,
          ...structuredObject,
          ...metadata,
        },
      });
    });
  },

  convertToSummarisedDocuments: async ({
    files,
    metadata,
    supabase,
  }: {
    files: File[];
    metadata: Record<string, string>;
    supabase: SupabaseClient;
  }) => {
    const rawDocuments = await PDFProcessor.convertToRawDocuments(files);
    const summaries = await Promise.all(
      rawDocuments.map(async (document) => {
        const { content: summary } = await Summariser.summarise({
          text: document.pageContent,
          profile_id: metadata.profile_id as string,
          namespace: metadata.namespace as string,
          supabase,
        });
        return summary;
      }),
    );
    const documents = summaries.map((summary, index) => {
      const sections = (summary as string).split("---");
      const cleanSections = sections
        .map((section) => section.replace(/\n/g, " ").trim())
        .filter(Boolean);
      return cleanSections.map((section) => {
        return new Document({
          pageContent: section,
          metadata: {
            ...rawDocuments[index].metadata,
            ...metadata,
          },
        });
      });
    });
    return documents.flat(1);
  },
};

export { PDFProcessor };
