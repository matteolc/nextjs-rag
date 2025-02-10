"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";

import { Button } from "@/ui/button";
import { DialogTrigger } from "@/ui/dialog";
import { Dialog } from "@/ui/dialog";
import { Heading } from "@/ui/heading";

import { HeadingWrapper } from "@/ui/heading";
import { PlusIcon } from "lucide-react";
import { DragAndDropZone } from "@/components/uploads/DragAndDropZone";
import { UploadsTable } from "@/components/uploads/data-table";
import { columns } from "@/components/uploads/columns";
import { useState } from "react";
import type { Tables } from "@/app/db.types";

export function UploadsPageWrapper() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [namespace, setNamespace] = useState("");
  const [data, setData] = useState<Tables<"uploads">[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  return (
    <>
      <HeadingWrapper>
        <Heading>Uploads</Heading>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusIcon className="h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent className="border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Upload Files
                </DialogTitle>
                <DialogDescription>
                  Upload files to the current workspace
                </DialogDescription>
              </DialogHeader>
              <DragAndDropZone
                namespace={namespace}
                onUploadComplete={() => {
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </HeadingWrapper>
      <UploadsTable
        columns={columns}
        data={data}
        totalRows={total}
        page={page}
        perPage={perPage}
      />
    </>
  );
}
