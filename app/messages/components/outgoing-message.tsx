import type { TMessage } from "../utils";

import Image from "next/image";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";
import MediaView from "./media-view";

export function OutgoingMessage(props: {
  message: {
    createdAt:Date,
    content: string;
    author: string;
    avatar: string;
    mediaUrls: {
      url: string;
      type: string;
      mimeType: string;
    }[];
    msgType: string;
  };
}) {
  const { message } = props;
  console.log("this.message", message);
  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-96 flex-col items-end gap-1">
        <span className="pr-4 text-xs text-gray-400">
          {
            dayjs(message.createdAt).fromNow()
          }
           
        </span>
        <div className="flex items-end gap-3">
          <div className="rounded-l-[20px] rounded-tr-[20px] px-4 py-3 dark:bg-theme-mine-shaft-dark">
            <p className="text-sm dark:text-gray-200">{message.content}</p> 
            <MediaView     mediaUrls={message.mediaUrls} />
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
