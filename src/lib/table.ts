import type { ColumnFiltersState } from "@tanstack/react-table";
import type { NextRequest } from "next/server";

export interface TableParams {
  page: number;
  perPage: number;
  sort: string | null;
  order: "asc" | "desc" | null;
  filters: Array<{ id: string; value: string }>;
}

export const DEFAULT_PER_PAGE = 10;

export async function getTableParams(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("perPage") || DEFAULT_PER_PAGE);
  const sortParam = searchParams.get("sort")?.split(".");
  const filters = safeJsonParse(searchParams.get("filter") || "[]");

  return {
    page,
    perPage,
    sort: sortParam?.[0] || null,
    order: (sortParam?.[1] as "asc" | "desc") || null,
    filters,
  };
}

function safeJsonParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
}

export function generateQueryParams(params: {
  page?: number;
  perPage?: number;
  sort?: string | null;
  order?: "asc" | "desc" | null;
  filters?: ColumnFiltersState;
}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.perPage) searchParams.set("perPage", String(params.perPage));
  if (params.sort && params.order) {
    searchParams.set("sort", `${params.sort}.${params.order}`);
  }
  if (params.filters) {
    searchParams.set("filter", JSON.stringify(params.filters));
  }

  return searchParams.toString();
}
