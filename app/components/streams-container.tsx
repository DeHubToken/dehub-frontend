// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import type { GetNFTsResult } from "@/services/nfts/trending";
import type { VirtuosoHandle } from "react-virtuoso";

import "./streams-container.css";

import { useRef, useState } from "react";
import Link from "next/link";
import { VirtuosoGrid } from "react-virtuoso";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { InfiniteScrollScreenOffset, useInfiniteScroll } from "@/hooks/use-infinite-scroll";

import { createAvatarName } from "@/libs/utils";

import { getNFTs } from "@/services/nfts/trending";

import { getAvatarUrl } from "@/web3/utils/url";

import { LiveStreamItem } from "./live-stream-item";
import { StreamItem } from "./stream-item";
import { useStreamProvider } from "./stream-provider";
import { StreamLoader } from "./stream-skeleton";

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

export function StreamsContainer(props: Props) {
  const { data: initialData, isSearch, category, range, type, q, address } = props;

  const page = useRef(1);
  const [data, setData] = useState(initialData);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [canFetchMore, setCanFetchMore] = useState(true);
  const { isPending } = useStreamProvider("FeedsList");

  const { infiniteScrollRef } = useInfiniteScroll({
    fetchMore,
    canFetchMore
  });

  async function fetchMore() {
    if (!canFetchMore || fetchingMore) return;
    setFetchingMore(true);
    const res = await getNFTs({
      sortMode: type,
      unit: q ? 50 : 20,
      category: category === "All" ? null : category,
      range,
      search: q,
      page: page.current + 1,
      address: address
    });
    if (!res.success) {
      setFetchingMore(false);
      return;
    }
    if (res.data.result.length === 0) {
      setCanFetchMore(false);
      setFetchingMore(false);
      return;
    }
    setData([...data, ...res.data.result]);
    setFetchingMore(false);
    page.current += 1;
  }

  if (isPending) {
    return <StreamLoader />;
  }

  // @ts-expect-error
  if (isSearch && data?.videos?.length === 0) {
    return (
      <div className="flex h-[650px] w-full flex-col items-center justify-center">
        <p>No Match found</p>
      </div>
    );
  }

  if (!isSearch && data?.length === 0) {
    return (
      <div className="flex h-[650px] w-full flex-col items-center justify-center">
        <p>No Uploads found</p>
      </div>
    );
  }

  return (
    <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
      {data.map((item, index) => (
        <StreamItem nft={item} index={index} key={item.tokenId + "--" + index} />
      ))}

      {!fetchingMore && <InfiniteScrollScreenOffset ref={infiniteScrollRef} />}
    </div>
  );
}

export function SearchItemsContainer(props: Omit<Props, "isSearch"> & { accounts: any[] }) {
  const { data: initialData, accounts: initialAccounts, category, range, type, q, address } = props;

  const page = useRef(1);
  const [data, setData] = useState(initialData);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [canFetchMore, setCanFetchMore] = useState(true);
  const [accounts, setAccounts] = useState(initialAccounts);
  const { isPending } = useStreamProvider("FeedsList");

  const { infiniteScrollRef } = useInfiniteScroll({
    fetchMore,
    canFetchMore
  });

  async function fetchMore() {
    if (!canFetchMore || fetchingMore) return;
    const res = await getNFTs({
      sortMode: type,
      unit: q ? 50 : 20,
      category: category === "All" ? null : category,
      range,
      search: q,
      page: page.current + 1,
      address: address
    });

    if (!res.success) {
      setFetchingMore(false);
      return;
    }

    if (res.data.result.videos.length === 0 && res.data.result.accounts.length === 0) {
      setCanFetchMore(false);
      setFetchingMore(false);
      return;
    }

    setData([...data, ...res.data.result.videos]);
    setAccounts([...accounts, ...res.data.result.accounts]);
    page.current += 1;
  }

  if (isPending) {
    return <StreamLoader />;
  }

  if (data?.length === 0 && accounts?.length === 0) {
    return (
      <div className="flex h-[650px] w-full flex-col items-center justify-center">
        <p>No Match found</p>
      </div>
    );
  }

  return (
    <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
      {data.map((item, index) => (
        <StreamItem nft={item} index={index % 20} key={item.tokenId + "--" + index} />
      ))}
      {accounts.map((data, index) => (
        <Link
          href={`/${data.username || data.address}`}
          key={index}
          className="relative flex h-auto w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark"
        >
          <div className="overflow-hidden rounded-xl shadow-lg">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Avatar className="size-24 rounded-full border-4 border-white object-cover">
                  <AvatarFallback>
                    {createAvatarName(data.displayName || data.username)}
                  </AvatarFallback>
                  <AvatarImage src={getAvatarUrl(data.avatarImageUrl)} />
                </Avatar>
              </div>
            </div>

            <div className="p-6 text-center">
              <h2 className="text-theme-monochrome-300 text-xl font-bold">
                {data.displayName || data.username}
              </h2>
              <p className="mt-1 text-sm text-gray-500">@{data.username}</p>

              <div className="mt-4 flex justify-center space-x-4">
                <div className="text-center">
                  <span className="text-theme-monochrome-300 block text-sm font-bold">
                    {data.followers}
                  </span>
                  <span className="text-theme-monochrome-300 text-xs">Followers</span>
                </div>
                <div className="text-center">
                  <span className="text-theme-monochrome-300 block text-sm font-bold">
                    {data.likes}
                  </span>
                  <span className="text-theme-monochrome-300 text-xs">Likes</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {!fetchingMore && <InfiniteScrollScreenOffset ref={infiniteScrollRef} />}
    </div>
  );
}
