// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import type { GetNFTsResult } from "@/services/nfts/trending";

import { useState } from "react";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getNFTs } from "@/services/nfts/trending";

import { getAvatarUrl } from "@/web3/utils/url";

import { LiveStreamItem } from "./live-stream-item";
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
  isInfiniteScroll?: boolean;
};

const containerClass =
  "h-auto w-full grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 relative";

const streamsMap = new Map<string, any>();

export function StreamsContainer(props: Props) {
  const {
    data: initialData,
    isSearch,
    category,
    range,
    type,
    q,
    address,
    isInfiniteScroll = true
  } = props;

  initialData.forEach((nft) => {
    streamsMap.set(`${nft._id}`, nft);
  });

  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(isInfiniteScroll);
  const [isLive, setIsLive] = useState(type === "live");
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

    const filteredData = res.data.result.filter((nft) => !streamsMap.has(`${nft._id}`));
    // @ts-ignore
    setData(prevData => [...prevData, ...filteredData]);
    setPage(page + 1);
  }

  if (isPending) {
    return <Skeleton />;
  }

  return (
    <InfiniteScroll
      next={isInfiniteScroll ? fetchMore : () => {}}
      hasMore={hasMore}
      loader={<Skeleton total={4} />}
      dataLength={data.length || 0}
      className={containerClass}
    >
      {isSearch &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        data?.videos?.map((nft, index) => (
          <StreamItem nft={nft} key={nft.tokenId + "--" + index} />
        ))}

      {!isSearch &&
        data?.map((nft, index) =>
          isLive ? (
            <LiveStreamItem
              stream={nft}
              key={nft?._id}
              data-is-last={index === data.length - 1}
            />
          ) : (
            <StreamItem
              nft={nft}
              key={nft._id}
              data-is-last={index === data.length - 1}
            />
          )
        )}
      {isSearch &&
        !data?.videos?.length &&
        !data?.accounts?.length &&
        !data?.livestreams?.length && (
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

export function SearchItemsContainer(props: Omit<Props, "isSearch"> & { accounts: any[] }) {
  const {
    data: initialData,
    accounts: initialAccounts,
    category,
    range,
    type,
    q,
    address,
    isInfiniteScroll = true
  } = props;

  const [data, setData] = useState(initialData);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(isInfiniteScroll);
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

    // @ts-ignore
    if (res.data.result.videos.length === 0 && res.data.result.accounts.length === 0) {
      setHasMore(false);
      return;
    }

    // @ts-ignore
    setData([...data, ...res.data.result.videos]);
    // @ts-ignore
    setAccounts([...accounts, ...res.data.result.accounts]);

    setPage(page + 1);
  }

  if (isPending) {
    return <Skeleton />;
  }

  return (
    <InfiniteScroll
      next={isInfiniteScroll ? fetchMore : () => {}}
      hasMore={isInfiniteScroll && hasMore}
      loader={<Skeleton total={4} />}
      dataLength={data.length || 0}
      className={containerClass}
    >
      {data?.map((nft, index) => <StreamItem nft={nft} key={nft.tokenId + "--" + index} />)}
      {accounts.map((nft, index) => (
        <Link
          href={`/${nft.username || nft.address}`}
          key={index}
          className="relative flex h-auto w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark"
        >
          <div className="shadow-lg overflow-hidden rounded-xl">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Avatar className="size-24 rounded-full border-4 border-white object-cover">
                  <AvatarFallback>
                    {createAvatarName(nft.displayName || nft.username)}
                  </AvatarFallback>
                  <AvatarImage src={getAvatarUrl(nft.avatarImageUrl)} />
                </Avatar>
              </div>
            </div>

            <div className="p-6 text-center">
              <h2 className="text-theme-monochrome-300 text-xl font-bold">
                {nft.displayName || nft.username}
              </h2>
              <p className="mt-1 text-sm text-gray-500">@{nft.username}</p>

              <div className="mt-4 flex justify-center space-x-4">
                <div className="text-center">
                  <span className="text-theme-monochrome-300 block text-sm font-bold">
                    {nft.followers}
                  </span>
                  <span className="text-theme-monochrome-300 text-xs">Followers</span>
                </div>
                <div className="text-center">
                  <span className="text-theme-monochrome-300 block text-sm font-bold">
                    {nft.likes}
                  </span>
                  <span className="text-theme-monochrome-300 text-xs">Likes</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* // eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {data?.length === 0 && accounts?.length === 0 && (
        <div className="flex h-[650px] w-full flex-col items-center justify-center">
          <p>No Match found</p>
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
