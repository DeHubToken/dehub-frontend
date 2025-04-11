"use client";

import { useOptimistic } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";

import { useStreamProvider } from "./stream-provider";

type Props = {
  url: string;
  isActive: boolean;
  children: React.ReactNode;
};

export function CategoryButton(props: Props) {
  const { url, isActive, children } = props;

  const [isActived, setIsActived] = useOptimistic(isActive);
  const { startTransition } = useStreamProvider("CategoryButton");
  const router = useRouter();

  function pushUrl() {
    startTransition(() => {
      setIsActived(true);
      router.push(url);
    });
  }

  return (
    <button onClick={pushUrl}>
      <Badge
        variant={isActived ? "secondary" : "default"}
        className="h-8 bg-theme-neutrals-800 px-4 py-2 text-[11px] text-theme-neutrals-400"
      >
        {children}
      </Badge>
    </button>
  );
}
