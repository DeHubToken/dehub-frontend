"use client";

import type { NFT } from "@/services/nfts";

import HoverVideoPlayer from "react-hover-video-player";

import { Spinner } from "./ui/spinner";

type Props = {
  nft: NFT;
};

export function PreviewVideo(props: Props) {
  const { nft } = props;
  const url = `${process.env.NEXT_PUBLIC_CDN_BASE_URL}videos/${nft.tokenId}.mp4`
  return (
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
    />
  );
}
