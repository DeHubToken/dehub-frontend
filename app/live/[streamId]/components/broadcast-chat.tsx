"use client"
import { Button } from "@/components/ui/button";
import { useWebSockets } from "@/contexts/websocket";
import { cn } from "@/libs/utils";
import React, { useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { LivestreamEvents } from "../enums/livestream.enum";

export default function BroadcastChatPanel(props: { streamId: string }) {
  const { streamId } = props;

  const [message, setMessage] = useState("");
  // const [messages, setMessages] = useState<Array<{ user: string; content: string }>>([]);
  const [messages, setMessages] = useState<any>([]);
  const { socket } = useWebSockets();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      console.log("New message",message)
      setMessages((prev: any) => [...prev, message]);
    };

    socket.on(LivestreamEvents.SendMessage, handleNewMessage);

    return () => {
      socket.off(LivestreamEvents.SendMessage, handleNewMessage);
    };
  }, [socket]);

  useEffect(()=>{
    // Fetch stream activities and store in messages
  },[streamId])

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      socket.emit(LivestreamEvents.SendMessage, { streamId, content: message });
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      className="w-full relative p-4 bg-theme-mine-shaft-dark rounded-2xl border border-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark"
      style={{ aspectRatio: "9/16" }}
    >
      {/* Chat Header */}
      <h2 className="text-lg font-bold text-white mb-4">Chat</h2>

      {/* Chat Messages Container */}
      <div className="flex-1 h-full overflow-y-auto space-y-3 mb-4">
        {/* System Message - Stream Started */}
        <div className="text-sm text-gray-400 text-center">
          Stream has started. Welcome to the chat!
        </div>

        {/* User Joined Notification */}
        <div className="text-sm text-gray-400 text-center">
          User123 joined the chat.
        </div>

        {/* Chat Message Example */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">User123</p>
            <p className="text-sm text-gray-300">This is a sample chat message!</p>
          </div>
        </div>
        {/* User Joined Notification */}
        <div className="text-sm text-gray-400 text-center">
          User123 joined the chat.
        </div>

        {/* Chat Message Example */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">User123</p>
            <p className="text-sm text-gray-300">This is a sample chat message!</p>
          </div>
        </div>{/* User Joined Notification */}
        <div className="text-sm text-gray-400 text-center">
          User123 joined the chat.
        </div>

        {/* Chat Message Example */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">User123</p>
            <p className="text-sm text-gray-300">This is a sample chat message!</p>
          </div>
        </div>{/* User Joined Notification */}
        <div className="text-sm text-gray-400 text-center">
          User123 joined the chat.
        </div>

        {/* Chat Message Example */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">User123</p>
            <p className="text-sm text-gray-300">This is a sample chat message!</p>
          </div>
        </div>{/* User Joined Notification */}
        <div className="text-sm text-gray-400 text-center">
          User123 joined the chat.
        </div>

        {/* Chat Message Example */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">User123</p>
            <p className="text-sm text-gray-300">This is a sample chat message!</p>
          </div>
        </div>{/* User Joined Notification */}
        <div className="text-sm text-gray-400 text-center">
          User123 joined the chat.
        </div>

        {/* Chat Message Example */}
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">User123</p>
            <p className="text-sm text-gray-300">This is a sample chat message!</p>
          </div>
        </div>

        {/* User Left Notification */}
        <div className="text-sm text-gray-400 text-center">
          User456 left the chat.
        </div>
      </div>

      {/* Chat Input */}
      <div className="absolute bottom-2 left-0 right-0 px-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg bg-theme-mine-shaft border border-theme-mine-shaft-dark text-white placeholder-gray-500 focus:outline-none focus:border-classic-purple"
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
    </div>
  );
}