"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function BroadcastActionPanel(props: { stream: any }) {
  const { stream: propStream } = props;
  const [stream, setStream] = useState<any>(propStream);
  const { socket } = useWebSockets();
  const { theme } = useTheme();
  const { account, chainId, library, user } = useUser();

  const likeStream = async () => {
    if (!socket || !account) throw new Error("WebSocket is not connected.");
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

    const handleStreamLike = ({ streamId }: any) => {
      if (streamId === stream._id) setStream((prev: any) => ({ ...prev, likes: stream.likes++ }));
    };

    const handleViewUpdate = ({ viewerCount }: any) => {
      const payload: any = { totalViews: viewerCount };
      if (viewerCount > stream.peakViewers) payload.peakViewers = viewerCount;
      setStream((prev: any) => ({ ...prev, ...payload }));
    };

    socket.on(LivestreamEvents.LikeStream, handleStreamLike);
    socket.on(LivestreamEvents.ViewCountUpdate, handleViewUpdate);

    return () => {
      socket.off(LivestreamEvents.LikeStream, handleStreamLike);
      socket.off(LivestreamEvents.ViewCountUpdate, handleViewUpdate);
    };
  }, [socket]);

  return (
    <div className="mt-3 h-auto w-full">
      <p className="flex text-sm">
        Broadcast by
        <Link
          href={`/${stream.account?.username || stream.address}`}
          className="ml-2 flex items-center gap-2 text-classic-purple"
        >
          <span>{stream.account?.username || stream.account.displayName}</span>
        </Link>
      </p>
      <div className="mt-3 flex h-auto w-full flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="relative flex w-full flex-wrap items-center gap-4 pr-20 sm:size-auto sm:pr-0">
          <Button
            onClick={likeStream}
            className={cn("gap-2 rounded-full")}
            // disabled={status === "loading"}
          >
            <ThumbsUp className="size-5" />
            {stream.likes || 0}
          </Button>
          <TipModal tokenId={0} to={stream.address} />
          <div className="absolute right-0 top-0 size-auto sm:hidden">
            <Share />
          </div>
        </div>

        <div className="flex size-auto items-center justify-start gap-5">
          {stream.status === StreamStatus.LIVE ||
            (stream.status === StreamStatus.ENDED && (
              <>
                <p className="text-sm">
                  <span className="font-semibold">Viewers :</span> {stream.totalViews || 0}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Peak Views :</span> {stream.peakViewers || 0}
                </p>
              </>
            ))}
          {stream.status === StreamStatus.SCHEDULED && (
            <p className="text-sm">
              <span className="font-semibold">Scheduled for :</span>{" "}
              {formatToUsDate(stream.scheduledFor)}
            </p>
          )}

          <div className="hidden size-auto sm:block">
            <Share />
          </div>
        </div>
      </div>
    </div>
  );
}
