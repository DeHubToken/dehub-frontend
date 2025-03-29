import { streams } from "@/data";

import { StreamItem } from "@/app/components/stream-item";

export function VideoPanel() {
  return (
    <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
      {streams.map((item, index) => (
        <StreamItem
          nft={item}
          index={index % 20}
          key={item.tokenId + "--" + index}
          data-is-last={index === streams.length - 1}
        />
      ))}
    </div>
  );
}
