"use client"
import { StreamVideoSkeleton } from "@/app/stream/[id]/components/stream-video-provider";
import { env } from "@/configs";
import { useUser } from "@/hooks/use-user";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function ViewerView(props: { stream: any }) {
  const { stream } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const { account, chainId, library, user } = useUser();

  useEffect(() => {
    if (!videoRef.current || !stream) return;

    let hls: Hls | null = null;
    const video = videoRef.current;
    const streamUrl = `${env.cdnBaseUrl}live/hls/${stream._id}/playlist.m3u8`;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      hls.on(Hls.Events.BUFFER_APPENDING, () => setIsBuffering(true));
      hls.on(Hls.Events.BUFFER_APPENDED, () => setIsBuffering(false));
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          alert("The stream is not currently available. Please try again later.");
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => video.play());
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [stream]);

  return (
    <div className="relative h-auto w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16/9" }}>
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        muted
      />
      {isBuffering && <StreamVideoSkeleton />}
    </div>
  );
}
