import type { NFT } from "@/services/nfts";

import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";

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
    <div className="mt-5 h-auto w-full rounded-2xl border border-theme-mine-shaft-dark bg-theme-mine-shaft-dark p-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <div className="flex h-auto w-full flex-col items-start justify-start gap-4 overflow-hidden">
        <div className="flex h-auto w-full flex-col items-start justify-between gap-2 sm:flex-row">
          <div className="flex items-center gap-1">
            <p className="text-sm">
              <span className="font-semibold">Views :</span> {nft.views || 0}
            </p>
          </div>
          <p className="text-sm">
            <span className="font-semibold">Uploaded :</span>{" "}
            {new Date(nft.createdAt).toDateString()}{" "}
            {getTransactionLink(nft.chainId || defaultChainId, nft.mintTxHash) && (
              <a
                href={getTransactionLink(nft.chainId || defaultChainId, nft.mintTxHash)!}
                className="whitespace-pre text-white"
                target="_blank"
                rel="noreferrer"
              >
                (Full details)
              </a>
            )}
          </p>
        </div>
        <h1 className="w-full break-words text-2xl font-medium">{nft.name}</h1>
        {/* <p className="text-sm">
          <span className="font-semibold">Duration :</span> {secondToMinute(nft?.videoDuration)}{" "}
          minutes
        </p> */}
        <p className="text-sm">
          <span className="font-semibold">Description :</span> {nft.description}
        </p>
        <div className="flex w-full flex-wrap">
          <span className="mr-1 font-semibold">Categories :</span>
          {nft?.category?.map((i) => (
            <Link key={i} href={`/?category=${i}&type=trends`} className="mr-1">
              <span className="cursor-pointer">#{i}</span>
            </Link>
          ))}
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
    <div className="h-auto min-h-screen w-full px-4 py-20 xl:max-w-[75%] xl:flex-[0_0_75%]">
      <Suspense fallback={<StreamVideoSkeleton />}>
        <StreamVideo tokenId={tokenId} address={user?.address as string} />
      </Suspense>
      <ActionPanel nft={nft} tokenId={tokenId} />
      <StreamInfo nft={nft} />
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
  console.log('nft:', nft)
  // Checking for transcoding status
  const isTranscodingVideo = nft?.transcodingStatus === "on";
  if (isTranscodingVideo) {
    return <TranscodingVideo tokenId={nft.tokenId.toString()} />;
  }

  // Is free stream
  let isFreeStream = false;

  if (!nft?.streamInfo)
    isFreeStream = true;

  if (nft.streamInfo && !nft?.streamInfo[streamInfoKeys?.isLockContent] && !nft?.streamInfo[streamInfoKeys?.isPayPerView]) {
    isFreeStream = true;
  }

  if (isFreeStream) {
    // render FreeStream
  }

  return <StreamVideoProvider nft={nft} />;
}
