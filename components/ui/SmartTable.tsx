"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Card } from "./card";
import { Input } from "./input";
import { SmartPagination } from "./SmartPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export type ApiListDetails = {
  skip: number;
  limit: number;
  total: number;
  pages: number;
};

export type ApiListResponse<TData, TFilter = unknown> = {
  success: boolean;
  data: TData[];
  filters: TFilter[];
  details: ApiListDetails;
};

export interface CustomDataTableProps<TData> {
  title?: string | React.ReactNode;
  data: TData[];

  columns: ColumnDef<TData>[];
  filterColumnKey?: string;
  filterPlaceholder?: string;
  emptyMessage?: string;
  customButton?: React.ReactNode;
}

export function SmartTable<TData>({
  title,
  data,
  columns,
  filterColumnKey,
  filterPlaceholder = "Filter...",
  emptyMessage = "No results found.",
  customButton,
}: CustomDataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  const filterColumn = filterColumnKey
    ? table.getColumn(filterColumnKey)
    : null;

  return (
    <Card className="w-[96%] mx-auto border border-gray-300 rounded-sm  py-2 gap-4 h-full">
      <div className="flex items-center justify-between gap-2  px-3 ">
        {title && (
          <h3 className="text-xs text-tint-blue-500 font-semibold my-1">
            {title}
          </h3>
        )}
        {filterColumn && (
          <Input
            placeholder={filterPlaceholder}
            value={(filterColumn.getFilterValue() as string) ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              filterColumn.setFilterValue(value);

              const params = new URLSearchParams(
                searchParams ? Array.from(searchParams.entries()) : [],
              );

              if (value) params.set("search", value);
              else params.delete("search");

              router.replace(`${pathname}?${params.toString()}`);
            }}
            className="w-fit min-w-1/4 text-sm font-medium border border-gray-300 rounded-lg"
          />
        )}

        {customButton}
      </div>
      <Table>
        <TableHeader className="border-t border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className=" bg-slate-50 text-sm font-medium text-slate-500 uppercase text-center"
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
          {data.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50 transition ">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-xs px-6 py-4 text-slate-700 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-12 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <SmartPagination total={10} />{" "}
    </Card>
  );
}
