"use client";

import { FileNotFoundDialog } from "../uploads/file-not-found-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { Heading } from "@/ui/heading";
import { Button } from "@/ui/button";
import { HeadingWrapper } from "@/ui/heading";
import { Card } from "@/ui/card";
import { humanReadableMIMEType } from "@/lib/file";
import { humanReadableFileSize } from "@/lib/file";
import Link from "next/link";
import { Badge } from "@/ui/badge";
import { Timestamp } from "@/components/timestamp";
import { handleDownload } from "@/lib/handle-download";
import { Table, TableBody, TableCell, TableRow } from "@/ui/table";
import type {
  DocumentMetadata,
  PdfMetadata,
} from "@/app/(protected)/uploads/[id]/page";
import type { Tables } from "@/app/db.types";
import { useState } from "react";
import type { Document } from "@langchain/core/documents";

export default function UploadPage({
  upload,
  documentMeta,
  pdfInfo,
  content,
}: {
  upload: Tables<"uploads">;
  documentMeta: DocumentMetadata;
  pdfInfo: PdfMetadata;
  content: string;
}) {
  const [errorOpen, setErrorOpen] = useState(false);
  return (
    <div className="space-y-6">
      <HeadingWrapper>
        <Heading>Upload Details</Heading>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/uploads">Back</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            onClick={() =>
              handleDownload({
                url: (upload.metadata as { url: string }).url,
                name: upload.name,
                onError: (error) => setErrorOpen(true),
              })
            }
          >
            Download
          </Button>
        </div>
      </HeadingWrapper>

      {/* Basic File Info */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold">{upload.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">
                {humanReadableMIMEType(upload.type)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {humanReadableFileSize(upload.size)}
              </span>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>
              Uploaded <Timestamp timestamp={upload.created_at} />
            </p>
            {pdfInfo?.totalPages && <p>{pdfInfo.totalPages} pages</p>}
          </div>
        </div>
      </Card>

      {/* Document Metadata */}
      {documentMeta && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Document Type</span>
                <Badge variant="outline">{documentMeta.document_type}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Domain</span>
                <Badge variant="outline">{documentMeta.domain}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Technical Level</span>
                <Badge variant="outline">{documentMeta.technical_level}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Key Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Topics</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {documentMeta.topics?.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Key Entities
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {documentMeta.key_entities?.map((entity) => (
                    <Badge
                      key={entity}
                      variant="secondary"
                      className="text-xs font-medium hover:shadow-sm transition-shadow"
                    >
                      {entity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Technical PDF Metadata */}
          {pdfInfo && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                PDF Technical Details
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Creator</TableCell>
                    <TableCell>
                      {pdfInfo.metadata?._metadata?.["xmp:creatortool"]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Created</TableCell>
                    <TableCell>
                      <Timestamp
                        timestamp={
                          pdfInfo.metadata?._metadata?.["xmp:createdate"] ??
                          null
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Modified</TableCell>
                    <TableCell>
                      <Timestamp
                        timestamp={
                          pdfInfo.metadata?._metadata?.["xmp:modifydate"] ??
                          null
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">PDF Version</TableCell>
                    <TableCell>{pdfInfo.version}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      )}

      {!documentMeta && (
        <Card className="p-6 text-center text-muted-foreground">
          No additional document metadata found
        </Card>
      )}

      {/* Document Summary */}
      {content && (
        <div className="space-y-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="summary">
              <AccordionTrigger>Document Summary</AccordionTrigger>
              <AccordionContent>
                <div
                  className="prose text-xs font-sans"
                  style={
                    {
                      "--tw-prose-body": "--primary-foreground",
                    } as React.CSSProperties
                  }
                >
                  {content}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      <FileNotFoundDialog open={errorOpen} onOpenChange={setErrorOpen} />
    </div>
  );
}
