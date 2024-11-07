"use client";

import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Settings } from "lucide-react";

import { cn } from "@/libs/utils";

import { NoConversation } from "./components/common";
import { ContactList } from "./components/contact-list";
import { ConversationView } from "./components/conversation-view";
import { MobileContactList } from "./components/mobile-contact-list";
import { MessageProvider } from "./components/provider";

/* ----------------------------------------------------------------------------------------------- */

dayjs.extend(relativeTime);

export default function MessagesScreen() {
  return (
    <MessageProvider>
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
