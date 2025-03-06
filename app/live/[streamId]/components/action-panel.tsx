"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { ThumbsUp } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Share } from "@/app/stream/[id]/components/share";
import { LikeButton } from "@/app/stream/[id]/components/stream-actions";
import TipModal from "@/app/stream/[id]/components/tip-modal";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { formatToUsDate } from "@/libs/date-time";
import { cn } from "@/libs/utils";

import { likeLiveStream } from "@/services/broadcast/broadcast.service";

import { getSignInfo } from "@/web3/utils/web3-actions";

import { StreamStatus } from "@/configs";

import { LivestreamEvents } from "../enums/livestream.enum";
import { GiftModal } from "./gift-modal";

export default function BroadcastActionPanel(props: { stream: any }) {
  const { stream: propStream } = props;
  const [stream, setStream] = useState<any>(propStream);
  const { socket } = useWebSockets();
  const { theme } = useTheme();
  const { account, chainId, library, user } = useUser();

  const likeStream = async () => {
    if (!socket || !account || !stream) throw new Error("WebSocket is not connected.");
    try {
      const signData = await getSignInfo(library, account);
      const response = await likeLiveStream(stream._id, {
        streamId: stream._id,
        address: account.toLowerCase(),
        sig: signData.sig,
        timestamp: signData.timestamp
      });
      if (!response.success) {
        // @ts-expect-error
        toast.error(response.error || response.message);
        return;
      }

      // @ts-expect-error
      if (response.success && response.error) {
        // @ts-expect-error
        toast.error(response.error || response.message);
        return;
      }
      toast.success("Liked stream");
    } catch (e: any) {
      toast.error(e.message || "Failed to like stream");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleStreamLike = (data: any) => {
      // if (streamId === stream._id)
      setStream((prev: any) => ({ ...prev, likes: data?.likes }));
    };

    const handleViewUpdate = ({ viewerCount }: any) => {
      const payload: any = { totalViews: viewerCount };
      if (viewerCount > stream.peakViewers) payload.peakViewers = viewerCount;
      setStream((prev: any) => ({ ...prev, ...payload }));
    };

    const handleStreamStart = (data: any) => {
      setStream((prev: any) => ({ ...prev, status: StreamStatus.LIVE }));
    };

    const handleStreamEnd = (data: any) => {
      setStream((prev: any) => ({ ...prev, status: StreamStatus.ENDED }));
    };

    socket.on(LivestreamEvents.LikeStream, handleStreamLike);
    socket.on(LivestreamEvents.ViewCountUpdate, handleViewUpdate);
    socket.on(LivestreamEvents.StartStream, handleStreamStart);
    socket.on(LivestreamEvents.EndStream, handleStreamEnd);

    return () => {
      socket.off(LivestreamEvents.LikeStream, handleStreamLike);
      socket.off(LivestreamEvents.ViewCountUpdate, handleViewUpdate);
      socket.off(LivestreamEvents.StartStream, handleStreamStart);
      socket.off(LivestreamEvents.EndStream, handleStreamEnd);
    };
  }, [socket, stream]);

  return (
    <div className="mb-4 mt-8 flex flex-col items-start justify-start gap-4">
      <h1 className="w-full break-words text-2xl font-medium text-theme-neutrals-200">
        {stream.title}
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-theme-neutrals-400">Broadcast by:</span>
          <Link
            href={`/${stream.account?.username || stream.address}`}
            className="font-bold text-theme-neutrals-200"
          >
            {stream.account?.username || stream.account.displayName}
          </Link>
        </div>

        {stream.status === StreamStatus.SCHEDULED && (
          <div className="flex items-center gap-1">
            <span className="text-theme-neutrals-400">Schedual at:</span>
            <span className="text-theme-neutrals-200">{formatToUsDate(stream.scheduledFor)}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <span className="text-theme-neutrals-400">Peak Views:</span>
          <span className="text-theme-neutrals-200">{stream.peakViewers || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-theme-neutrals-400">Total Tips:</span>
          <span className="text-theme-neutrals-200">{stream.totalTips || 0} DHB</span>
        </div>

        {stream.status === StreamStatus.LIVE && (
          <div className="flex items-center gap-1">
            <span className="text-theme-neutrals-400">Viewers:</span>
            <span className="text-theme-neutrals-200">{stream.totalViews || 0}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex h-auto w-full flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="relative flex w-full flex-wrap items-center gap-4 pr-20 sm:size-auto sm:pr-0">
          <Button onClick={likeStream} className={cn("gap-2 rounded-full")}>
            <ThumbsUp className="size-5" />
            {stream.likes || 0}
          </Button>
          <GiftModal tokenId={0} to={stream.address} stream={stream} />
        </div>

        <div className="flex size-auto items-center justify-start gap-5">
          <div className="hidden size-auto sm:block">
            <Share />
          </div>
        </div>
      </div>
    </div>
  );
}
