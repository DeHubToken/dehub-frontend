"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { createContext } from "@/libs/context";

import { fetchDmMessages } from "@/services/dm";

import { messages, SocketEvent, TMessage } from "../utils";

type State = {
  selectedMessageId: string | null;
  selectedMessage: TMessage | undefined | null;
  messages: TMessage[];
  status: "idle" | "loading" | "error" | "success";
  setSelectedMessageId: (id: string | null) => void;
  startNewChat: ({
    address,
    username,
    _id
  }: {
    address: string;
    username: string;
    _id?: string;
  }) => void;
  sendMessage: (newMsg: string) => void;
};

const [Provider, useMessage] = createContext<State>("MessagesScreen");

export function MessageProvider(props: { children: React.ReactNode; socketConnections: any }) {
  const socket = props?.socketConnections?.current?.dm;
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [status, setStatus] = useState<State["status"]>("idle");
  const [messages, setMessages] = useState([]);
  const message: any & { _id: string } = messages.find((msg: any) => msg._id === selectedMessageId);
  
  useEffect(() => {
    setStatus("loading");
    if (!socket) return;
    socket.emit(SocketEvent.fetchDMessages, { msg: "hello" });
    socket.on(SocketEvent.pong, (data: any) => {
      console.log(data);
    });
    socket.on(SocketEvent.fetchDMessages, setMsgsHandler);
    setTimeout(() => {
      setStatus("success");
    }, 3000);

    return () => {
      socket.off(SocketEvent.fetchDMessages, (data: any) => {});
    };
  }, [socket]);

  const startNewChat = (user: { address: string; username: string; _id?: string }) => {
    socket.emit(SocketEvent.createAndStart, user);
    toast.success(`please wait starting chat with ${user.username || user.address}`);
  };
  const setMsgsHandler = (msgs: any) => {
    setMessages(msgs);
  };
  const sendMessage = (newMsg: string) => {
    socket.emit(SocketEvent.sendMessage, { msg: newMsg, dmId: message?._id });
  };
  return (
    <Provider
      messages={messages} // <- From API
      status={status}
      selectedMessageId={selectedMessageId}
      setSelectedMessageId={setSelectedMessageId}
      selectedMessage={message}
      startNewChat={startNewChat}
      sendMessage={sendMessage}
    >
      {props.children}
    </Provider>
  );
}

export { useMessage };
