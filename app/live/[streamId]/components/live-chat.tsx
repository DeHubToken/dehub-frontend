"use client";

import { useEffect, useState } from "react";
import { Hand } from "lucide-react";
import { toast } from "sonner";

import UserProfileCard from "@/app/components/user-profile-card";

import { Gift } from "@/components/icons/gift";
import { ThumbsUp } from "@/components/icons/thumbs-up";
import { WavingHand } from "@/components/icons/waving-hand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useWebSockets } from "@/contexts/websocket";

import { useUser } from "@/hooks/use-user";

import { truncate } from "@/libs/strings";
import { cn, createAvatarName } from "@/libs/utils";

import { getLiveStream } from "@/services/broadcast/broadcast.service";

import { StreamStatus } from "@/configs";

import { LivestreamEvents, StreamActivityType } from "../enums/livestream.enum";
import TipAnimation, { GiftAnimation } from "./tip-animation";

export function LiveChat(props: { streamId: string }) {
  const { streamId } = props;

  const [stream, setStream] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [tipAnimations, setTipAnimations] = useState<Array<{ id: string; amount: number }>>([]);
  const { socket } = useWebSockets();
  const { account } = useUser();

  //   // Fetch initial stream data and activities
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

  //   // Listen for WebSocket events
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
    <div className="relative flex max-h-[calc((100vh-var(--navbar-height)-48px-60px))] min-h-[calc((100vh-var(--navbar-height)-48px-60px))] flex-col rounded-3xl border border-theme-neutrals-800 px-5 py-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-theme-neutrals-100">Live chat</span>
        <Button className="hidden h-7 rounded-full md:flex">View all</Button>
      </div>

      {tipAnimations.map((tip) => (
        <GiftAnimation key={tip.id} />
      ))}

      {!stream?.settings?.chat?.enabled ? (
        <div className="mt-3 grid place-items-center">
          <span className="text-center text-2xl font-bold text-theme-neutrals-400">
            Chat is disabled
          </span>
        </div>
      ) : stream?.status === StreamStatus.OFFLINE || stream?.status === StreamStatus.SCHEDULED ? (
        <div className="mt-3 grid place-items-center">
          <span className="text-center text-2xl font-bold text-theme-neutrals-400">
            {stream?.status === StreamStatus.OFFLINE
              ? "Stream is offline"
              : "Stream has not started"}
          </span>
        </div>
      ) : (
        <div className="mt-3 flex max-h-[calc((100vh-var(--navbar-height)-48px-60px-24px-28px-12px-44px-16px))] min-h-[calc((100vh-var(--navbar-height)-48px-60px-24px-28px-12px-44px-16px))] flex-col gap-6 overflow-y-auto">
          {activities.map((activity, i) => {
            switch (activity.status) {
              case StreamActivityType.MESSAGE:
                return <UserMessage key={i} activity={activity} />;
              case StreamActivityType.JOINED:
                return <UserJoin key={i} activity={activity} />;
              case StreamActivityType.LEFT:
                return <UserLeave key={i} activity={activity} />;
              case StreamActivityType.TIP:
                return <UserTip key={i} activity={activity} />;
              case StreamActivityType.START:
                return <StreamStart key={i} />;
              case StreamActivityType.END:
                return <StreamEnd key={i} />;
              default:
                return null;
            }
            return null;
          })}
        </div>
      )}

      {stream?.status !== StreamStatus.OFFLINE && stream?.status !== StreamStatus.SCHEDULED ? (
        <div className="absolute bottom-[66px] left-0 right-0 mt-4 flex items-center gap-2 xl:relative xl:bottom-0">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Comment..."
            className="h-11 flex-1 rounded-full"
            disabled={stream?.status !== StreamStatus.LIVE}
          />
          <Button
            className="rounded-full"
            variant="gradientOne"
            disabled={stream?.status !== StreamStatus.LIVE}
          >
            <Gift />
          </Button>
          <Button
            onClick={handleSendMessage}
            className="rounded-full text-theme-neutrals-400"
            disabled={stream?.status !== StreamStatus.LIVE}
          >
            <ThumbsUp className="size-5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function UserMessage(props: { activity: any }) {
  const { activity } = props;
  return (
    <div className="flex items-start">
      {/* <UserProfileCard
        username={activity.meta?.username}
        avatarUrl={activity.meta?.avatarImageUrl}
        address={activity.address}
        createdAt={activity.meta?.createdAt}
        staked = {activity.meta?.staked || 0}
        displayName = {activity.meta?.displayName}
        aboutMe = {activity.meta?.aboutMe}
        followers = {activity.meta?.followers || 0}
      /> */}
      <Avatar>
        <AvatarFallback>
          {createAvatarName(activity.meta.username || activity.address?.[0])}
        </AvatarFallback>
        <AvatarImage src={activity?.meta?.minterAvatarUrl} />
      </Avatar>
      <div className="flex flex-col gap-2 pl-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-theme-neutrals-200">
            {activity.meta.username || activity.address}
          </span>
          <span className="text-sm font-normal text-theme-neutrals-500">45 mins ago</span>
        </div>
        <p className="font-medium text-theme-neutrals-400">{activity.meta.content}</p>
      </div>
    </div>
  );
}

export function LiveStreamTabs() {
  return (
    <div className="hidden items-center xl:flex">
      <Button variant="noBg" className="rounded-full p-3">
        Live prediction
      </Button>
      <Button className="rounded-full bg-theme-neutrals-700 p-3 dark:bg-theme-neutrals-700">
        Live chat
      </Button>
      <Button variant="noBg" className="rounded-full p-3">
        Leaderboard
      </Button>
      <Button variant="noBg" className="rounded-full p-3">
        Recommended
      </Button>
    </div>
  );
}

function UserJoin(props: { activity: any }) {
  const { activity } = props;
  return (
    <div className="flex items-center gap-3">
      <WavingHand />
      <p className="text-theme-neutrals-400">
        {truncate(activity.meta.username || activity.address || activity.meta.address, 8)}{" "}
        <span className="font-semibold">joined the stream</span>
      </p>
    </div>
  );
}

function UserLeave(props: { activity: any }) {
  const { activity } = props;
  return (
    <div className="flex items-center gap-3">
      <Hand />
      <p className="text-theme-neutrals-400">
        {truncate(activity.meta.username || activity.address || activity.meta.address, 8)}{" "}
        <span className="font-semibold">left the stream</span>
      </p>
    </div>
  );
}

function UserTip(props: { activity: any }) {
  const { activity } = props;
  return (
    <div className="flex items-center gap-3">
      <p className="text-theme-neutrals-400">
        {truncate(activity.meta.username || activity.address || activity.meta.address, 8)} tipped $
        <span className="font-semibold">{activity.meta.amount}</span> DHB.
      </p>
    </div>
  );
}

function StreamStart() {
  return (
    <div className="flex items-center gap-3">
      <p className="text-theme-neutrals-400">
        <span className="font-semibold">Stream has started</span>
      </p>
    </div>
  );
}

function StreamEnd() {
  return (
    <div className="flex items-center gap-3">
      <p className="text-theme-neutrals-400">
        <span className="font-semibold"> Stream has ended. Thank you for watching!</span>
      </p>
    </div>
  );
}
