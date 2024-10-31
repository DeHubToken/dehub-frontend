"use client";

import { lazy, Suspense, useState } from "react";
import type { NFT } from "@/services/nfts";
import { Spinner } from "./ui/spinner";
import { env } from "@/configs";

const HoverVideoPlayer = lazy(() => import("react-hover-video-player"));

type Props = {
  nft: NFT;
};

export function PreviewVideo({ nft }: Props) {
  const url = `${env.cdnBaseUrl}videos/${nft.tokenId}.mp4`;
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
        className="relative h-[225px] w-full overflow-hidden rounded-2xl text-sm font-semibold sm:h-[175px] 3xl:h-[190px]"
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
