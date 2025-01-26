"use client";

// import { cookies } from "next/headers";
import { useEffect, useState } from "react";

import { StreamsContainer } from "@/app/components/streams-container";

import { Error } from "@/components/error.server";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { safeParseCookie } from "@/libs/cookies";

import { getLikedNFTs, getNFTs } from "@/services/nfts/trending";

// import { StreamsContainer } from "./streams-container";

type FeedProps = {
  title: string;
  category?: string;
  range?: string;
  type: string;
  q?: string;
};

export async function LiveFeed(props: FeedProps) {
  const { category, range, type, q } = props;
  const { account, library } = useActiveWeb3React();

  if (!account) {
    return (
      <div className="flex min-h-[calc(100vh-48px-72px-32px-80px)] w-full items-center justify-center">
        <Error error="Account not connected" title="Oops! Can not load feeds" />
      </div>
    );
  }

  // change to get live feed
  const res = await getNFTs({
    sortMode: 'live',
    unit: q ? 50 : 20,
    category: category === "All" ? null : category,
    range,
    search: q,
    address: account
  });

  if (!res?.success) {
    return (
      <div className="flex min-h-[calc(100vh-48px-72px-32px-80px)] w-full items-center justify-center">
        <Error error={res?.error} title="Oops! Can not load feeds" />
      </div>
    );
  }

  return (
    <div className="h-auto w-full">
      {/* <div className="flex h-auto w-full items-center justify-between">
        <h1 className="text-4xl font-semibold">Live Videos</h1>
      </div> */}

      <div className="mt-10 h-auto w-full">
        <StreamsContainer
          address={account}
          isSearch={false}
          data={res?.data?.result}
          type={type}
          range={range}
          q={q}
          category={category}
        />
      </div>
    </div>
  );
}
