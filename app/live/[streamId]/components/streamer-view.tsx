"use client";

import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";

import { StreamVideoSkeleton } from "@/app/stream/[id]/components/stream-video-provider";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import StatusBadge from "./status-badge";

export default function StreamerView(props: { stream: any }) {
  const { stream } = props;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const { account, library } = useUser();
  const { socket } = useWebSockets();

  useEffect(() => {
    let mounted = true;

    const startStreaming = async () => {
      console.log("Starting streaming...");
      try {
        if (!socket) throw new Error("WebSocket is not connected.");

        // Request media stream
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        // If component unmounted during async operation, cleanup and return
        if (!mounted) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        mediaStreamRef.current = mediaStream;

        // Set up video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play().catch(console.error);
        }

        // Create and start recorder
        const recorder = new MediaRecorder(mediaStream, {
          mimeType: "video/webm; codecs=vp8"
        });

        recorder.ondataavailable = (event) => {
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
          socket.emit("streamEnd", { streamId: stream._id });
        };

        recorderRef.current = recorder;
        recorder.start(500);
        setIsStreaming(true);
      } catch (error) {
        console.error("Error starting stream:", error);
        setIsStreaming(false);
      }
    };

    if (socket) {
      startStreaming();
    }

    // Cleanup function
    return () => {
      console.log("Cleaning up")
      mounted = false;
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [socket, stream._id, library, videoRef.current]);

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black"
      style={{ aspectRatio: "16/9" }}
    >
      {isStreaming ? (
        <>
          <StatusBadge status={stream.status} />
          <video ref={videoRef} className="h-auto w-full object-cover" autoPlay muted playsInline />
          <div className="absolute bottom-4 left-4 flex space-x-4">
            <button
              onClick={toggleVideo}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                isVideoEnabled ? "border-white bg-transparent" : "border-gray-500 bg-gray-700"
              }`}
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
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                isAudioEnabled ? "border-white bg-transparent" : "border-gray-500 bg-gray-700"
              }`}
              aria-label={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
            >
              {isAudioEnabled ? (
                <FaMicrophone className="text-white" />
              ) : (
                <FaMicrophoneSlash className="text-white" />
              )}
            </button>
          </div>
        </>
      ) : (
        <StreamVideoSkeleton />
      )}
    </div>
  );
}
