import { cookies } from "next/headers";

import { Error } from "@/components/error";
import { ErrorBoundary } from "@/components/error-boundry";

import BroadcastStream from "./components/broadcast-stream";
import { LiveChat, LiveStreamTabs } from "./components/live-chat";

type Props = {
  params: { streamId: string };
};

export default async function Page(props: Props) {
  const { streamId } = props.params;
  const cookie = cookies();
  const userCookie = cookie.get("user_information");

  return (
    <div className="container mx-auto h-auto min-h-screen w-full flex-col items-start justify-start xl:flex xl:flex-row xl:justify-between">
      <ErrorBoundary FallbackComponent={Error}>
        <BroadcastStream streamId={streamId} />
      </ErrorBoundary>

      <div className="flex w-full flex-[0_0_calc((400/16)*1rem)] flex-col gap-3 pt-6">
        <LiveStreamTabs />
        <ErrorBoundary FallbackComponent={Error}>
          <LiveChat streamId={streamId} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
