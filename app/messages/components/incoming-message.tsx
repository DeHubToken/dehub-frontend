import type { TMessage } from "../utils";

import Image from "next/image";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { supportedTokens } from "@/configs";

import MediaView from "./media-view";
import { useMessage } from "./provider";

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
            {!message?.isPaid && <MediaView mediaUrls={message.mediaUrls} />}
            {message?.isPaid && <PayView message={message} />}
          </div>
        </div>
      </div>
    </div>
  );
}

const PayView = ({ message }: any) => {
  const { purchaseOptions } = message;
  console.log("message", message);
  const { selectedMessage }: any = useMessage("PayView");
  console.log("selectedMessage", selectedMessage);
  const sender = selectedMessage.participants.find(({ participant, role }: any) => {
    console.log("sender",  message.sender);
    console.log("sender participant",  participant);
    return participant === message.sender._id;
  });

  // console.log("sender", sender);
  return (
    <div className="shadow-lg mx-auto max-w-md rounded-lg bg-gray-800 p-6 text-white">
      <h2 className="mb-4 text-2xl font-semibold">
        To see this media, you need to pay some tokens:
      </h2>

      {purchaseOptions.map((pricing:any, index:any) => {
        const token = supportedTokens.find((a) => a.address == pricing.address);
        return (
          <div key={index} className="mb-4 rounded-lg bg-gray-700 p-4">
            <p className="flex items-center space-x-2 text-sm">
              <span>Token:</span>
              <img src={token?.iconUrl} height={25} width={25} alt={token?.label} />
              <span>{token?.label}</span>
            </p>
            <p className="mt-2 text-lg font-medium">Amount: {pricing.amount}</p>
          </div>
        );
      })}

      <button
        className="mt-4 w-full rounded-lg bg-blue-500 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
        onClick={() => {}}
      >
        Pay Now
      </button>
    </div>
  );
};
