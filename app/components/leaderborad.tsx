import "server-only";

import type { LeaderboradResponse } from "@/services/nfts/leaderborad";

import Link from "next/link";

import { TabContentWrapper } from "@/components/tab-wrapper";
import { TrendingCard, TrendingContainer, TrendingCreatorCard } from "@/components/trending-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="sticky right-0 top-[calc(var(--navbar-height)+24px)] hidden w-full max-w-[var(--leaderboard-width)] items-start justify-start pr-3 lg:flex lg:flex-col lg:gap-3">
      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="w-full justify-between">
          <TabsTrigger className="rounded-full px-5 py-2" value="explore">
            Explore
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-5 py-2" value="leaderboard">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger className="rounded-full px-5 py-2" value="recommended">
            Recommended
          </TabsTrigger>
        </TabsList>
        <TabsContent value="explore" className="flex flex-col gap-3">
          <TabContentWrapper>
            <div className="flex items-center justify-between pl-2">
              <h1 className="font-tanker text-xl">Trending topic</h1>
              <Button size="sm" className="rounded-full text-[12px]">
                View all
              </Button>
            </div>
            <TrendingContainer className="mt-3">
              <TrendingCard
                title="Crypto crash"
                description="Trending in United Kingdom"
                posts="18K"
              />
              <TrendingCard
                title="Crypto crash"
                description="Trending in United Kingdom"
                posts="18K"
              />
            </TrendingContainer>
          </TabContentWrapper>

          <TabContentWrapper>
            <div className="flex items-center justify-between pl-2">
              <h1 className="font-tanker text-xl">Treading creators</h1>
              <Button size="sm" className="rounded-full text-[12px]">
                View all
              </Button>
            </div>
            <TrendingContainer className="mt-3">
              <TrendingCreatorCard
                name="Darren Ullrich"
                description="Marketing tips & tutorials"
                avatarUrl="https://images.unsplash.com/photo-1502685104226-e9df14d4d9f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
              />
              <TrendingCreatorCard
                name="Fannie Feeney"
                description="Beauty and self care"
                avatarUrl="https://images.unsplash.com/photo-1502685104226-e9df14d4d9f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
              />
            </TrendingContainer>
          </TabContentWrapper>
        </TabsContent>
        <TabsContent value="recommended">Recommended</TabsContent>
        <TabsContent value="leaderboard">
          <TabContentWrapper className="max-h-[calc(100vh-var(--navbar-height)-52px-30px)]">
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

              <div className="flex h-auto max-h-[calc(100vh-var(--navbar-height)-52px-30px-28px-12px)] min-h-[calc(100vh-var(--navbar-height)-52px-30px-28px-12px)] w-full flex-col items-start justify-start gap-4 overflow-y-scroll px-3">
                {res.data.result.byWalletBalance.map((user, index) => (
                  <div
                    key={index}
                    className="flex h-auto w-full items-center justify-between gap-4"
                  >
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
          </TabContentWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const tabs = [
  { name: "Explore", value: "explore" },
  { name: "Leaderboard", value: "leaderboard" },
  { name: "Recommended", value: "recommended" }
];

export function LeaderboardSkeleton() {
  return (
    <div className="sticky right-0 top-[calc(var(--navbar-height)+24px)] hidden h-[calc(100vh-var(--navbar-height)-30px)] max-h-[calc(100vh-var(--navbar-height)-30px)] w-full max-w-[var(--leaderboard-width)] items-start justify-start overflow-hidden pr-3 md:flex md:flex-col md:gap-3">
      <div className="inline-flex w-full items-center justify-between rounded-full border border-theme-neutrals-800 p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <div
            key={tab.name}
            className="bg-color-neutrals-700 inline-flex h-10 items-center justify-center gap-2.5 self-stretch whitespace-nowrap rounded-full rounded-full px-5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-theme-neutrals-700 data-[state=active]:text-theme-neutrals-400 data-[state=active]:shadow-[0px_0px_20px_0px_rgba(56,58,61,1.00)] data-[state=active]:ring-offset-background"
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="size-full rounded-3xl border border-neutral-800 p-3">
        <div className="flex size-auto items-center justify-between px-3">
          <h1 className="font-tanker text-xl">Leaderboard</h1>
          <Button size="sm" className="rounded-full text-[12px]" disabled>
            View all
          </Button>
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
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex h-10 w-full items-center justify-between gap-4">
                <div className="flex size-auto flex-1 items-center justify-start gap-4">
                  <p className="shimmer h-5 w-4 rounded-full border border-gray-400 border-theme-mine-shaft bg-gray-400 bg-theme-mine-shaft-dark" />
                  <div className="flex w-full cursor-pointer items-center gap-2">
                    <div className="shimmer h-8 min-w-8 rounded-full border border-gray-400 border-theme-mine-shaft bg-gray-400 bg-theme-mine-shaft-dark" />
                    <p className="shimmer h-5 w-full rounded-full border border-gray-400 border-theme-mine-shaft bg-gray-400 bg-theme-mine-shaft-dark" />
                  </div>
                </div>
                <p className="shimmer h-5 w-16 rounded-full  border border-gray-400 border-theme-mine-shaft bg-gray-400 bg-theme-mine-shaft-dark" />
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
