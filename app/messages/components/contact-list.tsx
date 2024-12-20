"use client";

import type { TMessage } from "../utils";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, createAvatarName } from "@/libs/utils";
import { getAvatarUrl, getGroupAvatarUrl } from "@/web3/utils/url";
import { useMessage } from "./provider";
import { ContactSkeleton } from "./skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";

dayjs.extend(relativeTime);

type ContactListProps = React.ComponentProps<"div"> & {
  onMessageSelect?: (id: string) => void;
};

export function ContactList(props: ContactListProps) {
  const { onMessageSelect, ...rest } = props;
  const { messages, selectedMessageId, setSelectedMessageId, status } = useMessage("ContactList");

  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort messages based on search query
  const filteredMessages = messages
    .filter((message: any) => {
      const { participants, groupName } = message;
      const lastMessage = message.messages?.length > 0 ? message.messages[message.messages.length - 1] : {};
      const participantName = participants?.[0]?.displayName || participants?.[0]?.username || groupName;
      return participantName.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a: any, b: any) => {
      const aLastMessage = a.messages?.length > 0 ? a.messages[a.messages.length - 1] : {};
      const bLastMessage = b.messages?.length > 0 ? b.messages[b.messages.length - 1] : {};
      return dayjs(bLastMessage.timestamp).isBefore(dayjs(aLastMessage.timestamp)) ? 1 : -1;
    });

  return (
    <div
      {...rest}
      className={cn(
        "flex max-h-[calc(100vh-80px-24px-32px)] flex-col gap-3 overflow-y-scroll",
        rest.className
      )}
    >
      {/* Search Box */}
      <div className="mb-3 p-2">
        <Input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300"
        />
      </div>

      {status === "loading" &&
        Array.from({ length: 10 }).map((_, index) => <ContactSkeleton key={index} />)}

      {status === "success" &&
        filteredMessages.map((message: any) => {
          const { participants, messages, conversationType } = message;
          const lastMessage = messages?.length > 0 ? messages[messages?.length - 1] : {};
          return (
            <div
              key={message._id}
              className={cn(
                "relative flex  cursor-pointer items-center gap-2 rounded-lg p-3 transition-colors duration-300 hover:bg-gray-200 hover:dark:bg-theme-mine-shaft",
                selectedMessageId === message._id && "bg-gray-200 dark:bg-theme-mine-shaft"
              )}
              onClick={() => {
                setSelectedMessageId(message._id);
                onMessageSelect?.(message._id);
              }}
            >
              {message?.conversationType == "dm" && (
                <UserInfo participant={participants[0]} lastMessage={lastMessage} />
              )}
              {message?.conversationType == "group" && (
                <GroupInfo group={message} lastMessage={lastMessage} />
              )}

              {message.isOnline && (
                <div className="absolute right-4 top-4 size-1 rounded-full bg-green-400" />
              )}
            </div>
          );
        })}
    </div>
  );
}

const UserInfo = ({ participant, isPro = true, lastOnline, lastMessage }: any) => {
  return (
    <>
      <Avatar>
        <AvatarFallback>{createAvatarName(participant.participant)}</AvatarFallback>
        <AvatarImage
          className="object-cover"
          alt={participant?.username}
          src={getAvatarUrl(participant.avatarUrl || "")}
        />
      </Avatar>
      <div className="flex flex-col ">
        <div className="flex flex-row items-center gap-2">
          <span className="text-base font-bold">
            {participant?.displayName ||
              participant?.username ||
              `${participant?.address.substring(0, 6)}...${participant?.address.slice(-4)}`}
          </span>
          {isPro && <AvatarStar />}
          <span className="text-xs text-gray-500">{dayjs(lastOnline).fromNow()}</span>
        </div>

        <div>
          <p className="text-sm text-gray-500">{lastMessage?.content}</p>
        </div>
      </div>
    </>
  );
};

const GroupInfo = ({ group, isPro = false, lastOnline = true, lastMessage }: any) => {
  return (
    <>
      <Avatar>
        <AvatarFallback>{createAvatarName(group?.groupName)}</AvatarFallback>
        <AvatarImage
          className="object-cover"
          alt={group?.groupName}
          src={getGroupAvatarUrl(group?.avatarUrl || "")}
        />
      </Avatar>
      <div className="flex flex-col ">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{group?.groupName}</span>
          {isPro && <AvatarStar />}
          <span className="text-xs text-gray-500">{dayjs(lastOnline).fromNow()}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{lastMessage?.content}</p>
        </div>
      </div>
    </>
  );
};
