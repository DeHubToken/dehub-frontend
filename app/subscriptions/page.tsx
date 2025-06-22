import { Suspense } from "react";
import { feeds } from "@/data";
import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LeaderboardSkeleton } from "../components/leaderborad";
import { TabPanel } from "../components/tab-panel";
import { FeedsPanel } from "./components/feed-panel";
import { SnippetsPanel } from "./components/snippets-panel";
import { VideoPanel } from "./components/videos-panel";

const tabs = [
  { value: "videos", label: "Videos" },
  { value: "snippets", label: "Snippets" },
  { value: "feed", label: "Feed" }
];

export default function Page() {
  return (
    <div className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="content-container-with-tab-panel px-6">
        <div className="flex items-center px-2 pb-6">
          <h1 className="justify-start text-3xl font-normal leading-loose text-theme-neutrals-100">
            Subscriptions
          </h1>
        </div>

        <Tabs defaultValue="videos" className="w-full">
          <div className="flex w-full items-center justify-between">
            <TabsList className="justify-start">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="rounded-full">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button className="gap-2 rounded-full">
              Filter
              <ListFilter className="size-3 text-zinc-400" />
            </Button>
          </div>
          <TabsContent value="videos" className="mt-4">
            <VideoPanel />
          </TabsContent>
          <TabsContent value="snippets" className="mt-4">
            <SnippetsPanel />
          </TabsContent>
          <TabsContent value="feed" className="mt-4">
            <FeedsPanel />
          </TabsContent>
        </Tabs>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <TabPanel defaultValue="leaderboard" />
      </Suspense>
    </div>
  );
}
