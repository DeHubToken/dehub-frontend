"use client";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

export function NotificationCount(props: { count: number; className?: string }) {
  const { count = 0, className } = props;
  const { account } = useActiveWeb3React();

  if (!account) return null;

  if (count === 0) return null;

  return (
    <span
      className={cn(
        "absolute -right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-theme-orange-500 p-1 text-xs font-bold text-white xl:right-0 xl:size-6",
        className
      )}
    >
      {count}
    </span>
  );
}
