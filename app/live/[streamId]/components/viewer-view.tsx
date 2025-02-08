"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

import { StreamVideoSkeleton } from "@/app/stream/[id]/components/stream-video-provider";

import { Button } from "@/components/ui/button";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { env, StreamStatus } from "@/configs";

import { LivestreamEvents } from "../enums/livestream.enum";
import StatusBadge from "./status-badge";

export default function ViewerView({stream}: { stream: any }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const { account, chainId, library, user } = useUser();
  const { socket } = useWebSockets();
  const [hasJoined, setHasJoined] = useState(false);

  const joinNow = async () => {
    if (!socket || hasJoined) return;

    if (stream.status !== StreamStatus.LIVE) {
      alert("The stream has not started yet.");
      return;
    }
    console.log("Joining");
    setHasJoined(true);
    socket.emit(LivestreamEvents.JoinStream, { streamId: stream._id });
  };

  useEffect(() => {
    if (!socket) return;

    const handleStreamEnd = () => {
      alert("The stream has ended.");
      setHasJoined(false);
    };

    socket.on(LivestreamEvents.EndStream, handleStreamEnd);

    return () => {
      socket.off(LivestreamEvents.EndStream, handleStreamEnd);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !stream._id) return;

    socket.emit(LivestreamEvents.JoinRoom, { streamId: stream._id });
  }, [socket, stream._id]);

  useEffect(() => {
    if (!videoRef.current || !stream) return;

    let hls: Hls | null = null;
    const video = videoRef.current;
    const streamUrl = `${env.NEXT_PUBLIC_CDN_BASE_URL}live/hls/${stream._id}/playlist.m3u8`;

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
    <div
      className="relative h-auto w-full overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: "16/9" }}
    >
      <StatusBadge status={stream.status} />
      {hasJoined && <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        muted
      />}
      {isBuffering && <StreamVideoSkeleton />}
      <div className="absolute bottom-4 flex w-full justify-between px-4">
        {!hasJoined && (
          <Button onClick={joinNow} variant="gradientOne" className="px-6">
            Join Now
          </Button>
        )}
      </div>
    </div>
  );
}
