/* eslint-disable consistent-return */
"use client";

import type { Player } from "@/components/video";
import type { NFT } from "@/services/nfts";

import { useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

import { Video } from "@/components/video";
import { useActiveWeb3React } from "@/hooks/web3-connect";
import { getStreamStatus, isOwner, isTranscoding } from "@/web3/utils/validators";
import { getSignInfo } from "@/web3/utils/web3-actions";

import { userAtom } from "@/stores";
import { ErrMsgEn, streamInfoKeys } from "@/configs";

/* ----------------------------------------------------------------------------------------------- */

export function StreamVideoSkeleton() {
  return (
    <div className="absolute inset-0 z-[1] size-full bg-gray-300 dark:bg-theme-mine-shaft-dark">
      <div className="shimmer size-full" />
    </div>
  );
}

export function StreamVideoProvider(props: { nft: NFT }) {
  const { nft } = props;

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);

  const [showControl, setShowControl] = useState(false);
  const [error, setError] = useState(false);
  const [sig, setSig] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(true);
  const user = useAtomValue(userAtom);
  const { library, account, chainId } = useActiveWeb3React();
  const isTranscodingVideo = isTranscoding(nft);
  const streamStatus = getStreamStatus(nft, user, chainId);

  const [url, setUrl] = useState(
    `${nft.videoUrl}?sig=${sig}&timestamp=${timestamp}&account=${account?.toLowerCase()}&chainId=${chainId}`
  );

  const isFreeStream =
    !nft?.streamInfo ||
    !(
      nft?.streamInfo?.[streamInfoKeys.isLockContent] ||
      nft?.streamInfo?.[streamInfoKeys.isPayPerView]
    )
      ? true
      : false;

  // Effect to check if video is loaded or not
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => setLoading(false);
    }
    setUrl(
      `${nft.videoUrl}?sig=${sig}&timestamp=${timestamp}&account=${account?.toLowerCase()}&chainId=${chainId}`
    );
  }, [account, chainId, nft.videoUrl, sig, timestamp]);

  // Effect to check if video is free or locked
  useEffect(() => {
    async function createUrl() {
      if (isFreeStream || isOwner(nft, account || "")) {
        setShowControl(true);
        return;
      }

      if (!account) {
        toast.error(ErrMsgEn.wallet.connect_to_stream);
        return;
      }

      if (streamStatus?.streamStatus?.isLockedWithLockContent) {
        toast.error(
          `This video is locked content with ${streamStatus?.lockTokenWithLockContent?.symbol}.`
        );
        return;
      }

      if (streamStatus?.streamStatus?.isLockedWithPPV) {
        if (
          !nft?.streamInfo?.[streamInfoKeys.payPerViewChainIds]
            ?.toString()
            ?.includes(chainId as unknown as string)
        ) {
          toast.error(`Please switch to supported chain for this PPV stream`);
          return;
        }
      }

      const result = await getSignInfo(library, account);
      
      if (!result.sig || result.timestamp === "0") {
        setShowControl(false);
        return;
      }

      setSig(result.sig);
      setTimestamp(result.timestamp);
      setShowControl(true);
    }

    createUrl();

    return () => {
      toast.dismiss();
    };
  }, [
    account,
    chainId,
    isFreeStream,
    library,
    nft,
    streamStatus?.lockTokenWithLockContent?.symbol,
    streamStatus?.streamStatus?.isLockedWithLockContent,
    streamStatus?.streamStatus?.isLockedWithPPV
  ]);
  console.log(nft, "fff")
  if (nft.videoUrl && !isTranscodingVideo && !streamStatus?.streamStatus?.isLockedWithLockContent && !streamStatus?.streamStatus?.isLockedWithPPV) {
    return (
      <div className="relative h-auto w-full overflow-hidden rounded-2xl">
        {loading && <StreamVideoSkeleton />}
       <Video
          options={{
            sources: [{ src: url, type: "video/mp4" }]
          }}
          onReady={(player) => {
            playerRef.current = player;
            player.on("loadedmetadata", () => {
              setLoading(false);
            });
            player.on("error", () => {
              setError(true);
            });
          }}
        />
      </div>
    );
  }

  if (streamStatus?.streamStatus?.isLockedWithLockContent || streamStatus?.streamStatus?.isLockedWithPPV || error) {
    return (
      <div className="flex size-full h-auto max-h-[700px] min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-2xl p-3">
        <p>
          {streamStatus?.streamStatus?.isLockedWithLockContent
            ? `Please hold at least ${nft.streamInfo?.[streamInfoKeys.lockContentAmount]} ${nft.streamInfo?.[streamInfoKeys.lockContentTokenSymbol]} to unlock.`
            : streamStatus?.streamStatus?.isLockedWithPPV
              ? `Unlock PPV stream with ${nft.streamInfo?.[streamInfoKeys.payPerViewAmount]}  ${nft.streamInfo?.[streamInfoKeys.payPerViewTokenSymbol]}`
              : `Error, please report by sending link to tech@dehub.net`}
        </p>
      </div>
    );
  }

  if (isTranscodingVideo) {
    return (
      <div className="flex size-full h-auto max-h-[700px] min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-2xl p-3">
        <p>
          This stream is transcoding to the correct file type, please wait. Use MP4 files for
          optimal upload experience in future.
        </p>
      </div>
    );
  }

  return (
    <div className="flex size-full h-auto max-h-[700px] min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-2xl p-3">
      <p>
        This stream is transcoding to the correct file type, please wait. Use MP4 files for optimal
        upload experience in future.
      </p>
    </div>
  );
}
