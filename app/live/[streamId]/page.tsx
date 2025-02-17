import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Error } from "@/components/error";
import { ErrorBoundary } from "@/components/error-boundry";
import { ErrorBanner, Error as ErrorServer } from "@/components/error.server";
import { Button } from "@/components/ui/button";

import { safeParseCookie } from "@/libs/cookies";

import { checkIfBroadcastOwner, getLiveStream } from "@/services/broadcast/broadcast.service";

import BroadcastChatPanel from "./components/broadcast-chat";
import BroadcastStream from "./components/broadcast-stream";

type Props = {
  params: { streamId: string };
};

export default async function Page(props: Props) {
  const { streamId } = props.params;
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  // if (!user)
  //   return (
  //     <div className="px-4 py-28">
  //       <ErrorServer error="Not connected" title="Sign in to view stream" />
  //     </div>
  //   );

  return (
    <ErrorBoundary FallbackComponent={Error}>
      <Suspense fallback={<div>Loading...</div>}>
        <main className="relative h-auto w-full px-4 py-28">
          <div className="block p-5 text-center text-xl text-red-600 xl:hidden">
            This page is only available on large screens. Please switch to a larger device.
          </div>

          <div className="hidden xl:block">
            <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start xl:flex-row xl:justify-between">
              <div className="flex-1 overflow-y-auto">
                <BroadcastStream streamId={streamId} />
              </div>

              <div className="xl:fixed xl:right-2 xl:top-28 xl:w-[20%]"  
              style={{ aspectRatio: "9/16" }}
              >
                <BroadcastChatPanel streamId={streamId} />
              </div>
            </div>
          </div>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}
