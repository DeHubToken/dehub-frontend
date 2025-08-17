"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

const ConnectButton = dynamic(() => import("@/components/connect-button"), {
  ssr: false,
  loading: () => (
    <div className="flex size-auto items-center justify-center">
      <Skeleton className="h-12 w-[162px] rounded-full bg-gray-300 dark:bg-theme-mine-shaft-dark" />
    </div>
  )
});

export function NotLinkedAccount() {
  const [isAuth, setIsAuth] = useState(true);

  const handleAuth = () => {
    setIsAuth(!isAuth);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] w-full items-center justify-center px-8 py-28">
      <div className="flex h-auto w-full flex-col items-center justify-center gap-6 text-center">
        <h1 className="font-exo_2 text-6xl">Profile not linked</h1>
        <ConnectButton />
        <button className="hidden" onClick={handleAuth}>
          <p className="text-lg">Skip for now</p>
        </button>
      </div>
    </div>
  );
}
