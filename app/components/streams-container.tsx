"use client";

import type { GetNFTsResult } from "@/services/nfts/trending";

import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { getNFTs } from "@/services/nfts/trending";

import { StreamItem } from "./stream-item";
import { useStreamProvider } from "./stream-provider";
import { StreamSkeleton } from "./stream-skeleton";

type Props = {
  isSearch: boolean;
  data: GetNFTsResult[];
  category?: string;
  range?: string;
  type: string;
  q?: string;
  address?: string;
};

const containerClass =
  "flex h-auto w-full flex-wrap items-stretch justify-start gap-5 xl:gap-x-[1.25%] xl:gap-y-4 3xl:gap-3";

export function StreamsContainer(props: Props) {
  const { data: initialData, isSearch, category, range, type, q, address } = props;

  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isPending } = useStreamProvider("FeedsList");

  async function fetchMore() {
    const res = await getNFTs({
      sortMode: type,
      unit: q ? 50 : 20,
      category: category === "All" ? null : category,
      range,
      search: q,
      page: page + 1,
      address: address
    });

    if (!res.success) {
      setHasMore(false);
      return;
    }

    if (res.data.result.length === 0) {
      setHasMore(false);
      return;
    }

    setData([...data, ...res.data.result]);
    setPage(page + 1);
  }

  if (isPending) {
    return <Skeleton />;
  }

  return (
    <InfiniteScroll
      next={fetchMore}
      hasMore={hasMore}
      loader={<Skeleton total={4} />}
      dataLength={data.length || 0}
      className={containerClass}
    >
      {isSearch &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        data?.videos?.map((nft, index) => <FeedItem nft={nft} key={nft.tokenId + "--" + index} />)}

      {!isSearch &&
        data?.map((nft, index) => (
          <StreamItem
            nft={nft}
            key={nft.tokenId + "--" + index}
            data-is-last={index === data.length - 1}
          />
        ))}
      {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error */}
      {isSearch && data?.videos?.length === 0 && (
        <div className="flex h-[650px] w-full flex-col items-center justify-center">
          <p>No Match found</p>
        </div>
      )}

      {!isSearch && data?.length === 0 && (
        <div className="flex h-[650px] w-full flex-col items-center justify-center">
          <p>No Uploads found</p>
        </div>
      )}
    </InfiniteScroll>
  );
}

function Skeleton(props: { total?: number }) {
  const { total = 8 } = props;
  return (
    <div className={containerClass}>
      {Array.from({ length: total }).map((_, index) => (
        <StreamSkeleton key={index} />
      ))}
    </div>
  );
}
