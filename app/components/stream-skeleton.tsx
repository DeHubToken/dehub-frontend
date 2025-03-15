export function StreamSkeleton() {
  return (
    <div className="flex max-h-[calc((370/16)*1rem)] min-h-[calc((370/16)*1rem)] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <div className="shimmer relative min-h-[calc((250/16)*1rem)] w-full rounded-2xl bg-gray-300 dark:bg-theme-mine-shaft-dark/50">
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

export function StreamLoader() {
  return (
    <div className="h-auto w-full">
      <div className="h-auto w-full">
        <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, index) => (
            <StreamSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
