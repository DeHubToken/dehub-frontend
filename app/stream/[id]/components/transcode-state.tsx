"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { env } from "@/configs";

export default function TranscodingVideo(props: { tokenId: string }) {
  const socket = io(env.NEXT_PUBLIC_SOCKET_URL);
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
    <div className="shimmer relative flex size-full h-auto max-h-[700px] min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-gray-800 p-3">
      {/* Centered Progress Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-3xl font-semibold text-white">
          {stage} {progress}%
        </p>
      </div>

      {/* Loading Bar at the Bottom */}
      <div className="absolute bottom-0 left-0 h-2 w-full overflow-hidden rounded-b-2xl bg-gray-200">
        <div
          className="shimmer from-theme-orange-500 to-theme-orange-300 h-full bg-gradient-to-r transition-all duration-500"
          style={{ width: "80%" }}
        />
      </div>
    </div>
  );
}
