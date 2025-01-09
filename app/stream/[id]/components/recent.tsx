import { cookies } from "next/headers";

import { safeParseCookie } from "@/libs/cookies";

import { getNFTs } from "@/services/nfts/trending";

import { RecentPanel } from "./recent-panel";

export async function RecentStreams() {
  const cookie = await cookies();
  const userCookie = cookie.get("user_information");
  const user = await safeParseCookie<{ address: string }>(userCookie?.value);
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
    <div className="sticky top-0 h-auto w-full px-4 pb-10 xl:h-screen xl:max-w-[25%] xl:flex-[0_0_25%] xl:overflow-y-scroll xl:py-20">
      <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
        {response.data.result.length === 0 && (
          <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center p-4">
            No recent NFTs
          </div>
        )}
        <RecentPanel streams={response.data.result} />
      </div>
    </div>
  );
}
