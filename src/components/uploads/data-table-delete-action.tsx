import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";

import { Button } from "@/ui/button";
import { DialogContent, DialogFooter } from "@/ui/dialog";

import { Dialog } from "@/ui/dialog";
import { Trash, AlertTriangle } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/ui/table";
import type { Tables } from "@/app/db.types";
import type { Table as ReactTable } from "@tanstack/react-table";
import { useContext, useState } from "react";
import { WorkspaceContext } from "../workspace-context";

export function DataTableDeleteAction({
  table,
}: {
  table: ReactTable<Tables<"uploads">>;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const workspace = useContext(WorkspaceContext);

  const handleBulkDelete = () => {
    const formData = new FormData();
    const selectedIds = Object.keys(table.getState().rowSelection);

    for (const row of table
      .getFilteredRowModel()
      .rows.filter((row) => selectedIds.includes(row.id))) {
      formData.append("ids", row.original.id);
      formData.append("names", row.original.name);
      formData.append("namespace", workspace ?? "");
    }

    setDeleteDialogOpen(false);
    table.setRowSelection({});
  };

  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      {Object.keys(table.getState().rowSelection).length > 0 && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Selected ({Object.keys(table.getState().rowSelection).length})
        </Button>
      )}
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[525px] border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Delete Documents</DialogTitle>
          <DialogDescription>
            You are permanently deleting{" "}
            {Object.keys(table.getState().rowSelection).length} documents.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="max-h-[50vh] overflow-y-auto">
            <Table className="border border-border rounded-lg [&_th]:uppercase [&_th]:text-xs">
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-[70%]">Document Name</TableHead>
                  <TableHead className="text-right">Upload Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table
                  .getFilteredRowModel()
                  .rows.filter((row) =>
                    Object.keys(table.getState().rowSelection).includes(row.id),
                  )
                  .map((row) => (
                    <TableRow key={row.id} className="border-border">
                      <TableCell className="font-medium">
                        {row.original.name}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {new Date(
                          row.original.created_at as string,
                        ).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="rounded-lg py-2 px-3 border border-yellow-600">
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p>This action is not reversible. Please be certain.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleBulkDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
