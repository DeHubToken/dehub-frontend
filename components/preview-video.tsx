"use client";

import type { NFT } from "@/services/nfts";

import { lazy, Suspense, useState } from "react";

import { env } from "@/configs";

import { Spinner } from "./ui/spinner";

const HoverVideoPlayer = lazy(() => import("react-hover-video-player"));

type Props = {
  nft: NFT;
};

export function PreviewVideo({ nft }: Props) {
  const url = `${env.NEXT_PUBLIC_CDN_BASE_URL}videos/${nft.tokenId}.mp4`;
  const [isBuffering, setIsBuffering] = useState(false);

  return (
    <Suspense
      fallback={
        <div className="relative flex size-full items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <HoverVideoPlayer
        videoSrc={url}
        pausedOverlay={<div className="" />}
        playbackRangeStart={0}
        playbackRangeEnd={3}
        videoStyle={{ width: "100%", height: "100%" }}
        className="relative size-full overflow-hidden rounded-2xl text-sm font-semibold"
        loadingOverlay={
          <div className="relative flex size-full items-center justify-center">
            <Spinner />
          </div>
        }
        preload="auto" // Preload the video for better streaming
      />
    </Suspense>
  );
}
