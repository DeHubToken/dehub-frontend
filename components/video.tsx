"use client";

import { useEffect, useRef } from "react";
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

      // You could update an existing player in the `else` block here
      // on prop change, for example:
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
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}
