"use client";

import Link from "next/link";
import { EyeOpenIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { formatDistance } from "date-fns";

import { LazyImage } from "@/components/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";

import { truncate } from "@/libs/strings";
import { createAvatarName } from "@/libs/utils";

import { GetNFTsResult } from "@/services/nfts/trending";

import { getAvatarUrl, getImageUrl } from "@/web3/utils/url";

import { LikeButton } from "./stream-actions";

type Props = {
  streams: GetNFTsResult[];
};

export function RecentPanel(props: Props) {
  const { streams } = props;
  const isMobile = useMediaQuery("(max-width: 640px)");
  if (!isMobile) {
    return (
      <>
        {streams.map((item, i) => (
          <Link
            key={i}
            href={`/stream/${item.tokenId}`}
            className="flex h-auto w-full items-center justify-between overflow-hidden rounded-2xl bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark"
          >
            <figure className="h-32 w-52 overflow-hidden rounded-2xl sm:h-40 sm:w-full sm:max-w-[40%] sm:flex-[0_0_40%] xl:h-28">
              <LazyImage
                src={getImageUrl(item.imageUrl, 256, 256)}
                alt={item.name || "Upload"}
                className="size-full object-cover"
              />
            </figure>

            <div className="flex h-auto w-full flex-col items-start justify-center gap-1 p-4">
              <h1 className="text-md font-semibold">{truncate(item.name, 26)}</h1>
              {item.views && item.views > 0 && <p className="text-sm">{item.views} viewers</p>}
            </div>
          </Link>
        ))}
      </>
    );
  }
  return (
    <>
      {streams.map((item, index) => (
        <div
          key={index}
          className="relative flex h-auto w-full max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark"
        >
          <Link
            href={`/stream/${item.tokenId}`}
            className="relative h-0 w-full overflow-hidden rounded-2xl pt-[56.25%]"
          >
            <LazyImage
              src={getImageUrl(item.imageUrl, 256, 256)}
              alt={item.name || "Upload"}
              className="absolute left-0 top-0 size-full object-cover"
            />
          </Link>
          <div className="flex h-auto w-full flex-col items-start justify-start gap-1 p-4">
            <div className="h-auto w-full">
              <div className="flex size-auto items-center justify-start gap-2">
                <Link href={`/${item.mintername || item.minter}`}>
                  <Avatar className="size-8">
                    <AvatarFallback>{createAvatarName(item.minterDisplayName)}</AvatarFallback>
                    <AvatarImage src={getAvatarUrl(item.minterAvatarUrl)} />
                  </Avatar>
                </Link>

                <div className="flex w-full items-center justify-between">
                  <div className="flex size-auto flex-col items-start justify-start">
                    <p className="text-[11px] font-bold">{truncate(item.name, 26)}</p>
                    <div className="flex items-start gap-1">
                      <Link href={`/${item.mintername || item.minter}`} className="text-[11px]">
                        {truncate(item.minterDisplayName || item.mintername || item.minter, 26)}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between">
              <span className="text-[10px]">
                {formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true })}
              </span>
              <div className="flex h-auto items-center justify-end gap-2">
                <LikeButton
                  className="gap-1 rounded-full bg-black/5 text-[11px] dark:bg-theme-mine-shaft"
                  vote
                  tokenId={item.tokenId}
                  votes={item.totalVotes?.for || 0}
                  size="sm"
                >
                  <HeartFilledIcon className="size-3 fill-red-400" />
                </LikeButton>
                <Button
                  size="sm"
                  className="gap-1 rounded-full bg-black/5 text-[11px] dark:bg-theme-mine-shaft"
                >
                  <EyeOpenIcon className="size-3" />
                  {item.views || 0}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
