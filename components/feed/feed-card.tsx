"use client";

import { cn } from "@/libs/utils";

export function FeedCard(props: React.ComponentProps<"div">) {
  const { children, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "w-full",
        "flex flex-col gap-5 rounded-3xl border border-theme-neutrals-800 bg-theme-neutrals-900 p-5",
        rest.className
      )}
    >
      {children}
    </div>
  );
}
export function ActivityFeedCard(props: React.ComponentProps<"div">) {
  const { children, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "w-full sm:min-w-[calc((520/16)*16px)] sm:max-w-[calc((700/16)*16px)] ",
        "flex flex-col gap-5 rounded-lg border p-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark",
        rest.className
      )}
    >
      {children}
    </div>
  );
}
