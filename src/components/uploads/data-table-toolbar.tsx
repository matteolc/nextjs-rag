import type { Table } from "@tanstack/react-table";
import { Input } from "@/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { typeFilters } from "./columns";
import { RepeatIcon } from "lucide-react";
import { Button } from "@/ui/button";
import { DataTableDeleteAction } from "./data-table-delete-action";
import type { Tables } from "@/app/db.types";
import { useRouter } from "next/navigation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const hasFilters = table.getState().columnFilters.length > 0;
  const hasSorting = table.getState().sorting.length > 0;
  const typeColumn = table.getColumn("type");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] border-border"
        />
        {typeColumn && (
          <DataTableFacetedFilter
            column={typeColumn}
            title="Filter Types"
            options={typeFilters}
          />
        )}
        {(hasFilters || hasSorting) && (
          <Button
            variant="ghost"
            className="h-8 px-3 text-secondary-foreground hover:text-primary"
            onClick={() => {
              table.getColumn("name")?.setFilterValue("");
              table.resetColumnFilters();
              table.resetSorting();
              table.setPageIndex(0);
            }}
          >
            <RepeatIcon className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
      <DataTableDeleteAction
        table={table as unknown as Table<Tables<"uploads">>}
      />
    </div>
  );
}
