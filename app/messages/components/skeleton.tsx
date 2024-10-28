export function ContactSkeleton() {
  return (
    <div className="relative flex items-center gap-2 rounded-lg p-3 dark:bg-gray-800">
      <div className="shimmer size-10 rounded-full dark:bg-gray-500" />
      <div className="flex w-full flex-col gap-2">
        <div className="shimmer h-2 w-28 rounded-full dark:bg-gray-500" />
        <div className="shimmer h-4 w-full rounded-full dark:bg-gray-500" />
      </div>
    </div>
  );
}
