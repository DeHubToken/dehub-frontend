"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Table as TableType,
  VisibilityState
} from "@tanstack/react-table";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: (table: TableType<TData>, totalRows: number) => ReactNode;
  tableWrapperProps?: HTMLAttributes<HTMLDivElement>;
  tablePagination?: (table: TableType<TData>) => ReactNode;
  tableProps?: typeof Table;
  tableBodyProps?: typeof TableBody;
  tableCellProps?: ComponentProps<typeof TableCell>;
  tableHeadProps?: ComponentProps<typeof TableHead>;
  tableHeaderProps?: ComponentProps<typeof TableHeader>;
  tableRowProps?: ComponentProps<typeof TableRow>;
  status?: "idle" | "loading" | "success" | "error";
  isFetching?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    columns,
    data,
    toolbar,
    className,
    tableWrapperProps,
    tablePagination,
    tableProps,
    tableBodyProps,
    tableCellProps,
    tableHeadProps,
    tableRowProps,
    tableHeaderProps,
    ...rest
  } = props;

  const { className: tableWrapperClassname, ...tableWrapperRestProps } = tableWrapperProps ?? {};

  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  const toolbarComponent = toolbar ? toolbar(table, data.length) : null;
  const paginationComponent = tablePagination ? tablePagination(table) : null;

  return (
    <div className={className} {...rest}>
      {toolbarComponent}
      <div className={tableWrapperClassname} {...tableWrapperRestProps}>
        <Table {...tableProps}>
          <TableHeader {...tableHeaderProps}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} {...tableRowProps}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} {...tableHeadProps}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...tableBodyProps}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  {...tableRowProps}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} {...tableCellProps}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {paginationComponent}
      </div>
    </div>
  );
}
