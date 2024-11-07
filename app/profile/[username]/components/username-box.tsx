"use client";

import type { User } from "@/stores";

import Image from "next/image";
import { useTheme } from "next-themes";

import { useWebSockets } from "@/contexts/websocket";

import { getBadgeUrl } from "@/web3/utils/calc";

type Props = {
  user: User;
};

export function UsernameBox(props: Props) {
  const { user } = props;
  const { theme } = useTheme();
  const { isUserOnline } = useWebSockets();

  return (
    <div className="size-auto space-y-2">
      <div className="flex size-auto items-center justify-start gap-6">
        <h1 className="text-2xl font-semibold">
          {user.displayName || user?.username || "No name"}
        </h1>
        <div className="relative h-6 w-6">
          <Image
            src={getBadgeUrl(user?.badge?.name as string, theme)}
            alt="User Badge"
            layout="fill"
            className={`object-contain ${
              isUserOnline(user.address)
                ? "" // TODO: Add glow effect for when they are online
                : ""
            }`}
          />
        </div>
      </div>
      <p className="text-sm">{user.address}</p>
    </div>
  );
}
