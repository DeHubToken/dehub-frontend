"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const ConnectButtonDynamic = dynamic(() => import("./connect-button"), {
    ssr: false,
    loading: () => (
      <div className="flex size-auto items-center justify-center">
        <Skeleton className="h-12 w-[162px] rounded-full bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft" />
      </div>
    )
  });
