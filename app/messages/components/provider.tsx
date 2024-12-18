"use client";

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "sonner";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { createContext } from "@/libs/context";

import { fetchContacts, fetchDmMessages } from "@/services/dm";

import { messages, SocketEvent, TMessage } from "../utils";

type State = {
  socket: any;
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
  setMessages: any;
  handleAddNewChat: any;
};

const [Provider, useMessage] = createContext<State>("MessagesScreen");

export function MessageProvider(props: { children: React.ReactNode; socketConnections: any }) {
  const socket = props?.socketConnections?.current?.dm;
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [status, setStatus] = useState<State["status"]>("idle");
  const [messages, setMessages] = useState<any>([]);
  const message: any & { _id: string } = messages.find((msg: any) => msg._id === selectedMessageId);
  const { account }: any = useActiveWeb3React();
  useEffect(() => {
    setStatus("loading");
    if (!socket) return;
    socket.on(SocketEvent.pong, (data: any) => {
      console.log(data);
    });
    socket.on(SocketEvent.sendMessage, newMsgHandler);
    socket.on(SocketEvent.createAndStart, handleAddNewChat);
    if (account) {
      fetchMyContacts();
    }

    return () => {
      socket.off(SocketEvent.sendMessage, newMsgHandler);
      socket.off(SocketEvent.createAndStart, handleAddNewChat);
    };
  }, [socket]);

  const handleAddNewChat = ({ message, data }: any) => {
    if (!data) {
      return;
    }

    setMessages((prevState: any[]) => {
      const exist = prevState.find((d) => d._id == data._id);
      if (exist) return prevState
        return [data, ...prevState];
    });
    toast.success(message);
  };
  console.log("messages", messages.length);
  const newMsgHandler = (data: any) => {
    setMessages((privState: any) => {
      return privState.map((state: any) => {
        if (state._id === data.conversation) {
          return {
            ...state,
            messages: [...state?.messages||[], data]
          };
        }
        return state;
      });
    });
  };

  const fetchMyContacts = async () => {
    const { data, error, success }: any = await fetchContacts(account, {
      q: null,
      limit: 100,
      skip: 0
    });
    if (!success) {
      toast.error(error);
      return;
    }
    if (!data) {
      return;
    }
    setMessages(data);
    setStatus("success");
  };
  const startNewChat = (user: { address: string; username: string; _id?: string }) => {
    socket.emit(SocketEvent.createAndStart, user);
    toast.success(`please wait starting chat with ${user.username || user.address}`);
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
      socket={socket}
      setMessages={setMessages}
      handleAddNewChat={handleAddNewChat}
    >
      {props.children}
    </Provider>
  );
}

export { useMessage };
