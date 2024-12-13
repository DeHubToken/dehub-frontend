"use client";

import { Fragment, useEffect, useRef, } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Settings } from "lucide-react";
import io from "socket.io-client";
import { toast } from "sonner"; 

import { Button } from "@/components/ui/button";

import { SERVER_URL, useWebSockets } from "@/contexts/websocket";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { NoConversation } from "./components/common";
import { ContactList } from "./components/contact-list";
import { ConversationView } from "./components/conversation-view";
import { MobileContactList } from "./components/mobile-contact-list";
import { NewChatModal } from "./components/new-chat-modal";
import { MessageProvider } from "./components/provider";

/* ----------------------------------------------------------------------------------------------- */

dayjs.extend(relativeTime);
export default function MessagesScreen() {
  const { account } = useActiveWeb3React();
  const router = useRouter();
  // Use any for socket connections
  const socketConnections = useRef<any>({
    dm: null
  });

  useEffect(() => {
    if (!account ) {
      if(socketConnections.current.dm)
      socketConnections?.current?.dm?.disconnect();
      toast.error("please connect to wallet.");
      router.push("/");
    }
    if (!socketConnections.current.dm && !socketConnections.current.gpDm) {
      // Initialize both sockets only once
      socketConnections.current.dm = io(`${SERVER_URL}/dm`, {
        query: {
          address: account
        }
      });
      // Clean up on unmount
      return () => {
        if (socketConnections.current.dm) {
          socketConnections.current.dm.disconnect();
          socketConnections.current.dm = null;
        }
      };
    }
  }, [SERVER_URL, account, socketConnections]);

  return (
    <MessageProvider socketConnections={socketConnections}>
      <ScreenHeight>
        <Messages />
      </ScreenHeight>
    </MessageProvider>
  );
}

function Messages() {
  return (
    <Fragment>
      <MobileContactList />
      <div className="hidden flex-col gap-8 pt-6 lg:flex lg:flex-1">
        {contactListHeader}

        <div className="grid w-full justify-items-center">
          <div className="flex w-1/2 items-center justify-between gap-5">
            <NewChatModal />
            <Button>Dm </Button>
            <Button>Groups </Button>
          </div>
        </div>
        <ContactList />
      </div>

      <div className="flex flex-1 px-6 pt-2">
        <NoConversation />
        <ConversationView />
      </div>
    </Fragment>
  );
}

const contactListHeader = (
  <div className="flex items-center justify-between">
    <h1 className="text-2xl">Messages</h1>
    <button>
      <Settings className="text-gray-400" />
    </button>
  </div>
);

function ScreenHeight(props: React.ComponentProps<"div">) {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "relative mt-[calc((80/16)*1rem)] flex max-h-[calc(100vh-80px-30px)] min-h-[calc(100vh-80px-30px)] w-full gap-2 overflow-hidden",
        className
      )}
    />
  );
}
