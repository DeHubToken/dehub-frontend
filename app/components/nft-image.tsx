"use client";

import { useState } from "react";
import { LazyImage } from "@/components/image";
import { getImageUrl } from "@/web3/utils/url";
import { RxEyeClosed } from "react-icons/rx";

export function ImageWithLoader(props: { url: string; name?: string; isHidden?: boolean }) {
  const [loading, setLoading] = useState(true);
  
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
      {loading && (
        <div className="absolute z-[2] size-full bg-gray-300 dark:bg-theme-mine-shaft-dark">
          <div className="shimmer size-full" />
        </div>
      )}
      {props.isHidden && (
        <div className="absolute inset-0 flex items-center justify-center z-[3] bg-black/40">
          <RxEyeClosed className="text-white text-4xl" />
        </div>
      )}
    </div>
  );
}
