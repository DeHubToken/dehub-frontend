import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ErrorBoundary } from "@/components/error-boundry";
import { Error as ErrorServer, ErrorBanner } from "@/components/error.server";
import { Button } from "@/components/ui/button";

import { safeParseCookie } from "@/libs/cookies";

import { checkIfBroadcastOwner, getLiveStream } from "@/services/broadcast/broadcast.service";
import { BroadcastStream } from "./components/broadcast-stream";
import { Error } from "@/components/error";
import BroadcastChatPanel from "./components/broadcast-chat";

type Props = {
  params: { streamId: string };
};

export default async function Page(props: Props) {
  const { streamId } = props.params;
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  if (!user) return (<div className="py-28 px-4"><ErrorServer error="Not connected" title="Sign in to view stream" /></div>)

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="relative h-auto w-full py-28 px-4">
          <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start xl:flex-row xl:justify-between">
          <BroadcastStream streamId={streamId} />
          <BroadcastChatPanel streamId={streamId} />
          </div>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}
