export function StreamSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-theme-neutrals-800">
      <div className="shimmer relative h-0 w-full rounded-2xl bg-gray-300 bg-theme-mine-shaft-dark/50 pt-[56.25%]">
        <div className="absolute bottom-2 right-2 h-4 w-10 rounded-full bg-zinc-900/70" />
      </div>

      <div className="flex h-auto w-full flex-col items-start justify-start gap-2 p-4">
        <div className="h-auto w-full">
          <div className="flex size-auto items-center justify-start gap-2">
            <div className="size-8 rounded-full bg-gray-500 bg-zinc-900/70" />

            <div className="flex size-auto w-28 flex-col items-start justify-start">
              <div className="h-3 w-full rounded-full bg-gray-500 bg-zinc-900/70" />
              <div className="mt-2 h-3 w-12 rounded-full bg-gray-500 bg-zinc-900/70" />
            </div>
          </div>
        </div>

        <div className="flex h-auto w-full items-center justify-end gap-4">
          <div className="w-14 rounded-full bg-gray-500 bg-zinc-900/70 p-3" />
          <div className="w-14 rounded-full bg-gray-500 bg-zinc-900/70 p-3" />
          <div className="w-14 rounded-full bg-gray-500 bg-zinc-900/70 p-3" />
        </div>
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="flex  h-auto w-full animate-pulse flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-neutrals-800 p-2">
      <div className="mt-4 flex items-center">
        <svg
          className="me-3 ml-2 h-10 w-10 text-gray-200 dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
        <div>
          <div className="mb-2 h-2.5 w-32 rounded-full bg-gray-300"></div>
          <div className="h-2 w-48 rounded-full bg-gray-300"></div>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-300"></div>
        <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
        <div className="mb-2.5 h-2 rounded-full bg-gray-300"></div>
        <div className="h-2 rounded-full bg-gray-300"></div>
      </div>

      <span className="sr-only">Loading...</span>
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
