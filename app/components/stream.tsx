import "server-only";

import { cookies } from "next/headers";

import { Error } from "@/components/error.server";

import { safeParseCookie } from "@/libs/cookies";

import { getNFTs } from "@/services/nfts/trending";

import { SearchItemsContainer, StreamsContainer } from "./streams-container";

type FeedProps = {
  title: string;
  category?: string;
  range?: string;
  sort?: string;
  type: string;
  q?: string;
};

export async function Stream(props: FeedProps) {
  const { category, range, type, q, sort } = props;
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  const res = await getNFTs({
    sortMode: type,
    sort,
    unit: q ? 50 : 20,
    category: category === "All" ? null : category,
    range,
    search: q,
    address: user?.address
  });

  console.log("STREAM-RES", res);

  const isSearched = q ? true : false;

  if (!res.success) {
    return (
      <div className="flex min-h-[calc(100vh-48px-72px-32px-80px)] w-full items-center justify-center">
        <Error error={res.error} title="Oops! Can not load feeds" />
      </div>
    );
  }

  return (
    <div className="h-auto w-full">
      <div className="h-auto w-full">
        {isSearched && (
          <SearchItemsContainer
            // @ts-ignore
            data={res?.data?.result?.videos}
            // @ts-ignore
            accounts={res.data.result.accounts}
            type={type}
            range={range}
            q={q}
            category={category}
          />
        )}
        {!isSearched && (
          <StreamsContainer
            address={user?.address}
            isSearch={isSearched}
            data={res?.data?.result ?? []}
            type={type}
            range={range}
            q={q}
            category={category}
          />
        )}
      </div>
    </div>
  );
}
