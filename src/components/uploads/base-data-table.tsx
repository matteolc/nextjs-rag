import type { Table } from "@tanstack/react-table";
import {
  Table as TableComponent,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/ui/table";
import { DataTableRow } from "./data-table-row";
import { flexRender } from "@tanstack/react-table";
import { Heading, Paragraph } from "@/ui/heading";
import { PackageOpen } from "lucide-react";

export function BaseDataTable<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="rounded-md border border-border overflow-x-auto">
      <TableComponent
        style={{
          tableLayout: "fixed",
          minWidth: "100%",
          width: "fit-content",
        }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-border">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{
                    width: header.getSize(),
                    minWidth: header.column.columnDef.minSize,
                    maxWidth: header.column.columnDef.maxSize,
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table
              .getRowModel()
              .rows.map((row) => <DataTableRow key={row.id} row={row} />)
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-48 text-center"
              >
                <div className="flex flex-col items-center justify-center gap-3 py-8">
                  <PackageOpen className="h-10 w-10 text-muted-foreground/80 stroke-[1.5]" />
                  <div className="space-y-1">
                    <Heading>No matches found</Heading>
                    <Paragraph>
                      Try adjusting your filters or upload a new file
                    </Paragraph>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableComponent>
    </div>
  );
}
