"use client";

import { Suspense, useEffect, useState } from "react";
// import { cookies } from "next/headers";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// import { safeParseCookie } from "@/libs/cookies";
import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { checkIfBroadcastOwner, getLiveStream } from "@/services/broadcast/broadcast.service";

import { env, StreamStatus } from "@/configs";

import { LivestreamEvents } from "../enums/livestream.enum";
import BroadcastActionPanel from "./action-panel";
import PreviousStreams from "./previous-streams";
import StatusBadge from "./status-badge";
import BroadcastStreamInfo from "./stream-info";
import StreamerView from "./streamer-view";
import ViewerView from "./viewer-view";
import ReplayPlayer from "./live-replay";

export default function BroadcastStream(props: { streamId: string }) {
  const { streamId } = props;
  const [stream, setStream] = useState<any>(null);
  const [isStartingNw, setIsStartingNw] = useState<any>(false);
  const [isBroadcastOwner, setIsBroadcastOwner] = useState(false);
  const { socket } = useWebSockets();
  const { account } = useUser();

  // const cookie = cookies();
  // const userCookie = cookie.get("user_information");
  // const user = safeParseCookie<{ address: string }>(userCookie?.value);

  useEffect(() => {
    const fetchStream = async () => {
      const response = await getLiveStream(streamId);
      if (response.success) {
        setStream(response.data);
        const isOwner = await checkIfBroadcastOwner(account?.toLowerCase(), response.data);
        setIsBroadcastOwner(isOwner);
      } else {
        setStream(response.error);
      }
    };

    fetchStream();
  }, [streamId, account]);

  useEffect(() => {
    if (!socket) return;

    const handleStreamStart = (data: any) => {
      console.log("Receibed start stream", data);
      if (data.streamId === streamId) {
        setStream((prev: any) => ({ ...prev, status: StreamStatus.LIVE }));
      }
    };

    const handleStreamEnd = (data: any) => {
      console.log("Receibed end stream", data);
      if (data.streamId === streamId) {
        setStream((prev: any) => ({ ...prev, status: StreamStatus.ENDED }));
      }
    };

    socket.on(LivestreamEvents.StartStream, handleStreamStart);
    socket.on(LivestreamEvents.EndStream, handleStreamEnd);

    return () => {
      socket.off(LivestreamEvents.StartStream, handleStreamStart);
      socket.off(LivestreamEvents.EndStream, handleStreamEnd);
    };
  }, [socket, streamId]);


  if (!stream) {
    return (
      <div className="absolute left-0 top-0 flex size-full h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-tanker text-3xl sm:text-6xl">Loading stream...</h1>
      </div>
    );
  }

  if (stream.error) {
    return (
      <div className="absolute left-0 top-0 flex size-full h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-tanker text-3xl sm:text-6xl">{stream.error}</h1>
        <Button asChild variant="gradientOne" className="px-6">
          <Link href="/">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-auto min-h-screen w-full px-4 xl:max-w-[75%] xl:flex-[0_0_75%]">
      <Suspense fallback={<div>Loading Stream...</div>}>
        {stream.status === StreamStatus.SCHEDULED && !isStartingNw && (
          <div
            className="relative w-full overflow-hidden rounded-2xl bg-black"
            style={{ aspectRatio: "16/9" }}
          >
            <StatusBadge status={stream.status} />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <img
              src={`${env.NEXT_PUBLIC_CDN_BASE_URL}${stream.thumbnail}`}
              alt="Stream Thumbnail"
              className="h-auto w-full object-cover"
            />
            <div className="absolute bottom-4 flex w-full justify-between px-4">
              {isBroadcastOwner && (
                <Button
                  onClick={() => {
                    setIsStartingNw(true);
                  }}
                  variant="gradientOne"
                  className="px-6"
                >
                  Go Live Now
                </Button>
              )}
            </div>
          </div>
        )}

        {/* {(stream.status === StreamStatus.LIVE || isStartingNw) && stream.status !== StreamStatus.ENDED && (
          <> */}
            {isBroadcastOwner ? (
              <StreamerView stream={stream} isBroadcastOwner={isBroadcastOwner} />
            ) : (
              <ViewerView stream={stream} />
            )}
          {/* </>
        )} */}

        {stream.status === StreamStatus.ENDED && <ReplayPlayer streamId={streamId} />}
      </Suspense>

      <BroadcastActionPanel stream={stream} />
      <BroadcastStreamInfo stream={stream} />
      <PreviousStreams stream={stream} />
    </div>
  );
}
