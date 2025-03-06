export function StreamSkeleton() {
  return (
    <div className="flex h-auto w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <div className="shimmer relative h-[225px] w-full rounded-2xl bg-gray-300 dark:bg-theme-mine-shaft-dark/50 sm:h-[225px] xl:h-[175px] 2xl:h-[235px]">
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

export function FeedSkeleton() {
  return (
    <div className="flex  animate-pulse p-2 h-auto w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
    
    <div className="flex items-center mt-4">
       <svg className="w-10 ml-2 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>
        <div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
            <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        </div>
    </div>
  <div className="p-5">
  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
  </div> 
       
    <span className="sr-only">Loading...</span> 
      
    </div>
  );
}

export function StreamLoader() {
  //   const { range } = props;
  return (
    <div className="h-auto w-full">
      {/* <div className="flex h-auto w-full items-center justify-between">
        <h1 className="font-tanker text-5xl">Trending</h1>
        <div className="flex size-auto items-center justify-center gap-4">
          <StreamRangeFilter range={range} disabled />
        </div>
      </div> */}
      <div className="h-auto w-full">
        <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <StreamSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
