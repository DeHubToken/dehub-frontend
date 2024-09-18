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
    <main className="flex h-auto min-h-screen w-full items-center justify-center px-8 py-28">
      <div className="flex h-auto w-full flex-col items-center justify-center gap-6 text-center">
        <h1 className="font-tanker text-6xl">PROFILE NOT LINKED</h1>
        <ConnectButton />
        <button className="hidden" onClick={handleAuth}>
          <p className="text-lg">Skip for now</p>
        </button>
      </div>
    </main>
  );
}
