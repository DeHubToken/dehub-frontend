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
        className="border-gray-200 px-4 text-[11px] dark:border-theme-mine-shaft"
      >
        {children}
      </Badge>
    </button>
  );
}
