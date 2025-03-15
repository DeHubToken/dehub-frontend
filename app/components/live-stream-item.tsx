/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DotFilledIcon, EyeOpenIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { formatDistance } from "date-fns";
import { useTheme } from "next-themes";
import { CiMenuKebab } from "react-icons/ci";

import { PreviewVideo } from "@/components/preview-video";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useWebSockets } from "@/contexts/websocket";

import { truncate } from "@/libs/strings";
import { createAvatarName } from "@/libs/utils";

import { getBadgeUrl } from "@/web3/utils/calc";
import { formatNumber } from "@/web3/utils/format";
import { getAvatarUrl } from "@/web3/utils/url";

import { env } from "@/configs";

import StatusBadge from "../live/[streamId]/components/status-badge";

type Props = {
  stream: any;
  isOwner?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function LiveStreamItem({ stream, isOwner, ...rest }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isUserOnline } = useWebSockets();
  const { theme } = useTheme();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div
      {...rest}
      className="relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark"
    >
      <div className="relative h-0 w-full overflow-hidden pt-[56.25%]">
        <Link
          href={`/live/${stream._id}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute inset-0"
        >
          <Image
            src={`${env.NEXT_PUBLIC_CDN_BASE_URL}/${stream.thumbnail}` || "/default-thumbnail.jpg"}
            alt={stream.title}
            layout="fill"
            objectFit="cover"
          />
          <StatusBadge status={stream.status} className="text-xs" />
        </Link>
        {stream?.streamInfo?.isAddBounty && (
          <div className="absolute -left-16 top-12 z-10 flex w-60 -rotate-45 items-center justify-center gap-1 bg-classic-magenta px-10 py-0.5 text-center text-xs text-white shadow-default">
            <span>
              Watch2Earn: {formatNumber(stream.streamInfo.addBountyAmount)}{" "}
              {stream.streamInfo.addBountyTokenSymbol}
            </span>
            <Image
              src="/icons/tokens/DHB.png"
              alt="DHB"
              width={20}
              height={20}
              className="size-4 rounded-full bg-black"
            />
          </div>
        )}

        {stream?.streamInfo?.isPayPerView && (
          <div className="absolute -right-20 top-8 z-10 flex w-60 rotate-45 items-center justify-center gap-1 bg-classic-blue px-12 py-0.5 text-center text-xs text-white">
            <span>
              PPV: {stream.streamInfo.payPerViewAmount || 0}{" "}
              {stream.streamInfo.payPerViewTokenSymbol}
            </span>
            <Image
              src="/icons/tokens/DHB.png"
              alt="DHB"
              width={20}
              height={20}
              className="size-4 rounded-full bg-black"
            />
          </div>
        )}
        {/* {stream?.plansDetails?.length > 0 && (
          <div className="absolute -left-20 bottom-8 z-10 flex w-60 rotate-45 items-center justify-center gap-1 bg-classic-purple px-12 py-0.5 text-center text-xs text-white">
            <span>Subscribe To Watch</span>
          </div>
        )} */}
        {stream?.streamInfo?.isLockContent && (
          <div className="absolute -right-20 bottom-8 z-10 flex w-60 -rotate-45 items-center justify-center gap-1 bg-classic-violet px-12 py-0.5 text-center text-xs text-white">
            <span>
              Lock: {stream.streamInfo.lockContentAmount || 0}{" "}
              {stream.streamInfo.lockContentTokenSymbol}
            </span>
            <Image
              src="/icons/tokens/DHB.png"
              alt="DHB"
              width={20}
              height={20}
              className="size-4 rounded-full bg-black"
            />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2">
          <Link href={`/${stream.account.username || stream.address}`}>
            <Avatar>
              <AvatarFallback>
                {createAvatarName(
                  stream.account.displayName || stream.account.username || stream.address
                )}
              </AvatarFallback>
              <AvatarImage src={getAvatarUrl(stream.account.avatarImageUrl)} />
            </Avatar>
          </Link>

          <div className="flex-1">
            <p className="truncate text-sm font-bold">{truncate(stream.title, 40)}</p>
            <div className="flex items-start">
              <Link href={`/${stream.account.username || stream.address}`} className="text-[11px]">
                {truncate(
                  stream.account.displayName || stream.account.username || stream.address,
                  26
                )}
              </Link>
            </div>
            <span className="text-[11px] text-gray-500">
              {formatDistance(new Date(stream.createdAt), new Date(), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <HeartFilledIcon className="text-red-500" /> {formatNumber(stream.likes)}
          </div>

          <div className="flex items-center gap-1 text-sm">
            <EyeOpenIcon /> {formatNumber(stream.totalViews)}
          </div>
        </div>
      </div>
    </div>
  );
}
