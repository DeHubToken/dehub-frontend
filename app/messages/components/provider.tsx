"use client";

import { useEffect, useState } from "react";

import { createContext } from "@/libs/context";

import { messages, TMessage } from "../utils";

type State = {
  selectedMessageId: string | null;
  selectedMessage: TMessage | undefined | null;
  messages: TMessage[];
  status: "idle" | "loading" | "error" | "success";
  setSelectedMessageId: (id: string | null) => void;
};

const [Provider, useMessage] = createContext<State>("MessagesScreen");

export function MessageProvider(props: { children: React.ReactNode }) {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [status, setStatus] = useState<State["status"]>("idle");
  const message = messages.find((message) => message.id === selectedMessageId);

  useEffect(() => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 3000);
  }, []);

  return (
    <Provider
      messages={messages} // <- From API
      status={status}
      selectedMessageId={selectedMessageId}
      setSelectedMessageId={setSelectedMessageId}
      selectedMessage={message}
    >
      {props.children}
    </Provider>
  );
}

export { useMessage };
