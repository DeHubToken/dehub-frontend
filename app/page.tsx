import "server-only";

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Categories } from "./components/categories";
import { FeedList } from "./components/feed-list";
import { Leaderboard, LeaderboardSkeleton } from "./components/leaderborad";
import { LikedFeed } from "./components/liked";
import { Stream } from "./components/stream";
import { StreamLoader } from "./components/stream-skeleton";

/* ----------------------------------------------------------------------------------------------- */

type Props = {
  searchParams: Promise<{
    category?: string;
    range?: string;
    type: string;
    q?: string;
    sortBy?: string;
  }>;
};

export default async function Page(props: Props) {
  const { category, range, type, q, sortBy } = (await props.searchParams);

  if (!type) {
    return redirect(`/?type=trends`);
  }

  const key = category + "-" + range + "-" + type + "-" + q;

  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="h-auto min-h-screen w-full px-6 py-20 md:max-w-[75%] md:flex-[0_0_75%]">
        <Categories
          title={type.toUpperCase()}
          category={category}
          range={range}
          type={type}
          q={q}
          sortBy={sortBy}
        />

        <div className="mt-8 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
          <Suspense key={key} fallback={<StreamLoader />}>
            {type === "feed" && <FeedList />}
            {type === "liked" && (
              <LikedFeed
                title={type.toUpperCase()}
                category={category}
                range={range}
                type={type}
                q={q}
              />
            )}
            {type !== "feed" && type !== "liked" && (
              <Stream
                title={type.toUpperCase()}
                category={category}
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
    </main>
  );
}
