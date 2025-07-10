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

const tabs = [
  { name: "Explore", value: "explore" },
  { name: "Leaderboard", value: "leaderboard" },
  { name: "Recommended", value: "recommended" }
];

type Props = {
  defaultValue?: string;
};

export async function TabPanel(props: Props) {
  const { defaultValue = tabs[0].value } = props;
  const res = await getLeaderborard();

  if (!res.success) {
    return <div>{res.error}</div>;
  }

  return (
    <div className="sticky right-0 top-[calc(var(--navbar-height)+24px)] hidden w-full max-w-[var(--leaderboard-width)] items-start justify-start pr-3 lg:flex lg:flex-col lg:gap-3">
      <Tabs defaultValue={defaultValue} className="w-full">
        <TabsList className="w-full justify-between">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.name} className="rounded-full px-5 py-2" value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
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
                      <Link href={`/${user?.username || user.account}`}>
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
