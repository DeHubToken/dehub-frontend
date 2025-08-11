"use client";

import type { User } from "@/stores";

import Image from "next/image";
import { useTheme } from "next-themes";

import { useWebSockets } from "@/contexts/websocket";

import { maxStacked } from "@/libs/maxStacked";

import { getBadgeUrl } from "@/web3/utils/calc";

type Props = {
  user: User;
};

export function UsernameBox(props: Props) {
  const { user } = props;
  const { theme } = useTheme();
  const { isUserOnline } = useWebSockets();
  const maxStaked = maxStacked(user?.balanceData ?? 0);
  return (
    <div className="w-full space-y-2 overflow-hidden">
      <div className="flex size-auto items-start justify-start gap-1">
        <h1 className="text-2xl font-semibold">
          {user.displayName ?? user?.username ?? "No name"}
        </h1>
        <div className="relative size-5 rounded-full p-0.5">
          <Image
            src={getBadgeUrl(maxStaked, theme)}
            alt="User Badge"
            layout="fill"
            className={`w-full object-contain ${
              isUserOnline(user.address)
                ? "" // TODO: Add glow effect for when they are online
                : ""
            }`}
          />
        </div>
      </div>
      <p className="text-xs sm:text-sm">{user.address}</p>
    </div>
  );
}
