import { useEffect, useState } from "react";

import { cn } from "@/libs/utils";

import { StartNewConversation } from "./common";
import { ConversationHeader } from "./conversation-header";
import { IncomingMessage } from "./incoming-message";
import { MessageInput } from "./message-input";
import { OutgoingMessage } from "./outgoing-message";
import { useMessage } from "./provider";

export function ConversationView() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const { messages, selectedMessage: message } = useMessage("MessageList");

  useEffect(() => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 3000);
  }, [message]);

  if (!messages.length) return null;
  if (!message) return null;

  if (status === "loading") {
    return (
      <div className="w-full">
        <div className="flex w-full justify-between">
          <div className="flex w-full items-center gap-2">
            <div className="shimmer size-10 rounded-full bg-gray-300 dark:bg-gray-500" />
            <div className="shimmer h-3 w-36 rounded-full bg-gray-300 dark:bg-gray-500" />
          </div>
        </div>

        <div className="max-h-[calc(100vh-80px-24px-150px)] min-h-[calc(100%-40px-100px)]">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="mb-4 w-full">
              <div className={cn("flex w-full", index % 2 === 0 ? "justify-end" : "justify-start")}>
                <div className="flex max-w-96 flex-col items-end gap-1">
                  <span className="shimmer h-2 w-28 rounded-full bg-gray-300 dark:bg-gray-500" />
                  <div className="flex items-end gap-3">
                    {index % 2 === 0 && (
                      <div className="shimmer h-28 w-96 rounded-l-[20px] rounded-tr-[20px] bg-gray-300 px-4 py-3 dark:bg-gray-500" />
                    )}
                    {index % 2 !== 0 && (
                      <div className="shimmer h-28 w-96 rounded-r-[20px] rounded-tl-[20px] bg-gray-300 px-4 py-3 dark:bg-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <ConversationHeader />
      </div>

      <ChatContainer>
        <StartNewConversation />
        {message.messages.map((message) => (
          <div key={message.id} className="mb-4">
            {message.author === "me" && <OutgoingMessage message={message} />}
            {message.author !== "me" && <IncomingMessage message={message} />}
          </div>
        ))}
      </ChatContainer>
      <MessageInput />
    </div>
  );
}

function ChatContainer(props: React.ComponentProps<"div">) {
  const { ...rest } = props;
  const { messages } = useMessage("MessagesContainer");
  return (
    <div
      {...rest}
      className={cn(
        "max-h-[calc(100vh-80px-24px-150px)] min-h-[calc(100%-40px-100px)] overflow-y-scroll pb-10",
        messages.length === 0 && "flex flex-col items-center justify-center",
        rest.className
      )}
    />
  );
}
