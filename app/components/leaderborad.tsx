import "server-only";

import type { LeaderboradResponse } from "@/services/nfts/leaderborad";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { truncate } from "@/libs/strings";
import { createAvatarName } from "@/libs/utils";

import { getLeaderborard } from "@/services/nfts/leaderborad";

import { formatNumber } from "@/web3/utils/format";
import { getAvatarUrl } from "@/web3/utils/url";

import { LeaderBoardModal } from "./leaderboard-modal";

export async function Leaderboard() {
  const res = await getLeaderborard();

  if (!res.success) {
    return <div>{res.error}</div>;
  }

  return (
    <div className="sticky right-0 top-[calc(var(--navbar-height)+24px)] hidden h-screen w-full min-w-[var(--leaderboard-width)] items-start justify-start overflow-hidden pr-3 md:flex md:flex-col md:gap-3">
      <div className="rounded-full bg-theme-neutrals-700 px-4 py-3 text-xs text-theme-neutrals-400">
        <span>Leaderboard</span>
      </div>
      <div className="size-full rounded-3xl border border-neutral-800 p-3">
        <div className="flex size-auto items-center justify-between px-3">
          <h1 className="font-tanker text-xl">Leaderboard</h1>
          <LeaderBoardModal
            data={res.data}
            trigger={
              <Button size="sm" className="rounded-full text-[12px]">
                View all
              </Button>
            }
          />
        </div>

        <div className="relative flex size-full flex-col gap-4 overflow-x-hidden overflow-y-scroll pb-40 pt-4">
          <div className="flex h-auto w-full items-center justify-between px-3 text-theme-neutrals-500">
            <div className="flex size-auto items-center justify-start gap-4">
              <p className="w-4 text-sm font-medium">#</p>
              <p className="text-sm font-medium">User</p>
            </div>
            <p className="text-sm font-medium">Holdings</p>
          </div>

          <div className="flex h-auto w-full flex-col items-start justify-start gap-4 px-3">
            {res.data.result.byWalletBalance.map((user, index) => (
              <div key={index} className="flex h-auto w-full items-center justify-between gap-4">
                <div className="flex size-auto items-center justify-start gap-4">
                  <p className="w-4 text-sm font-medium text-theme-neutrals-400">{index + 1}</p>
                  <Link href={`/profile/${user?.username || user.account}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Avatar className="size-8 rounded-full object-cover">
                        <AvatarFallback className="bg-gray-800">
                          {createAvatarName(
                            user?.username || user.userDisplayName || user.account || "User",
                            "x"
                          )}
                        </AvatarFallback>
                        <AvatarImage src={getAvatarUrl(user.avatarUrl || "")} />
                      </Avatar>
                      <p className="text-sm font-medium text-theme-neutrals-400">
                        {truncate(user?.username || user.userDisplayName || user.account, 10)}
                      </p>
                    </div>
                  </Link>
                </div>
                <p className="text-sm font-medium text-theme-neutrals-400">
                  {formatNumber(user.total)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="sticky right-0 top-0 flex h-screen w-full items-start justify-start overflow-hidden px-4 pb-4 pt-28">
      <div className="h-auto w-full">
        <div className="flex size-auto items-center justify-between">
          <h1 className="font-tanker text-4xl">Leaderboard</h1>
          <Button size="sm" className="rounded-full">
            View all
          </Button>
        </div>

        <div className="relative h-screen w-full overflow-x-hidden overflow-y-scroll pb-40 pt-6">
          <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div className="h-[60px] w-full" key={index}>
                <div className="shimmer h-[60px] w-full rounded bg-gray-200 dark:bg-theme-mine-shaft-dark" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function LeaderboardFetcher(props: {
  slot: (slotProps: { data: LeaderboradResponse }) => React.ReactNode;
}) {
  const { slot } = props;
  const res = await getLeaderborard();

  if (!res.success) {
    return <div>{res.error}</div>;
  }

  return <>{slot({ data: res.data })}</>;
}
