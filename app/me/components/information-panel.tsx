"use client";

import type { User } from "@/stores/atoms/user";

import Image from "next/image";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";

import { useWebSockets } from "@/contexts/websocket";

import { formatToUsDate } from "@/libs/date-time";
import { miniAddress } from "@/libs/strings";

import { getBadgeUrl } from "@/web3/utils/calc";

import TokensList from "./token-list";
import { maxStacked } from "@/libs/maxStacked";

type Props = { user: User };

export function InformationPanel(props: Props) {
  const { user } = props;
  const { theme } = useTheme();
  const { isUserOnline } = useWebSockets();
  const maxStaked = maxStacked(user?.balanceData??0) 
  return (
    <div className="mt-8 flex h-auto w-full flex-col items-start justify-between gap-6 md:flex-row md:gap-0">
      <div className="flex size-auto flex-col items-start justify-start gap-8">
        <div className="size-auto space-y-2">
          <div className="relative flex size-auto items-start justify-start gap-0 sm:items-start sm:gap-2">
            <h1 className="flex gap-2 text-2xl font-semibold sm:w-auto">
              {user.displayName || user?.username || "No name"}{" "}
              {user.displayName && <span className="text-sm">({user?.username})</span>} <Image
                src={getBadgeUrl(maxStaked, theme)}
                alt="User Badge"
                layout="fill"
                className={`prof_le object-contain ${
                  isUserOnline(user.address)
                    ? "" // TODO: Add glow effect for when they are online
                    : ""
                }`}
              />
            </h1>
            {/* <div className="relative h-4 w-4">
             
            </div> */}
          </div>

          <p className="text-sm">{miniAddress(user?.address )}</p>
        </div>

        <div className="flex size-auto max-w-screen-xs flex-wrap items-start justify-start gap-4">
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Followers</span> <span>{user?.followers?.length || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Following</span> <span>{user?.followings?.length || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Likes</span> <span>{user.likes?.length || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Tips earned</span> <span>{user.receivedTips || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Tips given</span> <span>{user.sentTips || 0}</span>
          </Badge>
        </div>

        <div className="size-auto space-y-4">
          <p className="max-w-screen-xs text-sm">{user.aboutMe || "No description"}</p>

          {user.createdAt ? (
            <p className="text-sm">{formatToUsDate(user.createdAt)}</p>
          ) : (
            "Not joined yet"
          )}
        </div>
      </div>

      <TokensList />
    </div>
  );
}
