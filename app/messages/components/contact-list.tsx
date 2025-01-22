"use client";

import type { TMessage } from "../utils";

import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Coins, Images } from "lucide-react";

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
  const {
    messages: chats,
    selectedMessageId,
    setSelectedMessageId,
    status
  } = useMessage("ContactList");
  const { account = "" } = useActiveWeb3React();
  const [searchQuery, setSearchQuery] = useState("");
  // Filter and sort messages based on search query
  const filteredChats = chats
    .filter((chat: any) => {
      const { participants, groupName, tips } = chat;
      const user = participants.find((U: any & { address: string }) => {
        return U?.address?.toLowerCase() !== account.toLowerCase();
      });
      return getChatName(user, groupName)?.toLowerCase()?.includes(searchQuery.toLowerCase());
    })
    .sort((a: any, b: any) => {
      // Get the latest tip (if exists) for sorting
      const aTip = a.tips?.length > 0 ? a.tips[0].totalTip : 0; // Assuming tips is an array and we're taking the first tip's total
      const bTip = b.tips?.length > 0 ? b.tips[0].totalTip : 0;

      // First, sort by tip amount (descending)
      if (bTip !== aTip) {
        return bTip - aTip;
      }
      // If tip amounts are equal, then sort by the timestamp of the last message
      return dayjs(a.lastMessageAt).isBefore(dayjs(b.lastMessageAt)) ? 1 : -1;
    });

  function getChatName(user: any, groupName: string) {
    return (
      user?.participant?.displayName ||
      user?.participant?.username ||
      user?.participant?.address ||
      groupName
    );
  }
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
        filteredChats.map((message: any) => {
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
                  tips={message.tips}
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

const UserInfo = ({ participant, isPro = true, lastOnline, lastMessage, tips }: any) => {
  const user = participant.participant;
  const isTiped = tips?.length > 0;
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
        {isTiped && (
          <div className="flex flex-wrap gap-2">
            {tips?.map((tip: any) => (
              <span
                key={tip._id} // Use a unique key to prevent unnecessary re-renders
                className="flex items-center space-x-2 rounded-full  px-3 py-1 text-sm"
              >
                <span>
                  {tip.totalTip} Tip by
                  {tip.userDetails.displayName ||
                    tip.userDetails.username ||
                    tip.userDetails.address}{" "}
                </span>
              </span>
            ))}
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500">{contentWords(lastMessage?.content, 0, 6)}</p>
        </div>
        <MessageMetaData lastMessage={lastMessage}/>

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
          <p className="text-sm text-gray-500">{contentWords(lastMessage?.content, 0, 6)}</p>
        </div>
        <MessageMetaData lastMessage={lastMessage}/>
      </div>
    </>
  );
};

const contentWords = (content: string, start: number, end: number) => {
  if (!content) {
    return "";
  }
  return (
    content?.split(" ").slice(start, end).join(" ") +
    (content?.split(" ").length > end ? "..." : "")
  );
};

const MessageMetaData = ({ lastMessage }:any) => {
  return (
    <div className="flex gap-5">
      {lastMessage.msgType == "media" && <Images />}
      {lastMessage.isPaid && <Coins />}
    </div>
  );
};
