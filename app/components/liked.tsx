"use client";

// import { cookies } from "next/headers";
import { useEffect, useState } from "react";

import { Error } from "@/components/error.server";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { safeParseCookie } from "@/libs/cookies";

import { getLikedNFTs } from "@/services/nfts/trending";

import { StreamsContainer } from "./streams-container";

type FeedProps = {
  title: string;
  category?: string;
  range?: string;
  type: string;
  sort?: string;
  q?: string;
};

export async function LikedFeed(props: FeedProps) {
  const { category, range, type, q,sort } = props;
  const { account, library } = useActiveWeb3React();
  const [res, setRes] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const res = await getLikedNFTs(
        {
          page: 1,
          sort,
          address: account
        },
        library
      );
      setRes(res);
    })();
  }, [account, library]);

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
        <Title title={props.type} />
        <div className="flex size-auto items-center justify-center gap-4">
          <StreamRangeFilter range={range} />
        </div>
      </div> */}

      <div className="mt-10 h-auto w-full">
        <StreamsContainer
          address={account}
          isSearch={q ? true : false}
          data={res?.data?.result??[]}
          type={type}
          range={range}
          q={q}
          category={category}
          isInfiniteScroll={false}
        />
      </div>
    </div>
  );
}

function Title(props: { title: string }) {
  const { title } = props;
  if (title === "liked") {
    return <h1 className="text-4xl font-semibold">Liked Videos</h1>;
  }

  return <h1 className="text-4xl font-semibold">{title}</h1>;
}
