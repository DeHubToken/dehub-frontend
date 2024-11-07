"use client";

import { useEffect, useRef, useState } from "react";
import videojs from "video.js";

import "video.js/dist/video-js.css";

export type Player = ReturnType<typeof videojs>;

type Options = {
  autoplay?: boolean;
  controls?: boolean;
  fluid?: boolean;
  aspectRatio?: string;
  poster?: string;
  preload?: "auto" | "metadata" | "none";
  loop?: boolean;
  muted?: boolean;
  playsinline?: boolean;
  sources?: { src: string; type: string }[];
};

export function Video(props: { options: Options; onReady?: (player: Player) => void }) {
  const { options, onReady } = props;
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playedPercentage, setPlayedPercentage] = useState(0);
  const [bufferedPercentage, setBufferedPercentage] = useState(0);

  useEffect(() => {
    const _options = {
      autoplay: options.autoplay || false,
      controls: options.controls || true,
      fluid: options.fluid || true,
      aspectRatio: options.aspectRatio || "16:9",
      poster: options.poster || "",
      preload: options.preload || "auto",
      loop: options.loop || false,
      muted: options.muted || false,
      playsinline: options.playsinline || false,
      sources: options.sources || []
    };

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const player = (playerRef.current = videojs(videoElement, _options, () => {
        onReady && onReady(player);
      }));

      // Buffering event listeners
      player.on("waiting", () => setIsBuffering(true));
      player.on("canplay", () => setIsBuffering(false));

      // Progress and buffering update events
      player.on("timeupdate", () => {
        const currentTime = player?.currentTime() || 0;
        const duration = player?.duration() || 0;
        setPlayedPercentage((currentTime / duration) * 100);
      });

      player.on("progress", () => {
        const buffered = player.buffered();
        const duration = player.duration() || 0;
        if (buffered.length) {
          const bufferedEnd = buffered.end(buffered.length - 1);
          setBufferedPercentage((bufferedEnd / duration) * 100);
        }
      });
    } else {
      const player = playerRef.current;
      player.autoplay(_options.autoplay);
      player.src(_options.sources);
    }
  }, [
    onReady,
    options.aspectRatio,
    options.autoplay,
    options.controls,
    options.fluid,
    options.loop,
    options.muted,
    options.playsinline,
    options.poster,
    options.preload,
    options.sources
  ]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="relative">
      <div ref={videoRef} />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="loader">loading...</div>
        </div>
      )}

      {/* Custom Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800">
        {/* Buffered Indicator */}
        <div
          className="absolute left-0 top-0 h-full bg-gray-500"
          style={{ width: `${bufferedPercentage}%` }}
        />
        {/* Played Indicator */}
        <div
          className="bg-theme-orange-500 absolute left-0 top-0 h-full"
          style={{ width: `${playedPercentage}%` }}
        />
      </div>
    </div>
  );
}
