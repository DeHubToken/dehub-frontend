"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  DisableAudioIcon,
  DisableVideoIcon,
  EnableAudioIcon,
  EnableVideoIcon,
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  OfflineErrorIcon,
  PictureInPictureIcon,
  SettingsIcon,
  StartScreenshareIcon,
  StopIcon,
  StopScreenshareIcon
} from "@livepeer/react/assets";
import * as Broadcast from "@livepeer/react/broadcast";
import { CheckIcon } from "@radix-ui/react-icons";
import * as RadixPopover from "@radix-ui/react-popover";
import { ChevronDownIcon, XIcon } from "lucide-react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash
} from "react-icons/fa";
import { toast } from "sonner";

import { StreamVideoSkeleton } from "@/app/stream/[id]/components/stream-video-provider";

import { LazyImage } from "@/components/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { cn } from "@/libs/utils";

import { getIngestUrlByStreamKey } from "@/services/broadcast/get-ingest";


import { LivestreamEvents } from "../enums/livestream.enum";
import { getIngest } from "@livepeer/react/external";


export default function StreamerView(props: { stream: any; isBroadcastOwner: boolean }) {
  const { stream, isBroadcastOwner } = props;
  const [error, setError] = useState<string | null>(null);
  const [isWaitingForWebhook, setIsWaitingForWebhook] = useState(false);
  const [ingestUrl, setIngestUrl] = useState<string | null>(null);
  const { account, library } = useUser();
  const { socket } = useWebSockets();

  useEffect(() => {
    if (!socket) return;

    const handleStreamStart = () => {
      setIsWaitingForWebhook(false);
    };

    const handleStreamEnd = () => {
      setIsWaitingForWebhook(false);
    };

    socket.on(LivestreamEvents.StartStream, handleStreamStart);
    socket.on(LivestreamEvents.EndStream, handleStreamEnd);

    return () => {
      socket.off(LivestreamEvents.StartStream, handleStreamStart);
      socket.off(LivestreamEvents.EndStream, handleStreamEnd);
    };
  }, [socket, stream]);

  useEffect(() => {
    async function fetchIngestUrl() {
      if (stream?.streamKey) {
        const url = await getIngestUrlByStreamKey(stream.streamKey);
        setIngestUrl(url);
      }
    }

    // fetchIngestUrl();
  }, [stream?.streamKey]);

  // console.log(ingestUrl, "ingestUrl");
  if (error) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: "16/9" }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <span className="text-lg font-bold text-white">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: "16/9" }}
    >
      {!stream?.streamKey && isBroadcastOwner && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <LoadingIcon className="h-8 w-8 animate-spin" />
            <span className="text-sm">Loading stream...</span>
          </div>
        </div>
      )}
      {account && library && stream?.streamKey ? (
        <Broadcast.Root
          onError={(error) => {
            if (error?.type === "permissions") {
              toast.error("You must accept permissions to broadcast. Please try again.");
            } else {
              console.error("Broadcast error:", error);
            }
          }}
          ingestUrl={getIngest(stream.streamKey)}
          aspectRatio={16 / 9}
        >
          <Broadcast.Container className="h-full w-full bg-gray-950">
            <Broadcast.Video
              title={stream.title}
              autoPlay
              className="h-full w-full"
              style={{ aspectRatio: "16/9" }}
            />

            <Broadcast.Controls className="flex flex-col-reverse gap-1 bg-gradient-to-b from-black/20 via-black/30 via-80% to-black/60 px-3 py-1.5 duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0 md:px-3">
              <div className="flex justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <Broadcast.VideoEnabledTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                    <Broadcast.VideoEnabledIndicator asChild matcher={false}>
                      <DisableVideoIcon className="h-full w-full" />
                    </Broadcast.VideoEnabledIndicator>
                    <Broadcast.VideoEnabledIndicator asChild matcher={true}>
                      <EnableVideoIcon className="h-full w-full" />
                    </Broadcast.VideoEnabledIndicator>
                  </Broadcast.VideoEnabledTrigger>
                  <Broadcast.AudioEnabledTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                    <Broadcast.AudioEnabledIndicator asChild matcher={false}>
                      <DisableAudioIcon className="h-full w-full" />
                    </Broadcast.AudioEnabledIndicator>
                    <Broadcast.AudioEnabledIndicator asChild matcher={true}>
                      <EnableAudioIcon className="h-full w-full" />
                    </Broadcast.AudioEnabledIndicator>
                  </Broadcast.AudioEnabledTrigger>
                </div>
                <div className="flex items-center justify-end gap-2.5 sm:flex-1 md:flex-[1.5]">
                  <Broadcast.FullscreenIndicator matcher={false} asChild>
                    <Settings className="h-6 w-6 flex-shrink-0 transition" />
                  </Broadcast.FullscreenIndicator>

                  <Broadcast.ScreenshareTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                    <Broadcast.ScreenshareIndicator asChild>
                      <StopScreenshareIcon className="h-full w-full" />
                    </Broadcast.ScreenshareIndicator>

                    <Broadcast.ScreenshareIndicator matcher={false} asChild>
                      <StartScreenshareIcon className="h-full w-full" />
                    </Broadcast.ScreenshareIndicator>
                  </Broadcast.ScreenshareTrigger>

                  <Broadcast.PictureInPictureTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                    <PictureInPictureIcon className="h-full w-full" />
                  </Broadcast.PictureInPictureTrigger>

                  <Broadcast.FullscreenTrigger className="h-6 w-6 flex-shrink-0 transition hover:scale-110">
                    <Broadcast.FullscreenIndicator asChild>
                      <ExitFullscreenIcon className="h-full w-full" />
                    </Broadcast.FullscreenIndicator>

                    <Broadcast.FullscreenIndicator matcher={false} asChild>
                      <EnterFullscreenIcon className="h-full w-full" />
                    </Broadcast.FullscreenIndicator>
                  </Broadcast.FullscreenTrigger>
                </div>
              </div>
              <Broadcast.EnabledIndicator
                matcher={false}
                className="flex flex-1 items-center justify-center"
              >
                <Broadcast.EnabledTrigger
                  className="flex items-center justify-center gap-1 rounded-md bg-black/60 px-4 py-2 hover:bg-black/70"
                  onClick={() => setIsWaitingForWebhook(true)}
                >
                  <EnableVideoIcon className="h-7 w-7" />
                  <span className="text-sm">
                    {isWaitingForWebhook ? "Starting broadcast..." : "Start broadcast"}
                  </span>
                </Broadcast.EnabledTrigger>
              </Broadcast.EnabledIndicator>
              <Broadcast.EnabledIndicator asChild>
                <Broadcast.EnabledTrigger
                  className="absolute right-2 top-1 flex items-center justify-center gap-1 rounded-md bg-white/5 px-4 py-2 hover:bg-white/10"
                  onClick={() => setIsWaitingForWebhook(true)}
                >
                  <StopIcon className="h-7 w-7" />
                  <span className="text-sm">
                    {isWaitingForWebhook ? "Stopping broadcast..." : "Stop broadcast"}
                  </span>
                </Broadcast.EnabledTrigger>
              </Broadcast.EnabledIndicator>
            </Broadcast.Controls>
            {isWaitingForWebhook && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <LoadingIcon className="h-8 w-8 animate-spin" />
                  <span className="text-sm">Synchronizing broadcast state...</span>
                </div>
              </div>
            )}
            <Broadcast.LoadingIndicator className="relative h-full w-full">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <LoadingIcon className="h-8 w-8 animate-spin" />
              </div>
              <BroadcastLoading />
            </Broadcast.LoadingIndicator>

            <Broadcast.LoadingIndicator asChild matcher={false}>
              {/* <Broadcast.Time /> */}
              <div className="absolute left-1 top-1 flex items-center overflow-hidden rounded-full bg-black/50 px-2 py-1 backdrop-blur">
                <Broadcast.StatusIndicator matcher="live" className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  <span className="select-none text-xs">LIVE</span>
                </Broadcast.StatusIndicator>

                <Broadcast.StatusIndicator className="flex items-center gap-2" matcher="pending">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/80" />
                  <span className="select-none text-xs">LOADING</span>
                </Broadcast.StatusIndicator>

                <Broadcast.StatusIndicator className="flex items-center gap-2" matcher="idle">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/80" />
                  <span className="select-none text-xs">OFFLINE</span>
                </Broadcast.StatusIndicator>
              </div>
            </Broadcast.LoadingIndicator>
            <Broadcast.ErrorIndicator
              matcher="not-permissions"
              className="absolute inset-0 flex select-none flex-col items-center justify-center gap-4 bg-gray-950 text-center duration-1000 data-[visible=true]:animate-in data-[visible=false]:animate-out data-[visible=false]:fade-out-0 data-[visible=true]:fade-in-0"
            >
              <OfflineErrorIcon className="hidden h-[120px] w-full sm:flex" />
              <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold">Broadcast failed</div>
                <div className="text-sm text-gray-100">
                  There was an error with broadcasting - it is retrying in the background.
                </div>
              </div>
            </Broadcast.ErrorIndicator>
          </Broadcast.Container>
        </Broadcast.Root>
      ) : (
        <StreamVideoSkeleton />
      )}
    </div>
  );
}

