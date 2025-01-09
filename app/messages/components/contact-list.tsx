"use client";

import type { TMessage } from "../utils";

import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn, createAvatarName } from "@/libs/utils";

import { getAvatarUrl, getGroupAvatarUrl } from "@/web3/utils/url";

import { useMessage } from "./provider";
import { ContactSkeleton } from "./skeleton";

dayjs.extend(relativeTime);

type ContactListProps = React.ComponentProps<"div"> & {
  onMessageSelect?: (id: string) => void;
};

export function ContactList(props: ContactListProps) {
  const { onMessageSelect, ...rest } = props;
  const { messages, selectedMessageId, setSelectedMessageId, status } = useMessage("ContactList");
  const { account = "" } = useActiveWeb3React();
  const [searchQuery, setSearchQuery] = useState(""); 
  // Filter and sort messages based on search query
  const filteredMessages = messages
    .filter((message: any) => {
      const { participants, groupName, conversationType } = message;
      let name = "";
      if (conversationType === "dm") {
        // Find the user that is not the current account
        const user = participants.find((U: any & { address: string }) => {
          return U?.address?.toLowerCase() !== account.toLowerCase();
        });
        // Set the name of the other user
        name =
          user?.participant?.displayName ||
          user?.participant?.username ||
          user?.participant?.address;
      } else if (conversationType === "group") {
        // Use the groupName for group chats
        name = groupName;
      }
      // Return true if the name includes the search query (case insensitive)
      return name?.toLowerCase()?.includes(searchQuery.toLowerCase());
    })
    .sort((a: any, b: any) => {
      const aLastMessage = a.messages?.length > 0 ? a.messages[a.messages.length - 1] : {};
      const bLastMessage = b.messages?.length > 0 ? b.messages[b.messages.length - 1] : {};
      // Sort messages by the timestamp of the last message
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
          className="w-full rounded-lg border border-gray-300 p-2"
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
                <UserInfo
                  participant={participants[0]}
                  lastMessage={lastMessage}
                  // lastOnline={}
                />
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
  const user = participant.participant;
  return (
    <>
      <Avatar>
        <AvatarFallback>{createAvatarName(user?.username)}</AvatarFallback>
        <AvatarImage
          className="object-cover"
          alt={user?.username}
          src={getAvatarUrl(user.avatarImageUrl || "")}
        />
      </Avatar>
      <div className="flex flex-col ">
        <div className="flex flex-row items-center gap-2">
          <span className="text-base font-bold">
            {user?.displayName ||
              user?.username ||
              `${user?.address?.substring(0, 6)}...${user?.address?.slice(-4)}`}
          </span>
          {isPro && <AvatarStar />}
          <span className="text-xs text-gray-500">{dayjs(lastMessage?.createdAt).fromNow()}</span>
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
          <span className="text-xs text-gray-500">{dayjs(lastMessage.createdAt).fromNow()}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{lastMessage?.content}</p>
        </div>
      </div>
    </>
  );
};
