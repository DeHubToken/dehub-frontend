"use client";

import { useEffect, useState } from "react";
import { RxEyeClosed } from "react-icons/rx";
import io from "socket.io-client";

import { LazyImage } from "@/components/image";

import { getImageUrl, getImageUrlApi } from "@/web3/utils/url";

import { env } from "@/configs";

const socket = io(env.NEXT_PUBLIC_SOCKET_URL);

export function ImageWithLoader(props: {
  url: string;
  name?: string;
  isHidden?: boolean;
  transcodingStatus?: string;
  status?: string;
  tokenId: string;
  address?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("uploading started");

  useEffect(() => {
    socket.on(props.tokenId, (data: { progress: number; stage: string }) => {
      setProgress(data.progress);
      setStage(data.stage);
    });

    return () => {
      socket.off(props.tokenId);
    };
  }, []);
  return (
    <div className="relative h-full overflow-hidden">
      <LazyImage
        src={getImageUrl(props.url, 256, 256)}
        alt={props.name || "Upload"}
        className={`absolute inset-0 size-full object-cover transition duration-300 ${
          props.isHidden ? "blur-md" : ""
        }`}
        onLoad={() => setLoading(false)}
      />
      {props.transcodingStatus === "on" ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          {/* Background progress bar with shimmering effect */}
          <div
            className="absolute inset-0 overflow-hidden bg-gray-700"
            style={{
              background: `linear-gradient(to right, #f26418 ${progress}%, #1F2937 ${progress}%)`
            }}
          >
            {/* Shimmer effect */}
            <div
              className="animate-shimmer absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)`,
                width: `${progress}%`
              }}
            />
          </div>

          {/* Transcoding progress text */}
          <div className="relative z-10 flex gap-2 capitalize text-white">
            {stage}... {progress}%
          </div>
        </div>
      ) : loading ? (
        <div className="absolute z-[2] size-full bg-theme-mine-shaft-dark">
          <div className="shimmer size-full" />
        </div>
      ) : props?.status?.toLowerCase() !== "minted" ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center justify-center text-center text-white">
            <RxEyeClosed className="mb-2 text-4xl text-white" />
            <div>{props.status}</div>
            <div className="text-theme-orange-500">will be public once minted</div>
          </div>
        </div>
      ) : (
        props.isHidden && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
            <RxEyeClosed className="text-4xl text-white" />
          </div>
        )
      )}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(${progress});
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}
