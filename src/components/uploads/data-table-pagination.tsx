import type { Table } from "@tanstack/react-table";
import { Button } from "@/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { DEFAULT_PER_PAGE, generateQueryParams } from "@/lib/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-2">
      <div
        className={clsx(
          "flex-1 text-sm text-muted-foreground",
          table.getFilteredRowModel().rows.length === 0 && "opacity-20",
        )}
      >
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div
          className={clsx(
            "flex items-center space-x-2",
            table.getFilteredRowModel().rows.length === 0 && "opacity-20",
          )}
        >
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize ?? DEFAULT_PER_PAGE}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              router.push(
                `?${generateQueryParams({
                  page: 1,
                  perPage: Number(value),
                })}`,
              );
            }}
          >
            <SelectTrigger className="h-8 w-[70px] border-border">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="min-w-[70px]">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="max-w-[70px]"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div
          className={clsx(
            "flex w-[100px] items-center justify-center text-sm font-medium",
            table.getFilteredRowModel().rows.length === 0 && "opacity-20",
          )}
        >
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-border"
            onClick={() => {
              table.setPageIndex(0);
              router.push(
                `?${generateQueryParams({
                  page: 1,
                  sort: table.getState().sorting[0]?.id,
                  order: table.getState().sorting[0]?.desc ? "desc" : "asc",
                  filters: table.getState().columnFilters,
                })}`,
              );
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-border"
            onClick={() => {
              table.previousPage();
              router.push(
                `?${generateQueryParams({
                  page: table.getState().pagination.pageIndex,
                  sort: table.getState().sorting[0]?.id,
                  order: table.getState().sorting[0]?.desc ? "desc" : "asc",
                  filters: table.getState().columnFilters,
                })}`,
              );
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 border-border"
            onClick={() => {
              table.nextPage();
              router.push(
                `?${generateQueryParams({
                  page: table.getState().pagination.pageIndex + 2,
                  sort: table.getState().sorting[0]?.id,
                  order: table.getState().sorting[0]?.desc ? "desc" : "asc",
                  filters: table.getState().columnFilters,
                })}`,
              );
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex border-border"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
              router.push(
                `?${generateQueryParams({
                  page: table.getPageCount(),
                  sort: table.getState().sorting[0]?.id,
                  order: table.getState().sorting[0]?.desc ? "desc" : "asc",
                  filters: table.getState().columnFilters,
                })}`,
              );
            }}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
