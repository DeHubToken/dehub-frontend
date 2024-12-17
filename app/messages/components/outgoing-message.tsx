import type { TMessage } from "../utils";

import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";

export function OutgoingMessage(props: {
  message: { content: string; author: string; avatar: string };
}) {
  const { message } = props;
  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-96 flex-col items-end gap-1">
        <span className="pr-4 text-xs text-gray-400">
          {
            // dayjs(message.date).fromNow()
          }
          dayjs
        </span>
        <div className="flex items-end gap-3">
          <div className="rounded-l-[20px] rounded-tr-[20px] px-4 py-3 dark:bg-theme-mine-shaft-dark">
            <p className="text-sm dark:text-gray-200">{message.content}</p>
          </div>
          <Avatar className="size-8">
            <AvatarFallback>{createAvatarName(message?.author)}</AvatarFallback>
            <AvatarImage
              className="object-cover"
              src={getAvatarUrl(message?.avatar)}
              alt={message.author}
            />
          </Avatar>
        </div>
      </div>
    </div>
  );
}
