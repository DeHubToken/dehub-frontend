import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { useUser } from "@/hooks/use-user";

import { safeParseCookie } from "@/libs/cookies";

import { checkIfBroadcastOwner, getLiveStream } from "@/services/broadcast/broadcast.service";
import StreamerView from "./streamer-view";
import ViewerView from "./viewer-view";
import BroadcastStreamInfo from "./stream-info";
import BroadcastActionPanel from "./action-panel";

export async function BroadcastStream(props: { streamId: string }) {
  const { streamId } = props;
  const response = await getLiveStream(streamId);
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);

  if (!response.success) {
    return (
      <div className="absolute left-0 top-0 flex size-full h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-tanker text-3xl sm:text-6xl">{response.error}</h1>
        <Button asChild variant="gradientOne" className="px-6">
          <Link href="/">Go Back</Link>
        </Button>
      </div>
    );
  }

  const isBroadcastOwner = await checkIfBroadcastOwner(user?.address, response.data);

  const stream = response.data;

  return (
    <div className="h-auto min-h-screen w-full px-4 xl:max-w-[75%] xl:flex-[0_0_75%]">
      <Suspense fallback={<div>Loading Stream...</div>}>
        {isBroadcastOwner
          ? <StreamerView stream={stream} />
          : <ViewerView stream={stream} />}
      </Suspense>
      <BroadcastActionPanel streamId={streamId} />
      <BroadcastStreamInfo stream={stream} />
    </div>
  );
}
