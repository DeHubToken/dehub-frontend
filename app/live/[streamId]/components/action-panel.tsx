"use client"
import Link from "next/link";
import { ThumbsUp } from "lucide-react";
import { useTheme } from "next-themes";

import { Share } from "@/app/stream/[id]/components/share";
import { LikeButton } from "@/app/stream/[id]/components/stream-actions";
import TipModal from "@/app/stream/[id]/components/tip-modal";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useWebSockets } from "@/contexts/websocket";

import { formatToUsDate } from "@/libs/date-time";
import { cn } from "@/libs/utils";

import { StreamStatus } from "@/configs";

export default function BroadcastActionPanel(props: { stream: any }) {
  const { stream } = props;
  const { isUserOnline } = useWebSockets();
  const { theme } = useTheme();
  console.log(stream)

  return (
    <div className="mt-3 h-auto w-full">
      <p className="flex text-sm">
        Broadcast by
        <Link
          href={`/${stream.account.username || stream.address}`}
          className="ml-2 flex items-center gap-2 text-classic-purple"
        >
          <span>{stream.account.username || stream.account.displayName}</span>
        </Link>
      </p>
      <div className="mt-3 flex h-auto w-full flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="relative flex w-full flex-wrap items-center gap-4 pr-20 sm:size-auto sm:pr-0">
          <Button
            onClick={() => {}}
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
              <p className="text-sm">
                <span className="font-semibold">Viewers :</span> {stream.totalViews || 0}
              </p>
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
