"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { truncate } from "@/libs/strings";
import { cn } from "@/libs/utils";

import { getLiveStream } from "@/services/broadcast/broadcast.service";

import { StreamStatus } from "@/configs";

import { LivestreamEvents, StreamActivityType } from "../enums/livestream.enum";
import TipAnimation from "./tip-animation";

const MessageComponent = ({ activity }: { activity: any }) => {
  return (
    <div className="flex items-start space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm text-white">
        {activity.meta.username?.[0] || activity.address?.[0]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">
          {activity.meta.username || activity.address}
        </p>
        <p className="text-sm text-gray-300">{activity.meta.content}</p>
      </div>
    </div>
  );
};

const UserJoinComponent = ({ activity }: { activity: any }) => {
  return (
    <div className="text-center text-sm text-gray-400">
      {truncate(activity.meta.username || activity.address || activity.meta.address, 8)} joined the
      stream.
    </div>
  );
};

const StreamTipComponent = ({ activity }: { activity: any }) => {
  return (
    <div className="text-center text-sm text-gray-400">
      {truncate(activity.meta.username || activity.address || activity.meta.address, 8)} tipped $
      {activity.meta.amount} DHB.
    </div>
  );
};

const UserLeaveComponent = ({ activity }: { activity: any }) => {
  return (
    <div className="text-center text-sm text-gray-400">
      {truncate(activity.meta.username || activity.address || activity.meta.address, 8)} left the
      stream.
    </div>
  );
};

const StreamStartComponent = () => {
  return (
    <div className="text-center text-sm text-gray-400">
      Stream has started. Welcome to the chat!
    </div>
  );
};

const StreamEndComponent = () => {
  return (
    <div className="text-center text-sm text-gray-400">
      Stream has ended. Thank you for watching!
    </div>
  );
};

export default function BroadcastChatPanel(props: { streamId: string }) {
  const { streamId } = props;

  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for chat container
  const [stream, setStream] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [tipAnimations, setTipAnimations] = useState<Array<{ id: string; amount: number }>>([]);
  const { socket } = useWebSockets();
  const { account } = useUser();

  // Fetch initial stream data and activities
  useEffect(() => {
    const fetchStream = async () => {
      const response = await getLiveStream(streamId);
      if (response.success) {
        setStream(response.data);
        setActivities(response.data.activities || []);
      }
    };
    fetchStream();
  }, [streamId]);

  // Listen for WebSocket events
  useEffect(() => {
    if (!socket) return;

    // Handle new messages
    const handleNewMessage = ({ message }: any) => {
      if (stream?.status !== StreamStatus.LIVE) return;
      setActivities((prev) => [
        ...prev,
        {
          status: StreamActivityType.MESSAGE,
          address: message.user.address,
          meta: {
            username: message.user.username,
            content: message.meta.content,
            avatarImageUrl: message.user.avatarImageUrl
          }
        }
      ]);
    };

    // Handle user joining
    const handleUserJoin = (data: any) => {
      // console.log("New user joined", data);
      // if (data.streamId !== stream._id) return;
      if (stream?.status !== StreamStatus.LIVE) return;
      setActivities((prev) => [
        ...prev,
        {
          status: StreamActivityType.JOINED,
          address: data.user.address,
          meta: {
            username: data.user.username,
            avatarImageUrl: data.user.avatarImageUrl
          }
        }
      ]);
    };

    // Handle user leaving
    const handleUserLeave = (data: any) => {
      if (stream?.status !== StreamStatus.LIVE) return;
      // if (data.streamId !== stream._id) return;
      setActivities((prev) => [
        ...prev,
        {
          status: StreamActivityType.LEFT,
          address: data.user.address,
          meta: {
            username: data.user?.username,
            avatarImageUrl: data.user?.avatarImageUrl
          }
        }
      ]);
    };

    // Handle stream start
    const handleStreamStart = (data: any) => {
      // if (data.streamId !== stream._id) return;
      setStream((prev: any) => ({ ...prev, status: StreamStatus.LIVE }));
      setActivities((prev) => [
        ...prev,
        {
          status: StreamActivityType.START,
          address: "system",
          meta: { message: "Stream has started." }
        }
      ]);
    };

    // Handle stream end
    const handleStreamEnd = (data: any) => {
      // if (data.streamId !== stream._id) return;
      setStream((prev: any) => ({ ...prev, status: StreamStatus.ENDED }));
      setActivities((prev) => [
        ...prev,
        {
          status: StreamActivityType.END,
          address: "system",
          meta: { message: "Stream has ended." }
        }
      ]);
    };

    const handleTip = (data: any) => {
      const { gift } = data;
      const amount = Number(gift.meta.amount);
      const message = gift.meta.message;

      console.log("Tip received:", data, amount);
      setStream((prev: any) => ({
        ...prev,
        totalTips: (prev.totalTips || 0) + amount
      }));
      setActivities((prev) => [
        ...prev,
        {
          status: StreamActivityType.TIP,
          address: gift.meta.address,
          meta: { ...gift.meta }
        }
      ]);

      // Return early if it's the user's own tip
      if (gift?.meta?.address.toLowerCase() === account?.toLowerCase()) {
        return;
      }

      // Read out text [gift.meta.message]
      if (typeof window !== "undefined" && window.speechSynthesis && message.trim() !== "") {
        const utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
      }

      const notification = message
        ? `${truncate(gift.meta.username || gift.meta.displayName || gift.meta.address, 8)} tipped ${gift.meta.amount} DHB: ${message}`
        : `${truncate(gift.meta.username || gift.meta.displayName || gift.meta.address, 8)} tipped ${gift.meta.amount} DHB`;

      toast(notification, {
        icon: gift.meta.tier ? "🎁" : "💰"
      });

      const tipId = `${Date.now()}-${Math.random()}`;
      // Add new tip animation
      setTipAnimations((prev) => [...prev, { id: tipId, amount }]);

      // Determine duration based on amount
      let duration = 3000;
      if (amount >= 500000) duration = 5000;
      if (amount >= 750000) duration = 10000;
      if (amount >= 1000000) duration = 10000;

      // Remove the tip animation after the duration
      setTimeout(() => {
        setTipAnimations((prev) => prev.filter((tip) => tip.id !== tipId));
      }, duration);
    };

    // Subscribe to events
    socket.on(LivestreamEvents.SendMessage, handleNewMessage);
    socket.on(LivestreamEvents.JoinStream, handleUserJoin);
    socket.on(LivestreamEvents.LeaveStream, handleUserLeave);
    socket.on(LivestreamEvents.StartStream, handleStreamStart);
    socket.on(LivestreamEvents.EndStream, handleStreamEnd);
    socket.on(LivestreamEvents.TipStreamer, handleTip);

    // Cleanup listeners
    return () => {
      socket.off(LivestreamEvents.SendMessage, handleNewMessage);
      socket.off(LivestreamEvents.JoinStream, handleUserJoin);
      socket.off(LivestreamEvents.LeaveStream, handleUserLeave);
      socket.off(LivestreamEvents.StartStream, handleStreamStart);
      socket.off(LivestreamEvents.EndStream, handleStreamEnd);
      socket.off(LivestreamEvents.TipStreamer, handleTip);
    };
  }, [socket, stream]);

  // Scroll to the bottom of the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Update activities and scroll to bottom when a new activity is added
  useEffect(() => {
    scrollToBottom();
  }, [activities]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (stream?.status !== StreamStatus.LIVE) {
      alert("Stream is not live");
      return;
    }
    if (message.trim() && socket) {
      socket.emit(LivestreamEvents.SendMessage, { streamId, content: message });
      setMessage("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  if (!account) return null;
  return (
    <div className="relative h-full min-h-full w-full rounded-2xl border border-theme-mine-shaft-dark bg-theme-mine-shaft-dark p-4 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <h2 className="mb-2 text-lg font-bold text-white">Chat</h2>
      {tipAnimations.map((tip) => (
        <TipAnimation key={tip.id} amount={tip.amount} />
      ))}
      {!stream?.settings?.chat?.enabled ? (
        <div className="text-center text-2xl font-bold text-white">Chat is disabled</div>
      ) : stream?.status === StreamStatus.OFFLINE || stream?.status === StreamStatus.SCHEDULED ? (
        <div className="text-center text-2xl font-bold text-white">Stream is Offline</div>
      ) : (
        <div
          ref={chatContainerRef} // Attach ref to chat container
          className="mb-4 max-h-[83%] flex-1 space-y-3 overflow-y-auto"
        >
          {activities.map((activity, index) => {
            switch (activity.status) {
              case StreamActivityType.MESSAGE:
                return <MessageComponent key={index} activity={activity} />;

              case StreamActivityType.JOINED:
                return <UserJoinComponent key={index} activity={activity} />;

              case StreamActivityType.LEFT:
                return <UserLeaveComponent key={index} activity={activity} />;

              case StreamActivityType.TIP:
                return <StreamTipComponent key={index} activity={activity} />;

              case StreamActivityType.START:
                return <StreamStartComponent key={index} />;

              case StreamActivityType.END:
                return <StreamEndComponent key={index} />;

              default:
                return null;
            }
          })}
        </div>
      )}

      {stream?.status !== StreamStatus.OFFLINE && stream?.status !== StreamStatus.SCHEDULED && (
        <div className="absolute bottom-2 left-0 right-0 px-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-theme-mine-shaft-dark bg-theme-mine-shaft p-2 text-white placeholder-gray-500 focus:border-classic-purple focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              onClick={handleSendMessage}
              variant="gradientOne"
              className={cn("gap-2 rounded-full")}
            >
              <FaPaperPlane className="text-sm" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
