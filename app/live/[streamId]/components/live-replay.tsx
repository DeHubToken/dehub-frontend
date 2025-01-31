"use client";

import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import Player from "video.js/dist/types/player";

import { env } from "@/configs";

import "video.js/dist/video-js.css";

import { Video } from "@/components/video";

interface ReplayPlayerProps {
  streamId: string;
}

export default function ReplayPlayer({ streamId }: ReplayPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const videoUrl = `${env.cdnBaseUrl}live/mp4/${streamId}.mp4`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black p-6"
      style={{ aspectRatio: "16/9" }}
    >
      {!isPlaying ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">This stream has ended.</h2>
          <button
            onClick={() => setIsPlaying(true)}
            className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white"
          >
            Watch Replay
          </button>
        </div>
      ) : (
        <Video
          options={{
            sources: [{ src: videoUrl, type: "video/mp4" }]
          }}
          onReady={(player) => {
            playerRef.current = player;
            player.on("loadedmetadata", () => {
              //   setLoading(false);
            });
            player.on("error", () => {
              //   setError(true);
            });
          }}
        />
        // <div data-vjs-player>
        //   <video
        //     ref={videoRef}
        //     className="video-js vjs-default-skin vjs-big-play-centered h-full w-full"
        //   >
        //     <source src={videoUrl} type="video/mp4" />
        //   </video>
        // </div>
      )}
    </div>
  );
}
