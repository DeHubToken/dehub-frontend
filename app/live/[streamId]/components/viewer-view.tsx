"use client";

import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { ClipIcon, EnterFullscreenIcon, ExitFullscreenIcon, LoadingIcon, MuteIcon, PauseIcon, PictureInPictureIcon, PlayIcon, SettingsIcon, UnmuteIcon } from "@livepeer/react/assets";
import * as Player from "@livepeer/react/player";
import Hls from "hls.js";

import { StreamVideoSkeleton } from "@/app/stream/[id]/components/stream-video-provider";

import { Button } from "@/components/ui/button";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { getPlaybackSource } from "@/services/broadcast/get-playback";

import { env, StreamStatus } from "@/configs";

import { LivestreamEvents } from "../enums/livestream.enum";
import StatusBadge from "./status-badge";
import { ClipPayload } from "livepeer/models/components";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as RadixPopover from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { cn } from "@/libs/utils";

export default function ViewerView({ stream }: { stream: any }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [src, setSrc] = useState<any>(null);
  const { account, chainId, library, user } = useUser();
  const { socket } = useWebSockets();
  const [hasJoined, setHasJoined] = useState(true);

  useEffect(() => {
    const fetchSrc = async () => {
      const url = await getPlaybackSource(stream.playbackId);
      setSrc(url);
    };

    fetchSrc();
  }, [stream]);

  // const joinNow = async () => {
  //   if (!socket || hasJoined) return;

  //   if (stream.status !== StreamStatus.LIVE) {
  //     alert("The stream has not started yet.");
  //     return;
  //   }
  //   console.log("Joining");
  //   setHasJoined(true);
  //   socket.emit(LivestreamEvents.JoinStream, { streamId: stream._id });
  // };

  // useEffect(() => {
  //   if (!socket) return;

  //   const handleStreamEnd = () => {
  //     alert("The stream has ended.");
  //     setHasJoined(false);
  //   };

  //   socket.on(LivestreamEvents.EndStream, handleStreamEnd);

  //   return () => {
  //     socket.off(LivestreamEvents.EndStream, handleStreamEnd);
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   if (!socket || !stream._id) return;

  //   socket.emit(LivestreamEvents.JoinRoom, { streamId: stream._id });
  // }, [socket, stream._id]);

  return (
    <div
      className="relative h-auto w-full overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: "16/9" }}
    >
      <Player.Root src={src}>
        <Player.Container>
          <Player.Video title={stream.title} />

          <Player.LoadingIndicator className="relative h-full w-full bg-black/50 backdrop-blur data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingIcon className="h-8 w-8 animate-spin" />
            </div>
            <PlayerLoading />
          </Player.LoadingIndicator>

          <Player.ErrorIndicator
            matcher="all"
            className="absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingIcon className="h-8 w-8 animate-spin" />
            </div>
            <PlayerLoading />
          </Player.ErrorIndicator>

          <Player.ErrorIndicator
            matcher="offline"
            className="absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000 animate-in fade-in-0 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <div className="text-lg font-bold sm:text-2xl">Stream is offline</div>
                <div className="text-xs text-gray-100 sm:text-sm">
                  Playback will start automatically once the stream has started
                </div>
              </div>
              <LoadingIcon className="mx-auto h-6 w-6 animate-spin md:h-8 md:w-8" />
            </div>
          </Player.ErrorIndicator>

          <Player.ErrorIndicator
            matcher="access-control"
            className="absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-black/40 text-center backdrop-blur-lg duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <div className="text-lg font-bold sm:text-2xl">Stream is private</div>
                <div className="text-xs text-gray-100 sm:text-sm">
                  It looks like you don't have permission to view this content
                </div>
              </div>
              <LoadingIcon className="mx-auto h-6 w-6 animate-spin md:h-8 md:w-8" />
            </div>
          </Player.ErrorIndicator>

          <Player.Controls className="flex flex-col-reverse gap-1 bg-gradient-to-b from-black/5 via-black/30 via-80% to-black/60 px-3 py-2 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 md:px-3">
            <div className="flex justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <Player.PlayPauseTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                  <Player.PlayingIndicator asChild matcher={false}>
                    <PlayIcon className="h-full w-full" />
                  </Player.PlayingIndicator>
                  <Player.PlayingIndicator asChild>
                    <PauseIcon className="h-full w-full" />
                  </Player.PlayingIndicator>
                </Player.PlayPauseTrigger>

                <Player.LiveIndicator className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  <span className="select-none text-sm">LIVE</span>
                </Player.LiveIndicator>
                <Player.LiveIndicator matcher={false} className="flex items-center gap-2">
                  <Player.Time className="select-none text-sm tabular-nums" />
                </Player.LiveIndicator>

                <Player.MuteTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                  <Player.VolumeIndicator asChild matcher={false}>
                    <MuteIcon className="h-full w-full" />
                  </Player.VolumeIndicator>
                  <Player.VolumeIndicator asChild matcher={true}>
                    <UnmuteIcon className="h-full w-full" />
                  </Player.VolumeIndicator>
                </Player.MuteTrigger>
                <Player.Volume className="group relative mr-1 flex h-5 max-w-[120px] flex-1 cursor-pointer touch-none select-none items-center">
                  <Player.Track className="relative h-[2px] grow rounded-full bg-white/30 transition group-hover:h-[3px] md:h-[3px] group-hover:md:h-[4px]">
                    <Player.Range className="absolute h-full rounded-full bg-white" />
                  </Player.Track>
                  <Player.Thumb className="block h-3 w-3 rounded-full bg-white transition group-hover:scale-110" />
                </Player.Volume>
              </div>
              <div className="flex items-center justify-end gap-2.5 sm:flex-1 md:flex-[1.5]">
                <Player.FullscreenIndicator matcher={false} asChild>
                  <Settings className="h-6 w-6 flex-shrink-0 transition" />
                </Player.FullscreenIndicator>
                {/* <Clip className="flex h-6 w-6 items-center justify-center" /> */}

                <Player.PictureInPictureTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                  <PictureInPictureIcon className="h-full w-full" />
                </Player.PictureInPictureTrigger>

                <Player.FullscreenTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                  <Player.FullscreenIndicator asChild>
                    <ExitFullscreenIcon className="h-full w-full" />
                  </Player.FullscreenIndicator>

                  <Player.FullscreenIndicator matcher={false} asChild>
                    <EnterFullscreenIcon className="h-full w-full" />
                  </Player.FullscreenIndicator>
                </Player.FullscreenTrigger>
              </div>
            </div>
            <Player.Seek className="group relative flex h-5 w-full cursor-pointer touch-none select-none items-center">
              <Player.Track className="relative h-[2px] grow rounded-full bg-white/30 transition group-hover:h-[3px] md:h-[3px] group-hover:md:h-[4px]">
                <Player.SeekBuffer className="absolute h-full rounded-full bg-black/30 transition duration-1000" />
                <Player.Range className="absolute h-full rounded-full bg-white" />
              </Player.Track>
              <Player.Thumb className="block h-3 w-3 rounded-full bg-white transition group-hover:scale-110" />
            </Player.Seek>
          </Player.Controls>
        </Player.Container>
      </Player.Root>
    </div>
  );
}


