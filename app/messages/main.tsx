"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CirclePlus, Settings, Users } from "lucide-react";
import io from "socket.io-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { SERVER_URL, useWebSockets } from "@/contexts/websocket";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { NoConversation } from "./components/common";
import { ContactList } from "./components/contact-list";
import { ConversationView } from "./components/conversation-view";
import { MobileContactList } from "./components/mobile-contact-list";
import { NewChatModal } from "./components/new-chat-modal";
import { NewGroupChatModal } from "./components/new-group-chat";
import { MessageProvider } from "./components/provider";
import { SocketEvent } from "./utils";
import CustomEmojiPicker from "./components/custom-emoji-picker";

/* ----------------------------------------------------------------------------------------------- */

dayjs.extend(relativeTime);
export default function MessagesScreen() {
  const { account } = useActiveWeb3React();
  const router = useRouter();

  // Ref to hold socket connections
  const socketConnections = useRef<any>({
    dm: null
  });
  useEffect(() => {
    if (!account) {
      // If no account is connected, disconnect socket and redirect to home page
      if (socketConnections.current.dm) {
        socketConnections.current.dm.disconnect();
        socketConnections.current.dm = null;
      }
      toast.error("Please connect to wallet.");
      router.push("/");
    } else {
      // If account is present and no socket connection exists, initialize it

      const socketOptions = {
        query: {
          address: account
        }
      };
      console.log("socket-conn-options", `${SERVER_URL}/dm`, socketOptions);
      if (socketConnections?.current?.dm?.disconnect) {
        socketConnections.current.dm.disconnect();
      }
      socketConnections.current.dm = io(`${SERVER_URL}/dm`, socketOptions);

      // Handle socket connection events (Optional)
      socketConnections.current.dm.on(SocketEvent.connect, () => {
        console.log("Socket connected for DM");
      });
      // Handle socket connection events (Optional)
      socketConnections.current.dm.on(SocketEvent.reConnect, () => {
        console.log("re-connecting...");
        socketConnections.current.dm = io(`${SERVER_URL}/dm`, socketOptions);
        toast.info("connecting...");
      });

      socketConnections.current.dm.on(SocketEvent.disconnect, () => {
        console.log("Socket disconnected");
      });
    }

    // Cleanup: Disconnect socket when account changes or component unmounts
    return () => {
      if (socketConnections.current.dm) {
        socketConnections.current.dm.disconnect();
        socketConnections.current.dm = null;
      }
    };
  }, [socketConnections.current, account]); // Only re-run this effect when the account changes

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
      <Tabs defaultValue="dm">
        <MobileContactList />
        <div className="hidden flex-col gap-8 pt-6 lg:flex lg:flex-1">
          <ContactListHeader />
          <div className="grid w-full justify-items-center">
            <TabsList className="mb-4 flex w-1/2 items-center justify-between gap-5">
              <div className="flax  flex-grow gap-5 "></div>
            </TabsList>
          </div>
          <ContactList />
        </div>
      </Tabs>
      <div className="flex flex-1 px-6 pt-2">
        <NoConversation />
        <ConversationView />
      </div>
    </Fragment>
  );
}

const ContactListHeader = () => {
  const [isDmModal, setIsDmModal] = useState(false);
  const [isOpenGroupModal, setIsOpenGroupModal] = useState(false);
  const handleDmChatModal = () => {
    setIsDmModal(!isDmModal);
  };
  const handleGroupChatModal = () => {
    setIsOpenGroupModal(!isOpenGroupModal);
  };
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl">Messages</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings className="text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem onClick={handleDmChatModal}>
            <CirclePlus className="size-5" />&nbsp;&nbsp;Dm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGroupChatModal}>
            <Users className="size-5" />&nbsp;&nbsp;Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <NewGroupChatModal open={isOpenGroupModal} setOpen={setIsOpenGroupModal} />
      <NewChatModal open={isDmModal} setOpen={setIsDmModal} />
    </div>
  );
};
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
