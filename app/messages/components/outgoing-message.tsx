import type { TMessage } from "../utils";

import Image from "next/image";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import dayjs from "dayjs";
import { EllipsisVertical, Trash } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";

import MediaView from "./media-view";
import { useMessage } from "./provider";

export function OutgoingMessage(props: {
  message: {
    _id: string;
    createdAt: Date;
    content: string;
    author: string;
    avatar: string;
    uploadStatus: string;
    mediaUrls: {
      url: string;
      type: string;
      mimeType: string;
    }[];
    msgType: string;
    isPaid: boolean;
    isUnLocked: boolean;
  };
}) {
  const { message } = props;
  const { deleteMessage, selectedMessage }: any = useMessage("OutgoingMessage");
  const dmId = selectedMessage._id;;
  return (
    <div className="flex w-full justify-end">
      <div className="flex max-w-96 flex-col items-end gap-1">
        <span className="pr-4 text-xs text-gray-400">{dayjs(message.createdAt).fromNow()}</span>
        <div className="flex items-end gap-3">
          <div className="rounded-l-[20px] rounded-tr-[20px] px-4 py-3 dark:bg-theme-mine-shaft-dark">
            <p className="text-sm dark:text-gray-200">{message.content}</p>

            {message?.msgType !== "msg" && (
              <>
                {/* If upload is pending, show loading */}
                {message.uploadStatus === "pending" && <Spinner />}
                <MediaView mediaUrls={message.mediaUrls} />
              </>
            )}
            {/* Paid Content Notice */}
            {message.isPaid && !message.isUnLocked && (
              <div className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                <span>🔒 You shared paid content</span>
              </div>
            )}

            {/* Unlocked Content Notice */}
            {message.isPaid && message.isUnLocked && (
              <div className="mt-2 text-xs text-green-500 dark:text-green-400">
                <span>✅ User Unlocked the content.</span>
              </div>
            )}
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVertical className="size-6 text-gray-600 dark:text-gray-300" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-wrap gap-2">
          <DropdownMenuItem onClick={() => deleteMessage(message._id,dmId)}>
            <Trash className="size-5" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
