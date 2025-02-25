/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { memo, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EyeOpenIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { CiMenuKebab } from "react-icons/ci";

import { PreviewVideo } from "@/components/preview-video";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useWebSockets } from "@/contexts/websocket";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { truncate } from "@/libs/strings";
import { createAvatarName } from "@/libs/utils";

import { updateNftVisibility } from "@/services/nfts/mint";

import { getBadgeUrl } from "@/web3/utils/calc";
import { formatNumber } from "@/web3/utils/format";
import { getAvatarUrl } from "@/web3/utils/url";

import { LikeButton } from "../stream/[id]/components/stream-actions";
import { ImageWithLoader } from "./nft-image";

type Props = {
  nft: any;
  isOwner?: Boolean;
  index?: number;
} & React.HTMLAttributes<HTMLDivElement>;

function _StreamItem(props: Props) {
  const { nft, isOwner, index = 0, ...rest } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState<boolean>(nft.isHidden);
  const [isHovered, setIsHovered] = useState(false);
  const { isUserOnline } = useWebSockets();
  const { account } = useActiveWeb3React();
  const { theme } = useTheme();

  const updateVisibility = async (id: string) => {
    try {
      const res = await updateNftVisibility({ id: nft.tokenId, isHidden: !isHidden });
      setIsHidden((prev: boolean) => !prev);
    } catch (e) {
      throw new Error("NFT visibility update has failed!");
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative max-h-[calc((370/16)*1rem)] min-h-[calc((370/16)*1rem)]">
      <div
        {...rest}
        className="relative flex h-auto w-full flex-col overflow-hidden rounded-2xl bg-theme-neutrals-800"
      >
        <div className="relative flex w-full overflow-hidden rounded-2xl pt-[56.25%] text-sm font-semibold">
          <Link
            href={`/stream/${nft.tokenId}`}
            className="next__link absolute left-0 top-0 size-full overflow-hidden rounded-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {!isHovered && (
              <ImageWithLoader
                isHidden={false}
                url={nft.imageUrl}
                name={nft.name}
                transcodingStatus={nft.transcodingStatus}
                status={nft.status}
                tokenId={nft.tokenId}
                address={account}
              />
            )}

            {isHovered && (
              <div className="absolute inset-0 size-full">
                <PreviewVideo nft={nft} />
              </div>
            )}
          </Link>

          {nft?.streamInfo?.isAddBounty && (
            <div className="absolute -left-16 top-12 z-10 flex w-60 -rotate-45 items-center justify-center gap-1 bg-classic-magenta px-10 py-0.5 text-center text-xs text-white shadow-default">
              <span>
                Watch2Earn: {formatNumber(nft.streamInfo.addBountyAmount)}{" "}
                {nft.streamInfo.addBountyTokenSymbol}
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

          {nft?.streamInfo?.isPayPerView && (
            <div className="absolute -right-20 top-8 z-10 flex w-60 rotate-45 items-center justify-center gap-1 bg-classic-blue px-12 py-0.5 text-center text-xs text-white">
              <span>
                PPV: {nft.streamInfo.payPerViewAmount || 0} {nft.streamInfo.payPerViewTokenSymbol}
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
          {nft?.plansDetails?.length > 0 && (
            <div className="absolute -left-20 bottom-8 z-10 flex w-60 rotate-45 items-center justify-center gap-1 bg-classic-purple px-12 py-0.5 text-center text-xs text-white">
              <span>Subscribe To Watch</span>
            </div>
          )}
          {nft?.streamInfo?.isLockContent && (
            <div className="absolute -right-20 bottom-8 z-10 flex w-60 -rotate-45 items-center justify-center gap-1 bg-classic-violet px-12 py-0.5 text-center text-xs text-white">
              <span>
                Lock: {nft.streamInfo.lockContentAmount || 0}{" "}
                {nft.streamInfo.lockContentTokenSymbol}
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

        <div className="flex h-auto w-full flex-col items-start justify-start gap-1 p-4">
          <div className="h-auto w-full px-2">
            <div className="flex size-auto items-center justify-start gap-2">
              <Link href={`/profile/${nft.mintername || nft.minter}`}>
                <Avatar className="size-8">
                  <AvatarFallback>{createAvatarName(nft.minterDisplayName)}</AvatarFallback>
                  <AvatarImage src={getAvatarUrl(nft.minterAvatarUrl)} />
                </Avatar>
              </Link>

              <div className="flex w-full items-center justify-between">
                <div className="flex size-auto flex-col items-start justify-start">
                  <p className="text-xs font-bold text-theme-neutrals-200">
                    {truncate(nft.name, 26)}
                  </p>
                  <div className="mt-1 flex items-start gap-1">
                    <Link
                      href={`/profile/${nft.mintername || nft.minter}`}
                      className="text-[10px] text-neutral-400"
                    >
                      {truncate(nft.minterDisplayName || nft.mintername || nft.minter, 26)}
                    </Link>
                    <div className="relative h-3 w-3">
                      <Image
                        src={getBadgeUrl(nft.minterStaked, theme)}
                        alt="User Badge"
                        layout="fill"
                        className={`object-contain ${!isUserOnline(nft.minter) ? "" : ""}`} // TODO: Add glow effect for when they are online
                      />
                    </div>
                  </div>
                </div>
                {isOwner ? (
                  <div className="">
                    <div className="p-2" onClick={toggleDropdown}>
                      <CiMenuKebab />
                    </div>
                    {isOpen && (
                      <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-black shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="z-50 py-1">
                          <div
                            onClick={() => updateVisibility(nft.id)}
                            className="block px-4 py-2 text-sm text-gray-100"
                          >
                            Change Visibility
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div />
            <div className="flex h-auto items-center justify-end gap-2">
              <LikeButton
                className="gap-1 rounded-full bg-theme-neutrals-700 px-3 py-[2px] text-theme-neutrals-400 dark:bg-theme-neutrals-700 dark:text-theme-neutrals-400"
                vote
                tokenId={nft.tokenId}
                votes={nft.totalVotes?.for || 0}
                size="sm"
              >
                <HeartFilledIcon className="size-3 fill-theme-neutrals-400" />
              </LikeButton>
              <Button
                size="sm"
                className="h-6 gap-1 rounded-full bg-theme-neutrals-700 px-3 text-theme-neutrals-400 dark:bg-theme-neutrals-700 dark:text-theme-neutrals-400"
              >
                <EyeOpenIcon className="size-3" />
                {nft.views || 0}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const StreamItem = memo(_StreamItem, (prev, next) => prev.nft.tokenId === next.nft.tokenId);
