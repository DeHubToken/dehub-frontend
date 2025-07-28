"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.new";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import dayjs from "@/libs/dayjs";
import { miniAddress } from "@/libs/strings";
import { getExplorerUrl } from "@/libs/utils";

import { getDpayTnx } from "@/services/dpay";

import { TnxData, TnxResponse } from "../types";
import TokenAndChainIcon from "./TokenAndChainIcon";

const PAGE_SIZE = 10;

const DataTableTnxListTop = () => {
  const [data, setData] = useState<TnxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const res: TnxResponse = await getDpayTnx({ page: page + 1, limit: PAGE_SIZE });
      if (!res.success) {
        toast.error(res.error || "Failed to fetch transactions");
        return;
      }
      setData(res?.data?.tnxs || []);
      setTotal(res?.data?.total || 0);
    } catch (error) {
      toast.error("Something went wrong while fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageIndex);
  }, [pageIndex]);

  const columns = useMemo<ColumnDef<TnxData>[]>(
    () => [
      {
        header: "Token",
        accessorKey: "tokenSymbol",
        cell: ({ row }) => (
          <TokenAndChainIcon
            tokenSymbol={row.original.tokenSymbol}
            chainId={row.original.chainId}
          />
        )
      },
      {
        header: "Amount",
        accessorFn: (row) => row.tokenReceived ?? row.approxTokensToReceive,
        sortingFn: "basic",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex flex-col">
              <span className="text-base font-semibold">
                {Number(tx.tokenReceived ?? tx.approxTokensToReceive).toLocaleString()}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                ≈ {Number(tx.amount).toFixed(2)} {tx?.currency?.toUpperCase() ?? "USD"}
              </span>
            </div>
          );
        }
      },
      {
        header: "To",
        accessorKey: "receiverAddress",
        cell: ({ getValue }) => miniAddress(getValue() as string)
      },
      {
        header: "Status",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex flex-wrap gap-1">
              <span
                className={`rounded-full bg-opacity-50 px-2 py-0.5 text-xs font-medium ${
                  tx.status_stripe === "succeeded" || tx.status_stripe === "complete"
                    ? "bg-green-700 text-white"
                    : "bg-yellow-700 text-yellow-100"
                }`}
              >
                {tx.status_stripe}
              </span>
              <span
                className={`rounded-full bg-opacity-25 px-2 py-0.5 text-xs font-medium ${
                  tx.tokenSendStatus === "sent"
                    ? "bg-green-700 text-green-100"
                    : "bg-yellow-700 text-yellow-100"
                }`}
              >
                {tx.tokenSendStatus}
              </span>
            </div>
          );
        }
      },
      {
        header: "Txn Hash",
        accessorKey: "tokenSendTxnHash",
        cell: ({ row }) => {
          const tx = row.original;
          return tx?.tokenSendTxnHash ? (
            <a
              href={getExplorerUrl(tx.chainId, tx.tokenSendTxnHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {miniAddress(tx.tokenSendTxnHash)}
            </a>
          ) : (
            <span>{tx.tokenSendStatus}</span>
          );
        }
      },
      {
        header: "Time",
        accessorKey: "createdAt",
        cell: ({ getValue }) => dayjs(getValue() as string).fromNow()
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <Link
            href={`/dpay/tnx/${row.original.sessionId}`}
            className="text-sm font-medium hover:underline"
          >
            Check
          </Link>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / PAGE_SIZE),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex,
        pageSize: PAGE_SIZE
      },
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater({ pageIndex, pageSize: PAGE_SIZE }) : updater;
      setPageIndex(newState.pageIndex);
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <div className="space-y-6 rounded-2xl border border-theme-neutrals-700 p-10">
      <Input
        type="text"
        placeholder="Search by address..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full max-w-md"
      />

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽"
                  }[header.column.getIsSorted() as string] ?? null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, rowIdx) => (
                <TableRow key={rowIdx} className="animate-pulse">
                  {Array.from({ length: columns.length }).map((__, colIdx) => (
                    <TableCell key={colIdx}>
                      <div className="h-10 w-full max-w-[100px] animate-pulse rounded bg-theme-neutrals-700">
                        <p className="text-sm opacity-0">Loading</p>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/20">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          variant="gradientOne"
        >
          ← Prev
        </Button>
        <span className="text-sm text-gray-400">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          variant="gradientOne"
        >
          Next →
        </Button>
      </div>
    </div>
  );
};

export default DataTableTnxListTop;
