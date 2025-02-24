"use client";

import type { NFT } from "@/services/nfts";

import { useTheme } from "next-themes";

import { SubscriptionModal } from "@/app/profile/[username]/components/subscription-modal";

import { ThumbsDown, ThumbsUp } from "@/components/icons/thumbs-up";

import { useWebSockets } from "@/contexts/websocket";

import { getBadgeUrl } from "@/web3/utils/calc";

import { streamInfoKeys } from "@/configs";

import { ClaimAsCommentor, ClaimAsViewer } from "./claims";
import { PPVModal } from "./ppv-modal";
import { Share } from "./share";
import { LikeButton } from "./stream-actions";
import { TipModal } from "./tip-modal";

export function ActionPanel(props: { nft: NFT; tokenId: number }) {
  const { nft, tokenId } = props;
  const { isUserOnline } = useWebSockets();

  return (
    <div className="mb-8 mt-3 flex h-auto w-full flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="relative flex w-full flex-wrap items-center gap-4 pr-20 sm:size-auto sm:pr-0">
        <LikeButton vote tokenId={tokenId} votes={nft?.totalVotes?.for || 0}>
          <ThumbsUp className="size-5" />
        </LikeButton>
        <LikeButton vote={false} tokenId={tokenId} votes={nft?.totalVotes?.against || 0}>
          <ThumbsDown className="size-5" />
        </LikeButton>
        <SubscriptionModal
          plans={nft?.plansDetails}
          avatarImageUrl={nft.minterAvatarUrl}
          aboutMe={nft?.minterAboutMe}
          displayName={nft.mintername || nft.minter}
        />
        <PPVModal nft={nft} />
        <TipModal tokenId={tokenId} to={nft.minter} />
        <ClaimAsViewer nft={nft} tokenId={tokenId} />
        <ClaimAsCommentor nft={nft} tokenId={tokenId} />
        <div className="absolute right-0 top-0 size-auto sm:hidden">
          <Share />
        </div>
      </div>

      <div className="flex size-auto items-center justify-start gap-5">
        <p className="text-sm">
          <span className="font-semibold">Total Tips :</span> {nft.totalTips || 0}
        </p>
        {nft.lockedBounty && (
          <p className="text-sm">
            <span className="font-semibold">Total Bounty :</span>{" "}
            {nft?.lockedBounty
              ? nft?.lockedBounty?.viewer +
                nft?.lockedBounty?.commentor +
                " " +
                nft?.streamInfo[streamInfoKeys?.addBountyTokenSymbol]
              : 0}
          </p>
        )}

        <div className="hidden size-auto sm:block">
          <Share />
        </div>
      </div>
    </div>
  );
}
