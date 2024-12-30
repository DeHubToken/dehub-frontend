import type { TMessage } from "../utils";

import Image from "next/image";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import MediaView from "./media-view";

export function IncomingMessage(props: {
  message: {
    createdAt: string;
    content: string;
    author: string;
    avatar: string;
    mediaUrls: string[];
    msgType: string;
  };
}) {
  const { message }: any = props;
  return (
    <div className="flex w-full justify-start">
      <div className="flex max-w-96 flex-col items-end gap-1">
        <span className="pr-4 text-xs text-gray-400">{dayjs(message.createdAt).fromNow()}</span>
        <div className="flex items-end gap-3">
          <Avatar className="size-8">
            <AvatarFallback>{createAvatarName(message?.author)}</AvatarFallback>
            <AvatarImage className="object-cover" src={message?.avatar} alt={message?.author} />
          </Avatar>
          <div className="rounded-r-[20px] rounded-tl-[20px] px-4 py-3 dark:bg-theme-mine-shaft-dark">
            <p className="text-sm dark:text-gray-200">{message?.content}</p>
            <MediaView
              isLocked={false}
              isPaid={false}
              amount={100}
              token={"0x0001"}
              chainId={97}
              mediaUrls={message.mediaUrls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
