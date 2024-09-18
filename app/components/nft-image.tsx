"use client";

import { useState } from "react";

import { LazyImage } from "@/components/image";

import { getImageUrl } from "@/web3/utils/url";

export function ImageWithLoader(props: { url: string; name?: string }) {
  const [loading, setLoading] = useState(true);
  return (
    <div className="relative h-full overflow-hidden">
      <LazyImage
        src={getImageUrl(props.url, 256, 256)}
        alt={props.name || "Upload"}
        className="absolute inset-0 size-full object-cover"
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <div className="absolute z-[2] size-full bg-gray-300 dark:bg-theme-mine-shaft-dark">
          <div className="shimmer size-full" />
        </div>
      )}
    </div>
  );
}
