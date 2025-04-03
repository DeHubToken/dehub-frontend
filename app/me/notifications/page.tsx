import { Suspense } from "react";
import { CheckCircle, HandCoins, ListFilter, MessageCircle, Share2, UserCheck } from "lucide-react";

import { LeaderboardSkeleton } from "@/app/components/leaderborad";
import { TabPanel } from "@/app/components/tab-panel";

import { ThumbsUp } from "@/components/icons/thumbs-up";
import { Button } from "@/components/ui/button";

const data = [
  { id: 1, name: "Natasha Anderson", time: "15 mins ago", action: "SUBSCRIBED" },
  { id: 2, name: "John Doe", time: "30 mins ago", action: "LIKED" },
  { id: 3, name: "Jane Smith", time: "1 hour ago", action: "COMMENTED" },
  { id: 4, name: "Alice Johnson", time: "2 hours ago", action: "SHARED" },
  { id: 5, name: "Bob Brown", time: "3 hours ago", action: "FOLLOWED" },
  { id: 5, name: "Bob Brown", time: "3 hours ago", action: "TIPPED" }
];

const actionText = {
  SUBSCRIBED: () => "subscribed to you",
  LIKED: () => "liked your post",
  COMMENTED: () => "commented on your post",
  SHARED: () => "shared your post",
  FOLLOWED: () => "followed you",
  TIPPED: () => "tipped you"
};

export default function Page() {
  return (
    <div className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="content-container-with-tab-panel px-6">
        <div className="flex items-center justify-between px-2 py-6">
          <h1 className="justify-start text-3xl font-normal leading-loose text-theme-neutrals-100">
            Notifications
          </h1>

          <Button className="gap-2 rounded-full">
            Filter
            <ListFilter className="size-3 text-zinc-400" />
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-start gap-4 self-stretch rounded-xl p-6 outline outline-1 outline-offset-[-1px] outline-theme-neutrals-800"
            >
              {item.action === "SUBSCRIBED" && <CheckCircle className="size-8 text-zinc-400" />}
              {item.action === "LIKED" && <ThumbsUp className="size-8 text-zinc-400" />}
              {item.action === "TIPPED" && <HandCoins className="size-8 text-zinc-400" />}
              {item.action === "COMMENTED" && <MessageCircle className="size-8 text-zinc-400" />}
              {item.action === "SHARED" && <Share2 className="size-8 text-zinc-400" />}
              {item.action === "FOLLOWED" && <UserCheck className="size-8 text-zinc-400" />}
              <div className="flex flex-1 flex-col items-start justify-start gap-4">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="flex items-center justify-start gap-1 self-stretch px-2">
                    <span className="text-color-neutrals-200 justify-start text-base font-semibold leading-tight">
                      {item.name}
                    </span>
                    <div className="justify-start">
                      <span className="text-base font-normal leading-tight text-theme-neutrals-400">
                        {actionText[item.action]()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-4 self-stretch px-2">
                    <span className="justify-start text-xs font-normal leading-none text-theme-neutrals-400">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <TabPanel defaultValue="leaderboard" />
      </Suspense>
    </div>
  );
}
