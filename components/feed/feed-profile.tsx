"use client"
import Image from "next/image";
import Link from "next/link";
import dayjs from "@/libs/dayjs";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useWebSockets } from "@/contexts/websocket";

import { createAvatarName } from "@/libs/utils";

import { getBadgeUrl } from "@/web3/utils/calc";
import { getAvatarUrl } from "@/web3/utils/url";
 

type Props = {
  avatar: string;
  name: string;
  time: string;
  minter: string;
  minterStaked: number; 
};


export function FeedProfile(props: Props) {
  const { avatar, name, time, minter, minterStaked } = props;
  const { theme } = useTheme();
  const { isUserOnline } = useWebSockets();

  return (
    <div className="flex gap-2">
      <Link href={`/${name || minter}`}>
        <Avatar className="size-8">
          <AvatarFallback>{createAvatarName(name)}</AvatarFallback>
          <AvatarImage src={getAvatarUrl(avatar)} />
        </Avatar>
      </Link>

      <div className="flex flex-col">
        <div className="flex gap-2">
          <span className="text-[15px]">{name}</span>
          <div className="relative h-3 w-3">
            <Image
              src={getBadgeUrl(minterStaked, theme)}
              alt="User Badge"
              layout="fill"
              className={`object-contain ${!isUserOnline(minter) ? "" : ""}`} // TODO: Add glow effect for when they are online
            />
          </div>
        </div>
        <span className="text-theme-monochrome-300 text-[10px]">{dayjs(time).fromNow()}</span>
      </div>
    </div>
  );
}
