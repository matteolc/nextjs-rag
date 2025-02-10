import type { Row } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/ui/table";
import { flexRender } from "@tanstack/react-table";

interface DataTableRowProps<TData> {
  row: Row<TData>;
}

export function DataTableRow<TData>({ row }: DataTableRowProps<TData>) {
  return (
    <TableRow className="border-border">
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
