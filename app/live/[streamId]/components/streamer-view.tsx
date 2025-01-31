"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhone,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash
} from "react-icons/fa";

import { StreamVideoSkeleton } from "@/app/stream/[id]/components/stream-video-provider";

import { LazyImage } from "@/components/image";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { getImageUrl } from "@/web3/utils/url";

import { env, StreamStatus } from "@/configs";

import StatusBadge from "./status-badge";
import { LivestreamEvents } from "../enums/livestream.enum";

export default function StreamerView(props: { stream: any, isBroadcastOwner: boolean }) {
  const { stream, isBroadcastOwner } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { account, library } = useUser();
  const { socket } = useWebSockets();

  const setupMediaStream = async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled
      });

      mediaStreamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(console.error);
      }
    } catch (error) {
      console.error("Error setting up media stream:", error);
    }
  };

  const startStreaming = async () => {
    console.log("Starting streaming...");
    try {
      if (!socket) throw new Error("WebSocket is not connected.");

      await setupMediaStream();

      const recorder = new MediaRecorder(mediaStreamRef.current!, {
        mimeType: "video/webm; codecs=vp8"
      });

      if(stream.status !== StreamStatus.LIVE){
        socket?.emit(LivestreamEvents.StartStream, { streamId: stream._id })
      }
      recorder.ondataavailable = (event) => {
        console.log("Chunk size:", event.data.size);
        if (event.data.size > 0 && socket && (isAudioEnabled || isVideoEnabled)) {
          const reader = new FileReader();
          reader.onload = () => {
            socket.emit("streamData", {
              streamId: stream._id,
              chunk: reader.result
            });
          };
          reader.readAsArrayBuffer(event.data);
        }
      };

      recorder.onstart = () => console.log("Recorder started");
      recorder.onstop = () => {
        console.log("Recorder stopped");
      };

      recorderRef.current = recorder;
      recorder.start(500);
      setIsStreaming(true);
      // socket.emit(LivestreamEvents.StartStream, { streamId: stream._id });
    } catch (error) {
      console.error("Error starting stream:", error);
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    socket.emit(LivestreamEvents.EndStream, { streamId: stream._id });
    setIsStreaming(false);
    console.log("Streaming stopped");
  };

  useEffect(() => {
    if (!socket) return;

    const handleStreamEnd = () => {
      console.log("Receibed start end")

      setIsStreaming(false);
    };

    socket.on(LivestreamEvents.EndStream, handleStreamEnd);

    return () => {
      socket.off(LivestreamEvents.EndStream, handleStreamEnd);
    };
  }, [socket]);

  useEffect(() => {
    if (isStreaming) {
      setupMediaStream();
    }
  }, [isVideoEnabled, isAudioEnabled]);

  useEffect(() => {
    if (!socket || !stream._id) return;
  
    socket.emit(LivestreamEvents.JoinRoom, { streamId: stream._id });
    return () => {
    };
  }, []);

  const toggleVideo = () => setIsVideoEnabled((prev) => !prev);

  const toggleAudio = () => setIsAudioEnabled((prev) => !prev);

  return (
    <>
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-black"
        style={{ aspectRatio: "16/9" }}
      >
        {account && library ? (
          <>
            <StatusBadge status={stream.status} />
            <video
              ref={videoRef}
              className="h-auto w-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <div className="absolute bottom-4 flex w-full justify-between px-4">
              <div className="flex space-x-4">
                <button
                  onClick={toggleVideo}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${isVideoEnabled ? "border-white bg-transparent" : "border-gray-500 bg-gray-700"}`}
                  aria-label={isVideoEnabled ? "Disable Video" : "Enable Video"}
                >
                  {isVideoEnabled ? (
                    <FaVideo className="text-white" />
                  ) : (
                    <FaVideoSlash className="text-white" />
                  )}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${isAudioEnabled ? "border-white bg-transparent" : "border-gray-500 bg-gray-700"}`}
                  aria-label={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
                >
                  {isAudioEnabled ? (
                    <FaMicrophone className="text-white" />
                  ) : (
                    <FaMicrophoneSlash className="text-white" />
                  )}
                </button>
              </div>
              <button
                onClick={isStreaming ? stopStreaming : startStreaming}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${isStreaming ? "border-red-500 bg-red-700" : "border-green-500 bg-green-700"}`}
                aria-label={isStreaming ? "End Call" : "Start Call"}
              >
                {isStreaming ? (
                  <FaPhoneSlash className="text-white" />
                ) : (
                  <FaPhone className="text-white" />
                )}
              </button>
            </div>
          </>
        ) : (
          <StreamVideoSkeleton />
        )}
      </div>
      {/* {isStreaming && (
        <video
          src="https://dehubcdn.ams3.cdn.digitaloceanspaces.com/live/hls/6772e42392598fe8be4ce066/playlist.m3u8"
          controls
          autoPlay
          style={{ aspectRatio: "16/9" }}
        ></video>
      )} */}
    </>
  );
}
