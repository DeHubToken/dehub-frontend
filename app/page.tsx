import "server-only";

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Categories } from "./components/categories";
import { FeedList } from "./components/feed-list";
import { LeaderboardSkeleton } from "./components/leaderborad";
import { LikedFeed } from "./components/liked";
import { Stream } from "./components/stream";
import { StreamLoader } from "./components/stream-skeleton";
import { TabPanel } from "./components/tab-panel";
import { LiveFeed } from "./live/components/live";

/* ----------------------------------------------------------------------------------------------- */

type Props = {
  params: null;
  searchParams: {
    category?: string;
    range?: string;
    type: string;
    q?: string;
    sort?: string;
  };
};

export default async function Page(props: Props) {
  const { category, range, type, q, sort } = props.searchParams;
console.log("searchParams",props.searchParams);

  if (!type) {
    return redirect(`/?type=trends`);
  }

  const key = category + "-" + range + "-" + type + "-" + q;

  return (
    <div className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="content-container-with-tab-panel">
        {/* TODO: Based on query, need to show and hide */}
        <Categories
          title={type.toUpperCase()}
          category={category}
          range={range}
          type={type}
          q={q}
          sort={sort}
        />

        <div className="mt-8 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
          <Suspense key={key} fallback={<StreamLoader />}>
            {type === "feed" && (
              <FeedList
                title={type.toUpperCase()}
                category={category}
                range={range}
                sort={sort}
                type={type}
                q={q}
              />
            )}
            {type === "live" && (
              <LiveFeed
                title={type.toUpperCase()}
                category={category}
                range={range}
                type={type}
                q={q}
              />
            )}
            {type === "liked" && (
              <LikedFeed
                title={type.toUpperCase()}
                category={category}
                range={range}
                sort={sort}
                type={type}
                q={q}
              />
            )}
            {type === "reports" && (
             <FeedList
             title={type.toUpperCase()}
             category={category}
             range={range}
             sort={sort}
             type={type}
             q={q}
           />
            )}
            {type !== "feed" && type !== "reports" && type !== "liked" && type !== "live" && (
              <Stream
                title={type.toUpperCase()}
                category={category}
                sort={sort}
                range={range}
                type={type}
                q={q}
              />
            )}
          </Suspense>
        </div>
      </div>

      {/* TODO: Replace skeleton with generic tab panel skeleton */}
      <Suspense fallback={<LeaderboardSkeleton />}>
        <TabPanel defaultValue="leaderboard" />
      </Suspense>
    </div>
  );
}
