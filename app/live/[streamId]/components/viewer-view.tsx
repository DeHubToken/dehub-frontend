"use client"
import { StreamVideoSkeleton } from "@/app/stream/[id]/components/stream-video-provider";
import { env } from "@/configs";
import { useUser } from "@/hooks/use-user";
import { useEffect, useRef, useState } from "react";
import videojs from "video.js";

export default function ViewerView(props: { stream: any }) {
  const { stream } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
    const { account, chainId, library, user } = useUser();
  

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      preload: "auto",
      fluid: true,
      responsive: true,
      aspectRatio: "16:9",
      sources: [
        {
          src: `${env.cdnBaseUrl}live/hls/${stream._id}/playlist.m3u8`,
          type: "application/x-mpegURL",
        },
      ],
    });

    player.on("waiting", () => setIsBuffering(true));
    player.on("canplay", () => setIsBuffering(false));
    player.on('error', () => {
      alert('The stream is not currently available. Please try again later.');
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [stream]);

  return (
    <div className="relative h-auto w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16/9" }}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
      {isBuffering && (
        <StreamVideoSkeleton />
        // <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        //   <div className="loader">Buffering...</div>
        // </div>
      )}
    </div>
  );
}
