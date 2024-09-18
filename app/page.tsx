import "server-only";

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Categories } from "./components/categories";
import { Feed } from "./components/feed";
import { FeedProvider } from "./components/feed-provider";
import { FeedLoader } from "./components/feed-skeleton";
import { Leaderboard, LeaderboardSkeleton } from "./components/leaderborad";

type Props = {
  params: null;
  searchParams: {
    category?: string;
    range?: string;
    type: string;
    q?: string;
  };
};

export default async function Page(props: Props) {
  const { category, range, type, q } = props.searchParams;

  if (!type) {
    return redirect(`/?type=trends`);
  }

  const key = category + "-" + range + "-" + type + "-" + q;

  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="h-auto min-h-screen w-full px-6 py-20 md:max-w-[75%] md:flex-[0_0_75%]">
        <FeedProvider>
          <Categories
            title={type.toUpperCase()}
            category={category}
            range={range}
            type={type}
            q={q}
          />

          <div className="mt-8 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
            <Suspense key={key} fallback={<FeedLoader range={range} />}>
              <Feed
                title={type.toUpperCase()}
                category={category}
                range={range}
                type={type}
                q={q}
              />
            </Suspense>
          </div>
        </FeedProvider>
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <Leaderboard />
      </Suspense>
    </main>
  );
}