export const PlayerLoading = ({
  title,
  description,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => (
  <div className="relative w-full px-3 py-2 gap-3 flex-col-reverse flex aspect-video bg-white/10 overflow-hidden rounded-sm">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-16 h-6 md:w-20 md:h-7 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
        <div className="w-6 h-6 animate-pulse bg-white/5 overflow-hidden rounded-lg" />
      </div>
    </div>
    <div className="w-full h-2 animate-pulse bg-white/5 overflow-hidden rounded-lg" />

    {title && (
      <div className="absolute flex flex-col gap-1 inset-10 text-center justify-center items-center">
        <span className="text-white text-lg font-medium">{title}</span>
        {description && (
          <span className="text-sm text-white/80">{description}</span>
        )}
      </div>
    )}
  </div>
);

// function Clip({ className }: { className?: string }) {
//   const [isPending, startTransition] = useTransition();

//   const createClipComposed = useCallback((opts: ClipPayload) => {
//     startTransition(async () => {
//       const result = await createClip(opts);

//       if (result.success) {
//         toast.success(
//           <span>
//             {
//               "You have created a new clip - in a few minutes, you will be able to view it at "
//             }
//             <a
//               href={`/?v=${result.playbackId}`}
//               target="_blank"
//               rel="noreferrer"
//               className="font-semibold"
//             >
//               this link
//             </a>
//             {"."}
//           </span>
//         );
//       } else {
//         toast.error(
//           "Failed to create a clip. Please try again in a few seconds."
//         );
//       }
//     });
//   }, []);

//   return (
//     <Player.LiveIndicator className={className} asChild>
//       <Player.ClipTrigger
//         onClip={createClipComposed}
//         disabled={isPending}
//         className="hover:scale-110 transition flex-shrink-0"
//       >
//         {isPending ? (
//           <LoadingIcon className="h-full w-full animate-spin" />
//         ) : (
//           <ClipIcon className="w-full h-full" />
//         )}
//       </Player.ClipTrigger>
//     </Player.LiveIndicator>
//   );
// }

const Settings = React.forwardRef(
  (
    { className }: { className?: string },
    ref: React.Ref<HTMLButtonElement> | undefined
  ) => {
    return (
      <Popover>
        <PopoverTrigger ref={ref} asChild>
          <button
            type="button"
            className={className}
            aria-label="Playback settings"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsIcon />
          </button>
        </PopoverTrigger>
          <PopoverContent
            className="w-60 rounded-md bg-black/50 border border-white/50 backdrop-blur-md p-3 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            side="top"
            alignOffset={-70}
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              <p className="text-white/90 font-medium text-sm mb-1">Settings</p>
              <Player.LiveIndicator
                matcher={false}
                className="gap-2 flex-col flex"
              >
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="speedSelect"
                >
                  Playback speed
                </label>
                <Player.RateSelect name="speedSelect">
                  <Player.SelectTrigger
                    className="inline-flex items-center justify-between rounded-sm px-1 outline-1 outline-white/50 text-xs leading-none h-7 gap-1 outline-none"
                    aria-label="Playback speed"
                  >
                    <Player.SelectValue placeholder="Select a speed..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden bg-black rounded-sm">
                      <Player.SelectViewport className="p-1">
                        <Player.SelectGroup>
                          <RateSelectItem value={0.5}>0.5x</RateSelectItem>
                          <RateSelectItem value={0.75}>0.75x</RateSelectItem>
                          <RateSelectItem value={1}>1x (normal)</RateSelectItem>
                          <RateSelectItem value={1.25}>1.25x</RateSelectItem>
                          <RateSelectItem value={1.5}>1.5x</RateSelectItem>
                          <RateSelectItem value={1.75}>1.75x</RateSelectItem>
                          <RateSelectItem value={2}>2x</RateSelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.RateSelect>
              </Player.LiveIndicator>
              <div className="gap-2 flex-col flex">
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="qualitySelect"
                >
                  Quality
                </label>
                <Player.VideoQualitySelect
                  name="qualitySelect"
                  defaultValue="1.0"
                >
                  <Player.SelectTrigger
                    className="inline-flex items-center justify-between rounded-sm px-1 outline-1 outline-white/50 text-xs leading-none h-7 gap-1 outline-none"
                    aria-label="Playback quality"
                  >
                    <Player.SelectValue placeholder="Select a quality..." />
                    <Player.SelectIcon>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Player.SelectIcon>
                  </Player.SelectTrigger>
                  <Player.SelectPortal>
                    <Player.SelectContent className="overflow-hidden bg-black rounded-sm">
                      <Player.SelectViewport className="p-[5px]">
                        <Player.SelectGroup>
                          <VideoQualitySelectItem value="auto">
                            Auto (HD+)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="1080p">
                            1080p (HD)
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="720p">
                            720p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="480p">
                            480p
                          </VideoQualitySelectItem>
                          <VideoQualitySelectItem value="360p">
                            360p
                          </VideoQualitySelectItem>
                        </Player.SelectGroup>
                      </Player.SelectViewport>
                    </Player.SelectContent>
                  </Player.SelectPortal>
                </Player.VideoQualitySelect>
              </div>
            </div>
            <RadixPopover.Close
              className="rounded-full h-5 w-5 inline-flex items-center justify-center absolute top-2.5 right-2.5 outline-none"
              aria-label="Close"
            >
              <XIcon />
            </RadixPopover.Close>
            <RadixPopover.Arrow className="fill-white/50" />
          </PopoverContent>
      </Popover>
    );
  }
);

const RateSelectItem = React.forwardRef<
  HTMLDivElement,
  Player.RateSelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Player.RateSelectItem
      className={cn(
        "text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Player.SelectItemIndicator>
    </Player.RateSelectItem>
  );
});

const VideoQualitySelectItem = React.forwardRef<
  HTMLDivElement,
  Player.VideoQualitySelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Player.VideoQualitySelectItem
      className={cn(
        "text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Player.SelectItemText>{children}</Player.SelectItemText>
      <Player.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Player.SelectItemIndicator>
    </Player.VideoQualitySelectItem>
  );
});