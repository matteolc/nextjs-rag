import { Button } from "@/ui/button";
import { Download } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/ui/alert-dialog";
import { FileNotFoundDialog } from "./file-not-found-dialog";
import { handleDownload } from "@/lib/handle-download";

interface DataTableRowActionsProps<
  TData extends {
    id: string;
    metadata: unknown;
    name?: string;
  },
> {
  row: Row<TData>;
}

export function DataTableRowActions<
  TData extends {
    id: string;
    metadata: unknown;
    name?: string;
  },
>({ row }: DataTableRowActionsProps<TData>) {
  const [errorOpen, setErrorOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        className="ml-auto flex h-8 w-8 p-0"
        onClick={() =>
          handleDownload({
            url: (row.original.metadata as { url: string }).url,
            name: row.original.name || "download",
            onError: (error) => setErrorOpen(true),
          })
        }
        title="Download"
      >
        <Download className="h-4 w-4" />
        <span className="sr-only">Download</span>
      </Button>

      <FileNotFoundDialog open={errorOpen} onOpenChange={setErrorOpen} />
    </>
  );
}
