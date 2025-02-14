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
import { getIngest } from "@livepeer/react/external";
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

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { getIngestUrlForStreamId } from "@/services/broadcast/get-ingest";

import { getImageUrl } from "@/web3/utils/url";

import { env, StreamStatus } from "@/configs";

import { LivestreamEvents } from "../enums/livestream.enum";
import StatusBadge from "./status-badge";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/libs/utils";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as RadixPopover from "@radix-ui/react-popover";

export default function StreamerView(props: { stream: any; isBroadcastOwner: boolean }) {
  const { stream, isBroadcastOwner } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [ingestUrl, setIngestUrl] = useState<any>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { account, library } = useUser();
  const { socket } = useWebSockets();

  useEffect(() => {
    const fetchIngest = async () => {
      const url = await getIngestUrlForStreamId(stream.livepeerId);
      setIngestUrl(url);
    };

    fetchIngest();
  }, [stream]);

  return (
    <>
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: "16/9" }}
      >
        {account && library && ingestUrl ? (
          <Broadcast.Root
            onError={(error) =>
              error?.type === "permissions"
                ? toast.error("You must accept permissions to broadcast. Please try again.")
                : null
            }
            ingestUrl={ingestUrl}
            aspectRatio={16 / 9}
          >
            <Broadcast.Container className="h-full w-full bg-gray-950">
              <Broadcast.Video
                title={stream.title}
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
                  <Broadcast.EnabledTrigger className="flex items-center justify-center gap-1 rounded-md bg-black/60 px-4 py-2 hover:bg-black/70">
                    <EnableVideoIcon className="h-7 w-7" />
                    <span className="text-sm">Start broadcast</span>
                  </Broadcast.EnabledTrigger>
                </Broadcast.EnabledIndicator>
                <Broadcast.EnabledIndicator asChild>
                  <Broadcast.EnabledTrigger className="absolute right-2 top-1 flex items-center justify-center gap-1 rounded-md bg-white/5 px-4 py-2 hover:bg-white/10">
                    <StopIcon className="h-7 w-7" />
                    <span className="text-sm">Stop broadcast</span>
                  </Broadcast.EnabledTrigger>
                </Broadcast.EnabledIndicator>
              </Broadcast.Controls>

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
    </>
  );
}

export const BroadcastLoading = ({
  title,
  description,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => (
  <div className="relative w-full px-3 md:px-3 py-3 gap-3 flex-col-reverse flex aspect-video bg-white/10 overflow-hidden rounded-sm">
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

export const Settings = React.forwardRef(
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
            aria-label="Stream settings"
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
              <p className="text-white/90 font-medium text-sm mb-1">
                Stream settings
              </p>

              <div className="gap-2 flex-col flex">
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="cameraSource"
                >
                  Camera ('c' to rotate)
                </label>
                <SourceSelectComposed name="cameraSource" type="videoinput" />
              </div>

              <div className="gap-2 flex-col flex">
                <label
                  className="text-xs text-white/90 font-medium"
                  htmlFor="microphoneSource"
                >
                  Microphone ('m' to rotate)
                </label>
                <SourceSelectComposed
                  name="microphoneSource"
                  type="audioinput"
                />
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

export const SourceSelectComposed = React.forwardRef(
  (
    {
      name,
      type,
      className,
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
                "flex w-full items-center overflow-hidden justify-between rounded-sm px-1 outline-1 outline-white/50 text-xs leading-none h-7 gap-1 outline-none disabled:opacity-70 disabled:cursor-not-allowed",
                className
              )}
              aria-label={type === "audioinput" ? "Audio input" : "Video input"}
            >
              <Broadcast.SelectValue
                placeholder={
                  type === "audioinput"
                    ? "Select an audio input"
                    : "Select a video input"
                }
              />
              <Broadcast.SelectIcon>
                <ChevronDownIcon className="h-4 w-4" />
              </Broadcast.SelectIcon>
            </Broadcast.SelectTrigger>
            <Broadcast.SelectPortal>
              <Broadcast.SelectContent className="overflow-hidden bg-black rounded-sm">
                <Broadcast.SelectViewport className="p-1">
                  <Broadcast.SelectGroup>
                    {devices?.map((device) => (
                      <RateSelectItem
                        key={device.deviceId}
                        value={device.deviceId}
                      >
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

const RateSelectItem = React.forwardRef<
  HTMLDivElement,
  Broadcast.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Broadcast.SelectItem
      className={cn(
        "text-xs leading-none rounded-sm flex items-center h-7 pr-[35px] pl-[25px] relative select-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-white/20",
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <Broadcast.SelectItemText>{children}</Broadcast.SelectItemText>
      <Broadcast.SelectItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon className="w-4 h-4" />
      </Broadcast.SelectItemIndicator>
    </Broadcast.SelectItem>
  );
});