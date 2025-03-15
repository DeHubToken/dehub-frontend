import type { NFT } from "@/services/nfts";

import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";

import { safeParseCookie } from "@/libs/cookies";

import { getNFT } from "@/services/nfts";

import { getTransactionLink } from "@/web3/utils/format";

import { defaultChainId, streamInfoKeys } from "@/configs";

import { ActionPanel } from "./action-panel";
import { CommentsPanel } from "./comments";
import { StreamVideoProvider, StreamVideoSkeleton } from "./stream-video-provider";
import TranscodingVideo from "./transcode-state";

function StreamInfo(props: { nft: NFT }) {
  const { nft } = props;

  return (
    <div className="mb-4 mt-8 flex flex-col items-start justify-start gap-4">
      <h1 className="w-full break-words text-2xl font-medium text-theme-neutrals-200">
        {nft.name}
      </h1>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-theme-neutrals-400">Uploaded by:</span>
          <Link
            href={`/profile/${nft.mintername || nft.minter}`}
            className="font-bold text-theme-neutrals-200"
          >
            {nft.minterDisplayName || nft.mintername}
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-theme-neutrals-400">Date:</span>
          <span className="text-theme-neutrals-200">
            {dayjs(nft.createdAt).format("MMM DD, YYYY")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-theme-neutrals-400">Views:</span>
          <span className="text-theme-neutrals-200">{nft.views || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-theme-neutrals-400">Total Tips:</span>
          <span className="text-theme-neutrals-200">{nft.totalTips || 0}</span>
        </div>
      </div>
    </div>
  );
}

export async function Stream(props: { tokenId: number }) {
  const { tokenId } = props;
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  const response = await getNFT(tokenId, user?.address as string);

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
    <div className="h-auto min-h-screen w-full flex-1 p-6">
      <Suspense fallback={<StreamVideoSkeleton />}>
        <StreamVideo tokenId={tokenId} address={user?.address as string} />
      </Suspense>
      <StreamInfo nft={nft} />
      <ActionPanel nft={nft} tokenId={tokenId} />
      <div className="rounded-3xl bg-theme-neutrals-800 p-6">
        <span className="text-xs text-theme-neutrals-400">Description</span>
        <p className="mt-4 text-theme-neutrals-200">{nft.description}</p>
      </div>
      <CommentsPanel nft={nft} tokenId={tokenId} />
    </div>
  );
}

async function StreamVideo(props: { tokenId: number; address: string }) {
  const { tokenId } = props;
  const response = await getNFT(tokenId, props.address);

  if (!response.success) {
    return null;
  }

  const nft = response.data.result;
  // Checking for transcoding status
  const isTranscodingVideo = nft?.transcodingStatus === "on";
  if (isTranscodingVideo) {
    return <TranscodingVideo tokenId={nft.tokenId.toString()} />;
  }

  // Is free stream
  let isFreeStream = false;

  if (!nft?.streamInfo) isFreeStream = true;

  if (
    nft.streamInfo &&
    !nft?.streamInfo[streamInfoKeys?.isLockContent] &&
    !nft?.streamInfo[streamInfoKeys?.isPayPerView]
  ) {
    isFreeStream = true;
  }

  if (isFreeStream) {
    // render FreeStream
  }

  return <StreamVideoProvider nft={nft} />;
}
