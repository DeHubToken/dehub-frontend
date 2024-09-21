import type { NFT } from "@/services/nfts";

import { Suspense } from "react";
import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";

import { secondToMinute } from "@/libs/date-time";

import { getNFT } from "@/services/nfts";

import { getTransactionLink } from "@/web3/utils/format";

import { defaultChainId, streamInfoKeys } from "@/configs";

import { ClaimAsCommentor, ClaimAsViewer } from "./claims";
import { CommentsPanel } from "./comments";
import { PPVModal } from "./ppv-modal";
import { Share } from "./share";
import { LikeButton } from "./stream-actions";
import { StreamVideoProvider, StreamVideoSkeleton } from "./stream-video-provider";
import { TipModal } from "./tip-modal";

function ActionPanel(props: { nft: NFT; tokenId: number }) {
  const { nft, tokenId } = props;
  return (
    <div className="mt-3 h-auto w-full">
      <p className="text-sm">
        Uploaded by{" "}
        <Link href={`/${nft.mintername || nft.minter}`} className="text-orange-400">
          <span>{nft.minterDisplayName || nft.mintername}</span>
        </Link>
      </p>
      <div className="mt-3 flex h-auto w-full flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="relative flex w-full flex-wrap items-center gap-4 pr-20 sm:size-auto sm:pr-0">
          <LikeButton vote tokenId={tokenId} votes={nft?.totalVotes?.for || 0}>
            <ThumbsUp className="size-5" />
          </LikeButton>
          <LikeButton vote={false} tokenId={tokenId} votes={nft?.totalVotes?.against || 0}>
            <ThumbsDown className="size-5" />
          </LikeButton>
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
              {nft.lockedBounty
                ? nft.lockedBounty.viewer +
                  nft.lockedBounty.commentor +
                  " " +
                  nft.streamInfo[streamInfoKeys.addBountyTokenSymbol]
                : 0}
            </p>
          )}

          <div className="hidden size-auto sm:block">
            <Share />
          </div>
        </div>
      </div>
    </div>
  );
}

function StreamInfo(props: { nft: NFT }) {
  const { nft } = props;

  return (
    <div className="mt-5 h-auto w-full rounded-2xl border border-theme-mine-shaft-dark bg-theme-mine-shaft-dark p-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <div className="flex h-auto w-full flex-col items-start justify-start gap-2">
        <div className="flex h-auto w-full items-center justify-between">
          <div className="flex items-center gap-1">
            <p className="text-sm">
              <span className="font-semibold">Views :</span> {nft.views || 0}
            </p>
          </div>
          <p className="text-sm">
            <span className="font-semibold">Uploaded At :</span>{" "}
            {new Date(nft.createdAt).toDateString()}{" "}
            {getTransactionLink(nft.chainId || defaultChainId, nft.mintTxHash) && (
              <a
                href={getTransactionLink(nft.chainId || defaultChainId, nft.mintTxHash)!}
                className="text-white"
                target="_blank"
                rel="noreferrer"
              >
                (Full details)
              </a>
            )}
          </p>
        </div>
        <h1 className="text-2xl font-medium">{nft.name}</h1>
        <p className="text-sm">
          <span className="font-semibold">Duration :</span> {secondToMinute(nft?.videoDuration)}{" "}
          minutes
        </p>
        <p className="text-sm">
          <span className="font-semibold">Description :</span> {nft.description}
        </p>
        <p className="text-sm text-orange-400">
          <span className="font-semibold">Categories :</span> #{nft.category.join("  #")}
        </p>
      </div>
    </div>
  );
}

export async function Stream(props: { tokenId: number }) {
  const { tokenId } = props;
  const response = await getNFT(tokenId);

  if (!response.success) {
    return (
      <div className="absolute left-0 top-0 flex size-full h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-tanker text-3xl sm:text-6xl">{response.error}</h1>
        <Button asChild variant="gradientOne" className="px-6">
          <Link href="/">Go Back</Link>
        </Button>
      </div>
    );
  }

  const nft = response.data.result;

  return (
    <div className="h-auto min-h-screen w-full px-4 py-20 xl:max-w-[75%] xl:flex-[0_0_75%]">
      <Suspense fallback={<StreamVideoSkeleton />}>
        <StreamVideo tokenId={tokenId} />
      </Suspense>
      <ActionPanel nft={nft} tokenId={tokenId} />
      <StreamInfo nft={nft} />
      <CommentsPanel nft={nft} tokenId={tokenId} />
    </div>
  );
}

async function StreamVideo(props: { tokenId: number }) {
  const { tokenId } = props;
  const response = await getNFT(tokenId);

  if (!response.success) {
    return null;
  }

  const nft = response.data.result;

  // Checking for transcoding status
  const isTranscodingVideo = nft?.transcodingStatus === "on";
  if (isTranscodingVideo) {
    return <TranscodingVideo />;
  }

  // Is free stream
  let isFreeStream = false;
  if (!nft.streamInfo) isFreeStream = true;
  if (
    nft.streamInfo &&
    !nft.streamInfo[streamInfoKeys.isLockContent] &&
    !nft.streamInfo[streamInfoKeys.isPayPerView]
  ) {
    isFreeStream = true;
  }

  if (isFreeStream) {
    // render FreeStream
  }

  return <StreamVideoProvider nft={nft} />;
}

function TranscodingVideo() {
  return (
    <div className="flex size-full h-auto max-h-[700px] min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-2xl p-3">
      <p>
        This stream is transcoding to the correct file type, please wait. Use MP4 files for optimal
        upload experience in future.
      </p>
    </div>
  );
}
