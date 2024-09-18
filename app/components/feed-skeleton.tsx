import { FeedRangeFilter } from "./filters";

export function FeedSkeleton() {
  return (
    <div className="flex h-auto w-full max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark sm:max-w-[300px] lg:max-w-[300px] xl:max-w-[31.95%] 2xl:max-w-[24%] 3xl:max-w-[290px]">
      <div className="shimmer relative h-[225px] w-full rounded-2xl bg-gray-300 dark:bg-theme-mine-shaft-dark/50 sm:h-[175px] 3xl:h-[190px]">
        <div className="absolute bottom-2 right-2 h-4 w-10 rounded-full bg-gray-500 dark:bg-zinc-900/70" />
      </div>

      <div className="flex h-auto w-full flex-col items-start justify-start gap-2 p-4">
        <div className="h-auto w-full">
          <div className="flex size-auto items-center justify-start gap-2">
            <div className="size-8 rounded-full bg-gray-500 dark:bg-zinc-900/70" />

            <div className="flex size-auto w-28 flex-col items-start justify-start">
              <div className="h-3 w-full rounded-full bg-gray-500 dark:bg-zinc-900/70" />
              <div className="mt-2 h-3 w-12 rounded-full bg-gray-500 dark:bg-zinc-900/70" />
            </div>
          </div>
        </div>

        <div className="flex h-auto w-full items-center justify-end gap-4">
          <div className="w-14 rounded-full bg-gray-500 p-3 dark:bg-zinc-900/70" />
          <div className="w-14 rounded-full bg-gray-500 p-3 dark:bg-zinc-900/70" />
          <div className="w-14 rounded-full bg-gray-500 p-3 dark:bg-zinc-900/70" />
        </div>
      </div>
    </div>
  );
}

export function FeedLoader(props: { range?: string }) {
  const { range } = props;
  return (
    <div className="h-auto w-full">
      <div className="flex h-auto w-full items-center justify-between">
        <h1 className="font-tanker text-5xl">Trending</h1>
        <div className="flex size-auto items-center justify-center gap-4">
          <FeedRangeFilter range={range} disabled />
        </div>
      </div>
      <div className="mt-10 h-auto w-full">
        <div className="flex h-auto w-full flex-wrap items-stretch justify-start gap-5 xl:gap-x-[1.25%] xl:gap-y-4 3xl:gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <FeedSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
