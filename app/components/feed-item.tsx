/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { EyeOpenIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { formatDistance } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { truncate } from "@/libs/strings";
import { createAvatarName } from "@/libs/utils";

import { formatNumber } from "@/web3/utils/format";
import { getAvatarUrl } from "@/web3/utils/url";

import { ImageWithLoader } from "./nft-image";

type Props = {
  nft: any;
} & React.HTMLAttributes<HTMLDivElement>;

export function FeedItem(props: Props) {
  const { nft, ...rest } = props;

  return (
    <div
      {...rest}
      className="relative flex h-auto w-full max-w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark sm:max-w-[300px] lg:max-w-[300px] xl:max-w-[31.95%] 2xl:max-w-[24%] 3xl:max-w-[290px]"
    >
      <div className="relative h-[225px] w-full overflow-hidden rounded-2xl text-sm font-semibold sm:h-[175px] 3xl:h-[190px]">
        <Link
          href={`/stream/${nft.tokenId}`}
          className="next__link size-full overflow-hidden rounded-2xl"
        >
          <ImageWithLoader url={nft.imageUrl} name={nft.name} />
        </Link>

        {nft?.streamInfo?.isAddBounty && (
          <div className="from-theme-orange-500 to-theme-orange-300 absolute -left-16 top-12 z-10 flex w-60 -rotate-45 items-center justify-center gap-1 bg-gradient-to-r px-10 py-0.5 text-center text-xs text-white shadow-default">
            <span>
              Watch2Earn: {formatNumber(nft.streamInfo.addBountyAmount)}{" "}
              {nft.streamInfo.addBountyTokenSymbol}
            </span>
            <Image
              src="/icons/tokens/BJ.png"
              alt="BJ"
              width={20}
              height={20}
              className="size-4 rounded-full bg-black"
            />
          </div>
        )}

        {nft?.streamInfo?.isPayPerView && (
          <div className="absolute -right-20 top-8 z-10 flex w-60 rotate-45 items-center justify-center gap-1 bg-blue-500 px-12 py-0.5 text-center text-xs text-white">
            <span>
              PPV: {nft.streamInfo.payPerViewAmount || 0} {nft.streamInfo.payPerViewTokenSymbol}
            </span>
            <Image
              src="/icons/tokens/BJ.png"
              alt="BJ"
              width={20}
              height={20}
              className="size-4 rounded-full bg-black"
            />
          </div>
        )}

        {nft?.streamInfo?.isLockContent && (
          <div className="absolute -right-20 bottom-8 z-10 flex w-60 -rotate-45 items-center justify-center gap-1 bg-red-500 px-12 py-0.5 text-center text-xs text-white">
            <span>
              Lock: {nft.streamInfo.lockContentAmount || 0} {nft.streamInfo.lockContentTokenSymbol}
            </span>
            <Image
              src="/icons/tokens/BJ.png"
              alt="BJ"
              width={20}
              height={20}
              className="size-4 rounded-full bg-black"
            />
          </div>
        )}
      </div>

      <div className="flex h-auto w-full flex-col items-start justify-start gap-1 p-4">
        <div className="h-auto w-full">
          <div className="flex size-auto items-center justify-start gap-2">
            <Link href={`/${nft.mintername || nft.minter}`}>
              <Avatar className="size-8">
                <AvatarFallback>{createAvatarName(nft.minterDisplayName)}</AvatarFallback>
                <AvatarImage src={getAvatarUrl(nft.minterAvatarUrl)} />
              </Avatar>
            </Link>

            <div className="flex size-auto flex-col items-start justify-start">
              <p className="text-[11px] font-bold">{truncate(nft.name, 26)}</p>
              <Link href={`/${nft.mintername || nft.minter}`} className="text-[11px]">
                {truncate(nft.minterDisplayName || nft.mintername || nft.minter, 26)}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-[10px]">
            {formatDistance(new Date(nft.createdAt), new Date(), { addSuffix: true })}
          </span>
          <div className="flex h-auto items-center justify-end gap-2">
            <Button variant="secondary" size="sm" className="gap-1 rounded-full text-[11px]">
              <HeartFilledIcon className="size-3" /> {nft.totalVotes?.for || nft.likes || 0}
            </Button>
            <Button variant="secondary" size="sm" className="gap-1 rounded-full text-[11px]">
              <EyeOpenIcon className="size-3" />
              {nft.views || 0}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
