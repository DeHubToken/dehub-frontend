"use client";

import { Suspense, useEffect, useState } from "react";
// import { cookies } from "next/headers";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

import { PPVModal } from "@/app/stream/[id]/components/ppv-modal";

import { ConnectButton } from "@/components/navbar";
import { Button } from "@/components/ui/button";

// import { safeParseCookie } from "@/libs/cookies";
import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { api } from "@/libs/api";

import {
  checkIfBroadcastOwner,
  getLiveStream,
  getStreamKey
} from "@/services/broadcast/broadcast.service";

import { getStreamStatus } from "@/web3/utils/validators";
import { getAuthParams, getSignInfo } from "@/web3/utils/web3-actions";

import { userAtom } from "@/stores";

import { env, streamInfoKeys, StreamStatus } from "@/configs";

import { LivestreamEvents } from "../enums/livestream.enum";
import BroadcastActionPanel from "./action-panel";
import ReplayPlayer from "./live-replay";
import PreviousStreams from "./previous-streams";
import StatusBadge from "./status-badge";
import BroadcastStreamInfo from "./stream-info";
import StreamerView from "./streamer-view";
import ViewerView from "./viewer-view";

const ErrorComponent = ({ children, stream }: any) => {
  return (
    <div className="h-auto w-full flex-1 p-6">
      <>
        <div
          className="relative w-full overflow-hidden rounded-2xl border border-dashed border-gray-900 bg-black bg-opacity-50"
          style={{ aspectRatio: "16/9" }}
        >
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xl font-medium text-white"> */}
          <div className="h-full w-full">{children}</div>
        </div>
        <BroadcastActionPanel stream={stream} />
        <BroadcastStreamInfo stream={stream} />
        <PreviousStreams stream={stream} />
      </>
    </div>
  );
};

