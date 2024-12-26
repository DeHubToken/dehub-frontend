import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { toast } from "sonner";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { fetchDmMessages } from "@/services/dm";

import { StartNewConversation } from "./common";
import { ConversationHeader } from "./conversation-header";
import ExtraInputsAndNotice from "./ExtraInputsAndNotice";
import { IncomingMessage } from "./incoming-message";
import { MessageInput } from "./message-input";
import { OutgoingMessage } from "./outgoing-message";
import { useMessage } from "./provider";

export function ConversationView() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const { account }: any = useActiveWeb3React();
  const {
    messages,
    selectedMessage: message,
    setMessages
  }: { socket: any; setMessages: any; messages: any; selectedMessage: any } = useMessage(
    "MessageList"
  );
  const [parent] = useAutoAnimate();

  const [page, setPage] = useState({
    q: null,
    skip: 0,
    limit: 10,
    address: account
  });
  useEffect(() => {
    setStatus("loading");
    if (page.skip !== 0 || page.limit !== 10) {
      fetchMessagesApi();
    }
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  }, [page]);

  const fetchMessagesApi = async () => {
    if (!message?._id) {
      return;
    }
    const { success, data, error = "" }: any = await fetchDmMessages(message._id, page);
    if (!success) {
      toast.error(error);
    }
    setMessages((privState: any) => {
      return privState.map((state: any) => {
        if (state._id === message._id) {
          return {
            ...state,
            messages: data.messages
          };
        }
        return state;
      });
    });
    setStatus("success");
  };
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

      <ChatContainer parent={parent}>
        <StartNewConversation />
        {message?.messages?.map((message: any) => (
          <div key={message?.id} className="mb-4">
            {message?.author === "me" && <OutgoingMessage message={message} />}
            {message?.author !== "me" && <IncomingMessage message={message} />}
          </div>
        ))}

        <ExtraInputsAndNotice />
      </ChatContainer>
      <MessageInput />
    </div>
  );
}

function ChatContainer(props: React.ComponentProps<"div"> & { parent: any }) {
  const { ...rest } = props;
  const { messages } = useMessage("MessagesContainer");
  return (
    <div
      {...rest}
      ref={props.parent}
      className={cn(
        "max-h-[calc(100vh-80px-24px-150px)] min-h-[calc(100%-40px-100px)] overflow-y-scroll pb-10",
        messages.length === 0 && "flex flex-col items-center justify-center",
        rest.className
      )}
    />
  );
}
