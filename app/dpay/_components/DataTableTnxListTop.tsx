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

import dayjs from "@/libs/dayjs";
import { miniAddress } from "@/libs/strings";
import { getExplorerUrl } from "@/libs/utils";

import { getDpayTnx } from "@/services/dpay";

import { TnxData, TnxResponse } from "../types";
import TokenAndChainIcon from "./TokenAndChainIcon";
import { Input } from "@/components/ui/input.new";

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
        accessorFn: (row) => row.amount,
        sortingFn: "basic",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex flex-col">
              <span className="text-base font-semibold">
                {Number(tx.approxTokensToSent ?? tx.approxTokensToReceive).toLocaleString()}
              </span>
              <span className="text-xs font-medium">
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
            <div>
              <span
                className={`rounded-full bg-opacity-5 px-2 py-0.5 text-xs font-medium ${
                  tx.status_stripe === "succeeded"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {tx.status_stripe}
              </span>
              <span
                className={`rounded-full bg-opacity-25 px-2 py-0.5 text-xs font-medium ${
                  tx.tokenSendStatus === "sent"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
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
    <div className="rounded-2xl bg-gray-50 bg-opacity-5 p-6 shadow-xl">
      <h2 className="mb-4 text-xl font-semibold">🔄 Latest Transactions</h2>

      <Input
        type="text"
        placeholder="Search by address..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full rounded-md border border-gray-30 px-3 py-2 text-sm shadow-sm"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b text-left">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="cursor-pointer py-2 pr-4"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: " 🔼",
                      desc: " 🔽"
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: PAGE_SIZE }).map((_, rowIdx) => (
                  <tr key={rowIdx} className="animate-pulse">
                    {Array.from({ length: columns.length }).map((__, colIdx) => (
                      <td key={colIdx} className="py-2 pr-4">
                        <div className="h-4 w-full max-w-[100px] rounded bg-gray-300"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 hover:bg-opacity-25">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-2 pr-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded px-4 py-1 text-sm font-medium text-gray-500 disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-400">
          Page {pageIndex + 1} of {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="rounded px-4 py-1 text-sm font-medium text-gray-500 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default DataTableTnxListTop;