export default function BroadcastStream(props: { streamId: string }) {
  const { streamId } = props;
  const [stream, setStream] = useState<any>(null);
  const [isStartingNw, setIsStartingNw] = useState<any>(false);
  const [hasJoined, setHasJoined] = useState<any>(false);
  const [isBroadcastOwner, setIsBroadcastOwner] = useState(false);
  const [isPendingWebhook, setIsPendingWebhook] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useWebSockets();
  const { account } = useUser();

  const [isFreeStream, setIsFreeStream] = useState(false);
  const [extraDetails, setExtraDetails] = useState<any>();

  const user = useAtomValue(userAtom);
  const { library, chainId } = useActiveWeb3React();

  const joinStream = async () => {
    if (!account) return toast.error("Connect your wallet!");
    if (!socket || hasJoined || !stream?._id) return;

    if (stream.status !== StreamStatus.LIVE) {
      alert("The stream has not started yet.");
      return;
    }
    socket.emit(LivestreamEvents.JoinStream, { streamId: stream._id });
    setHasJoined(true);
    await recordView();
  };

  useEffect(() => {
    const fetchStream = async () => {
      setIsLoading(true);
      const response = await getLiveStream(streamId);
      if (response.success) {
        setStream(response.data);
        const isOwner: any = await checkIfBroadcastOwner(account?.toLowerCase(), response.data);
        setIsBroadcastOwner(isOwner);

        setIsLoading(false);
        if (isOwner && library && account) {
          const authParams = await getAuthParams(library, account);
          const keyResponse = await getStreamKey(streamId, authParams);
          if (keyResponse.success) {
            setStream((prev: any) => ({
              ...prev,
              streamKey: keyResponse.data.streamKey
            }));
          }
        }
      } else {
        setStream({ error: response.error });
      }
    };

    fetchStream();
  }, [streamId, account]);

  useEffect(() => {
    const fetchStreamStatus = async () => {
      if (!stream) return;
      const isFree =
        !stream?.streamInfo ||
        (!stream?.streamInfo?.[streamInfoKeys?.isLockContent] &&
          !stream?.streamInfo?.[streamInfoKeys?.isPayPerView]) ||
        isBroadcastOwner
          ? true
          : false;
      const status = getStreamStatus(stream, user, chainId);
      setIsFreeStream(isFree);
      setExtraDetails(status);
    };
    fetchStreamStatus();
  }, [stream, account, user]);

  useEffect(() => {
    if (!socket || !stream || !account) return;

    const handleStreamStart = (data: any) => {
      // console.log("Stream started", data);
      setStream((prev: any) => ({ ...prev, status: StreamStatus.LIVE }));
      setIsPendingWebhook(false);
    };

    const handleTip = (data: any) => {
      const { gift } = data;

      setStream((prev: any) => ({
        ...prev,
        totalTips: (prev.totalTips || 0) + Number(gift.meta.amount)
      }));
    };

    const handleStreamEnd = (data: any) => {
      // console.log("Stream started", data);
      setStream((prev: any) => ({ ...prev, status: StreamStatus.ENDED }));
      setIsPendingWebhook(false);
    };

    const handleViewUpdate = ({ viewerCount }: any) => {
      const payload: any = { totalViews: viewerCount };
      if (viewerCount > stream.peakViewers) payload.peakViewers = viewerCount;
      setStream((prev: any) => ({ ...prev, ...payload }));
    };

    socket.on(LivestreamEvents.StartStream, handleStreamStart);
    socket.on(LivestreamEvents.EndStream, handleStreamEnd);
    socket.on(LivestreamEvents.ViewCountUpdate, handleViewUpdate);
    socket.on(LivestreamEvents.TipStreamer, handleTip);

    return () => {
      socket.off(LivestreamEvents.StartStream, handleStreamStart);
      socket.off(LivestreamEvents.EndStream, handleStreamEnd);
      socket.off(LivestreamEvents.ViewCountUpdate, handleViewUpdate);
      socket.off(LivestreamEvents.TipStreamer, handleTip);
    };
  }, [socket, streamId, stream, account]);

  useEffect(() => {
    if (!socket || !stream?._id || !account) return;
    socket.emit(LivestreamEvents.JoinRoom, { streamId: stream?._id });
    return () => {};
  }, [socket, stream, account]);

  async function recordView() {
    if (!account || !stream?.tokenId) return;

    const result = await getSignInfo(library, account);
    api(
      `/record-view/${stream.tokenId}?sig=${result.sig.trim()}&timestamp=${result.timestamp}&address=${account}`
    );
  }

  const handleGoLive = () => {
    setIsPendingWebhook(true);
    setIsStartingNw(true);
  };

  if (isLoading) return <div className="h-auto min-h-screen w-full flex-1 p-6">Loading...</div>;

  if (!stream && !isLoading) {
    return (
      <div className="h-auto min-h-screen w-full flex-1 p-6">
        <p>No stream found</p>
      </div>
    );
  }

  if (stream.error) {
    return (
      <div className="grid h-auto min-h-screen w-full flex-1 place-items-center p-6">
        <div className="flex flex-col gap-2">
          <p className="font-tanker">{stream.error}</p>
          <Button asChild variant="gradientOne" className="px-6">
            <Link href="/">Go Back</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <ErrorComponent stream={stream}>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <p>Connect wallet to view stream</p>
          <ConnectButton label="Connect Wallet" />
        </div>
      </ErrorComponent>
    );
  }

  if (!isFreeStream) {
    return (
      <ErrorComponent stream={stream}>
        <div className="flex h-full flex-col items-center justify-center gap-2">
          {extraDetails?.streamStatus?.isLockedWithLockContent && (
            <p>
              {`Please hold at least ${stream?.streamInfo?.[streamInfoKeys?.lockContentAmount]} ${stream?.streamInfo?.[streamInfoKeys?.lockContentTokenSymbol] || "DHB"} to unlock.`}
            </p>
          )}
          {extraDetails?.streamStatus?.isLockedWithPPV && (
            <>
              <p>
                {`Unlock PPV stream with ${stream?.streamInfo?.[streamInfoKeys?.payPerViewAmount]} ${stream?.streamInfo?.[streamInfoKeys?.payPerViewTokenSymbol]}`}
              </p>
              <PPVModal nft={stream} />
            </>
          )}
        </div>
      </ErrorComponent>
    );
  }

  return (
    <div className="h-auto w-full flex-1 p-6">
      {stream.status === StreamStatus.SCHEDULED && !isStartingNw && (
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-black"
          style={{ aspectRatio: "16/9" }}
        >
          <StatusBadge status={stream.status} />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <img
            src={`${env.NEXT_PUBLIC_CDN_BASE_URL}/${stream.thumbnail}`}
            alt="Stream Thumbnail"
            className="h-auto w-full object-cover"
          />
          <div className="absolute bottom-4 flex w-full justify-between px-4">
            {isBroadcastOwner && (
              <Button
                onClick={handleGoLive}
                variant="gradientOne"
                className="px-6"
                disabled={isPendingWebhook}
              >
                {isPendingWebhook ? "Starting..." : "Go Live Now"}
              </Button>
            )}
          </div>
        </div>
      )}

      {(stream.status === StreamStatus.LIVE ||
        stream.status === StreamStatus.OFFLINE ||
        isStartingNw) &&
        stream.status !== StreamStatus.ENDED && (
          <>
            {isBroadcastOwner ? (
              <StreamerView stream={stream} isBroadcastOwner={isBroadcastOwner} />
            ) : (
              <>
                {hasJoined ? (
                  <ViewerView stream={stream} />
                ) : (
                  <div
                    className="relative w-full overflow-hidden rounded-2xl bg-black"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <StatusBadge status={stream.status} />
                    <div className="absolute inset-0 bg-black bg-opacity-50" />
                    <img
                      src={`${env.NEXT_PUBLIC_CDN_BASE_URL}/${stream.thumbnail}`}
                      alt="Stream Thumbnail"
                      className="h-auto w-full object-cover"
                    />
                    <div className="absolute bottom-4 flex w-full justify-between px-4">
                      {stream.status !== StreamStatus.OFFLINE && (
                        <Button onClick={joinStream} variant="gradientOne" className="px-6">
                          Join Stream
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

      {stream.status === StreamStatus.ENDED && <ReplayPlayer streamId={streamId} />}

      <BroadcastActionPanel stream={stream} />
      <BroadcastStreamInfo stream={stream} />
      <PreviousStreams stream={stream} />
    </div>
  );
}
