import "server-only";

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Categories } from "./components/categories";
import { FeedList } from "./components/feed-list";
import { Leaderboard, LeaderboardSkeleton } from "./components/leaderborad";
import { LikedFeed } from "./components/liked";
import { Stream } from "./components/stream";
import { StreamLoader } from "./components/stream-skeleton";
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
      <div className="h-auto min-h-screen w-full max-w-full flex-1 px-6 lg:min-w-[calc(100%-var(--leaderboard-width))] lg:max-w-[calc(100%-var(--leaderboard-width))]">
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

      <Suspense fallback={<LeaderboardSkeleton />}>
        <Leaderboard />
      </Suspense>
    </div>
  );
}