export const BroadcastLoading = ({
  title,
  description
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => (
  <div className="aspect-video relative flex w-full flex-col-reverse gap-3 overflow-hidden rounded-sm bg-white/10 px-3 py-3 md:px-3">
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-white/5" />
        <div className="h-6 w-16 animate-pulse overflow-hidden rounded-lg bg-white/5 md:h-7 md:w-20" />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-white/5" />
        <div className="h-6 w-6 animate-pulse overflow-hidden rounded-lg bg-white/5" />
      </div>
    </div>
    <div className="h-2 w-full animate-pulse overflow-hidden rounded-lg bg-white/5" />

    {title && (
      <div className="absolute inset-10 flex flex-col items-center justify-center gap-1 text-center">
        <span className="text-lg font-medium text-white">{title}</span>
        {description && <span className="text-sm text-white/80">{description}</span>}
      </div>
    )}
  </div>
);

export const Settings = React.forwardRef(
  ({ className }: { className?: string }, ref: React.Ref<HTMLButtonElement> | undefined) => {
    return (
      <Popover>
        <PopoverTrigger ref={ref} asChild>
          <button
            type="button"
            className={className}
            aria-label="Stream settings"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsIcon />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-60 rounded-md border border-white/50 bg-black/50 p-3 shadow-md outline-none backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          side="top"
          alignOffset={-70}
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-sm font-medium text-white/90">Stream settings</p>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/90" htmlFor="cameraSource">
                Camera ('c' to rotate)
              </label>
              <SourceSelectComposed name="cameraSource" type="videoinput" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-white/90" htmlFor="microphoneSource">
                Microphone ('m' to rotate)
              </label>
              <SourceSelectComposed name="microphoneSource" type="audioinput" />
            </div>
          </div>
          <RadixPopover.Close
            className="absolute right-2.5 top-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full outline-none"
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

export const SourceSelectComposed = React.forwardRef(
  (
    {
      name,
      type,
      className
    }: { name: string; type: "audioinput" | "videoinput"; className?: string },
    ref: React.Ref<HTMLButtonElement> | undefined
  ) => (
    <Broadcast.SourceSelect name={name} type={type}>
      {(devices) =>
        devices ? (
          <>
            <Broadcast.SelectTrigger
              ref={ref}
              className={cn(
                "flex h-7 w-full items-center justify-between gap-1 overflow-hidden rounded-sm px-1 text-xs leading-none outline-none outline-1 outline-white/50 disabled:cursor-not-allowed disabled:opacity-70",
                className
              )}
              aria-label={type === "audioinput" ? "Audio input" : "Video input"}
            >
              <Broadcast.SelectValue
                placeholder={
                  type === "audioinput" ? "Select an audio input" : "Select a video input"
                }
              />
              <Broadcast.SelectIcon>
                <ChevronDownIcon className="h-4 w-4" />
              </Broadcast.SelectIcon>
            </Broadcast.SelectTrigger>
            <Broadcast.SelectPortal>
              <Broadcast.SelectContent className="overflow-hidden rounded-sm bg-black">
                <Broadcast.SelectViewport className="p-1">
                  <Broadcast.SelectGroup>
                    {devices?.map((device) => (
                      <RateSelectItem key={device.deviceId} value={device.deviceId}>
                        {device.friendlyName}
                      </RateSelectItem>
                    ))}
                  </Broadcast.SelectGroup>
                </Broadcast.SelectViewport>
              </Broadcast.SelectContent>
            </Broadcast.SelectPortal>
          </>
        ) : (
          <span>There was an error fetching the available devices.</span>
        )
      }
    </Broadcast.SourceSelect>
  )
);

const RateSelectItem = React.forwardRef<HTMLDivElement, Broadcast.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Broadcast.SelectItem
        className={cn(
          "relative flex h-7 select-none items-center rounded-sm pl-[25px] pr-[35px] text-xs leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-white/20 data-[highlighted]:outline-none",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Broadcast.SelectItemText>{children}</Broadcast.SelectItemText>
        <Broadcast.SelectItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
          <CheckIcon className="h-4 w-4" />
        </Broadcast.SelectItemIndicator>
      </Broadcast.SelectItem>
    );
  }
);
