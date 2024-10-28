"use client";

import type { TMessage } from "../utils";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn, createAvatarName } from "@/libs/utils";

import { useMessage } from "./provider";
import { ContactSkeleton } from "./skeleton";

dayjs.extend(relativeTime);

type ContactListProps = React.ComponentProps<"div"> & {
  onMessageSelect?: (id: string) => void;
};

export function ContactList(props: ContactListProps) {
  const { onMessageSelect, ...rest } = props;
  const { messages, selectedMessageId, setSelectedMessageId, status } = useMessage("ContactList");
  return (
    <div
      {...rest}
      className={cn(
        "flex max-h-[calc(100vh-80px-24px-32px)] flex-col gap-3 overflow-y-scroll",
        rest.className
      )}
    >
      {status === "loading" &&
        Array.from({ length: 10 }).map((_, index) => <ContactSkeleton key={index} />)}

      {status === "success" &&
        messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "relative flex cursor-pointer items-center gap-2 rounded-lg p-3 transition-colors duration-300 hover:dark:bg-theme-mine-shaft",
              selectedMessageId === message.id && "dark:bg-theme-mine-shaft"
            )}
            onClick={() => {
              setSelectedMessageId(message.id);
              onMessageSelect?.(message.id);
            }}
          >
            <Avatar>
              <AvatarFallback>{createAvatarName(message.name)}</AvatarFallback>
              <AvatarImage className="object-cover" src={message.avatar} alt={message.name} />
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold">{message.name}</span>
                  {message.isPro && <AvatarStar />}
                </div>
                <span className="text-xs text-gray-500">{dayjs(message.lastOnline).fromNow()}</span>
              </div>

              <div>
                <p className="text-sm text-gray-500">{message.message}</p>
              </div>
            </div>

            {message.isOnline && (
              <div className="absolute right-4 top-4 size-1 rounded-full bg-green-400" />
            )}
          </div>
        ))}
    </div>
  );
}
