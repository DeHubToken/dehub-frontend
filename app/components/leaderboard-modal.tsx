"use client";

import type { LeaderboradResponse } from "@/services/nfts/leaderborad";
import type { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from "@radix-ui/react-icons";

import { DataTable } from "@/components/data-grid/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { truncate } from "@/libs/strings";
import { createAvatarName } from "@/libs/utils";

import { formatNumber } from "@/web3/utils/format";
import { getAvatarUrl } from "@/web3/utils/url";

type Props = {
  data: LeaderboradResponse;
  trigger?: React.ReactNode;
};

export const leaderboardColumns: ColumnDef<LeaderboradResponse["result"]["byWalletBalance"][0]>[] =
  [
    {
      id: "index",
      header: () => <div>#</div>,
      cell: ({ row, table }) => (
        <div className="w-[80px]">
          {table.getSortedRowModel().flatRows.findIndex((r) => r.id === row.id) + 1}
        </div>
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      id: "holders",
      accessorKey: "userDisplayName",
      header: () => <div>Holders</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex h-auto w-full items-center justify-start gap-2">
            <Avatar className="size-10 rounded-full object-cover">
              <AvatarFallback>
                {createAvatarName(user.userDisplayName || user?.username || "User")}
              </AvatarFallback>
              <AvatarImage src={getAvatarUrl(user.avatarUrl || "")} />
            </Avatar>
            <Link href={`/profile/${user?.username || user.account}`}>
              {truncate(user?.username || user.userDisplayName || user.account, 14)}
            </Link>
          </div>
        );
      }
      // enableSorting: false,
      // enableHiding: false
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <div className="flex items-center">
          Holdings
          {column.getIsSorted() === "desc" ? (
            <button onClick={() => column.toggleSorting(false)}>
              <ArrowDownIcon className="ml-2 size-4" />
            </button>
          ) : column.getIsSorted() === "asc" ? (
            <button onClick={() => column.toggleSorting(true)}>
              <ArrowUpIcon className="ml-2 size-4" />
            </button>
          ) : (
            <button onClick={() => column.toggleSorting(false)}>
              <CaretSortIcon className="ml-2 size-4" />
            </button>
          )}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return <div className="text-center">{formatNumber(user.total)}</div>;
      }
    },
    {
      accessorKey: "sentTips",
      header: ({ column }) => (
        <div className="flex items-center">
          Tips given
          {column.getIsSorted() === "desc" ? (
            <button onClick={() => column.toggleSorting(false)}>
              <ArrowDownIcon className="ml-2 size-4" />
            </button>
          ) : column.getIsSorted() === "asc" ? (
            <button onClick={() => column.toggleSorting(true)}>
              <ArrowUpIcon className="ml-2 size-4" />
            </button>
          ) : (
            <button onClick={() => column.toggleSorting(false)}>
              <CaretSortIcon className="ml-2 size-4" />
            </button>
          )}
        </div>
      ),
      cell: ({ row }) => <div className="text-center">{formatNumber(row.getValue("sentTips"))}</div>
    },
    {
      accessorKey: "receivedTips",
      header: ({ column }) => (
        <div className="flex items-center">
          Tips received
          {column.getIsSorted() === "desc" ? (
            <button onClick={() => column.toggleSorting(false)}>
              <ArrowDownIcon className="ml-2 size-4" />
            </button>
          ) : column.getIsSorted() === "asc" ? (
            <button onClick={() => column.toggleSorting(true)}>
              <ArrowUpIcon className="ml-2 size-4" />
            </button>
          ) : (
            <button onClick={() => column.toggleSorting(false)}>
              <CaretSortIcon className="ml-2 size-4" />
            </button>
          )}
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">{formatNumber(row.getValue("receivedTips"))}</div>
      )
    }
    // TODO: Uncomment when the API is ready
    // Also check for property names in API response and if it requires any changes, then update here
    // {
    //   id: "followers",
    //   header: ({ column }) => (
    //     <div className="flex items-center">
    //       Followers
    //       {column.getIsSorted() === "desc" ? (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <ArrowDownIcon className="ml-2 size-4" />
    //         </button>
    //       ) : column.getIsSorted() === "asc" ? (
    //         <button onClick={() => column.toggleSorting(true)}>
    //           <ArrowUpIcon className="ml-2 size-4" />
    //         </button>
    //       ) : (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <CaretSortIcon className="ml-2 size-4" />
    //         </button>
    //       )}
    //     </div>
    //   ),
    //   cell: ({ row }) => <div className="w-[80px]">{row.original.followers || 0}</div>
    // },
    // {
    //   id: "likes_received",
    //   header: ({ column }) => (
    //     <div className="flex items-center">
    //       Likes Received
    //       {column.getIsSorted() === "desc" ? (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <ArrowDownIcon className="ml-2 size-4" />
    //         </button>
    //       ) : column.getIsSorted() === "asc" ? (
    //         <button onClick={() => column.toggleSorting(true)}>
    //           <ArrowUpIcon className="ml-2 size-4" />
    //         </button>
    //       ) : (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <CaretSortIcon className="ml-2 size-4" />
    //         </button>
    //       )}
    //     </div>
    //   ),
    //   cell: ({ row }) => <div className="w-[80px]">{row.original.votes || 0}</div>
    // },
    // {
    //   id: "likes_given",
    //   header: ({ column }) => (
    //     <div className="flex items-center">
    //       Likes Given
    //       {column.getIsSorted() === "desc" ? (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <ArrowDownIcon className="ml-2 size-4" />
    //         </button>
    //       ) : column.getIsSorted() === "asc" ? (
    //         <button onClick={() => column.toggleSorting(true)}>
    //           <ArrowUpIcon className="ml-2 size-4" />
    //         </button>
    //       ) : (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <CaretSortIcon className="ml-2 size-4" />
    //         </button>
    //       )}
    //     </div>
    //   ),
    //   cell: ({ row }) => <div className="w-[80px]">{row.original.upvotes || 0}</div>
    // },
    // {
    //   id: "comments_received",
    //   header: ({ column }) => (
    //     <div className="flex items-center">
    //       Comments Received
    //       {column.getIsSorted() === "desc" ? (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <ArrowDownIcon className="ml-2 size-4" />
    //         </button>
    //       ) : column.getIsSorted() === "asc" ? (
    //         <button onClick={() => column.toggleSorting(true)}>
    //           <ArrowUpIcon className="ml-2 size-4" />
    //         </button>
    //       ) : (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <CaretSortIcon className="ml-2 size-4" />
    //         </button>
    //       )}
    //     </div>
    //   ),
    //   cell: ({ row }) => <div className="w-[80px]">{row.original.comments || 0}</div>
    // },
    // {
    //   id: "comments_given",
    //   header: ({ column }) => (
    //     <div className="flex items-center">
    //       Comments Given
    //       {column.getIsSorted() === "desc" ? (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <ArrowDownIcon className="ml-2 size-4" />
    //         </button>
    //       ) : column.getIsSorted() === "asc" ? (
    //         <button onClick={() => column.toggleSorting(true)}>
    //           <ArrowUpIcon className="ml-2 size-4" />
    //         </button>
    //       ) : (
    //         <button onClick={() => column.toggleSorting(false)}>
    //           <CaretSortIcon className="ml-2 size-4" />
    //         </button>
    //       )}
    //     </div>
    //   ),
    //   cell: ({ row }) => <div className="w-[80px]">{row.original.commentsGiven || 0}</div>
    // }
  ];

function Trigger() {
  return (
    <Button size="sm" className="rounded-full text-[12px]">
      View all
    </Button>
  );
}

export function LeaderBoardModal(props: Props) {
  const { data, trigger = <Trigger /> } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="h-[calc(100vh-200px)] sm:max-w-[425px] 2xl:max-w-[800px]">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-4xl tracking-wide">Leaderboard</DialogTitle>
          <Separator className="dark:bg-theme-mine-shaft bg-theme-mine-shaft-dark" />
        </DialogHeader>
        <div className="size-full overflow-y-scroll">
          <div className="h-auto min-h-screen w-full">
            <DataTable columns={leaderboardColumns} data={data.result.byWalletBalance} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
