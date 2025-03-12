import { cookies } from "next/headers";

import { safeParseCookie } from "@/libs/cookies";

import { getNFTs } from "@/services/nfts/trending";

import { RecentPanel } from "./recent-panel";

export async function RecentStreams() {
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  const response = await getNFTs({ sortMode: "trends", address: user?.address });

  if (!response.success) {
    return (
      <div className="flex size-full h-screen flex-col items-center justify-center p-4">
        <div className="space-y-4">
          <p className="text-sm">{response.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full flex-1 grid-cols-1 flex-col gap-4 px-6 pt-6 sm:grid-cols-2 xl:flex xl:max-w-[calc((400/16)*1rem)] xl:px-0">
      {response.data.result.length === 0 && (
        <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center p-4">
          No recent NFTs
        </div>
      )}
      {response.data.result.length > 0 ? <RecentPanel streams={response.data.result} /> : null}
    </div>
  );
}
