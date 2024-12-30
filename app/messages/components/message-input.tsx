import { useCallback, useEffect, useState } from "react";
import { ImagePlay, ImagePlus, Paperclip, SendHorizonal, Smile } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { useMessage } from "./provider";

export function MessageInput() {
  const {
    sendMessage,
    setInput,
    input,
    handleToggleEmoji,
    handleToggleGif,
    handleToggleMedia,
    handleUnBlock,
    selectedMessage: message
  }: any = useMessage("MessageList");

  const [chatStatus, setChatStatus] = useState({
    reportedId: null,
    allow: true,
    msg: <></>
  });
  console.log("chatStatus", chatStatus);
  const sendHandler = useCallback(() => {
    if (input.trim() === "") {
      toast.error("Please enter a message!");
      return;
    }
    sendMessage(input);
    setInput("");
  }, [input, sendMessage]);
  const { account } = useActiveWeb3React();

  useEffect(() => {
    if (!message?.blockList || !account) return;

    const accountLower = account.toLowerCase();
    let chatStatus = {
      allow: true,
      msg: <></>,
      reportedId: null
    };

    for (const list of message.blockList) {
      const reportedByAddress = list?.reportedByDetails[0]?.address?.toLowerCase();
      const reportedUserAddress = list?.reportedUserDetails[0]?.address?.toLowerCase();

      // Check for group chat blocking logic
      if (message.conversationType === "group") {
        if (!list.reportedUser && reportedByAddress === accountLower) {
          chatStatus = {
            allow: false,
            reportedId: list._id,
            msg: (
              <div>
                You block this Group <Button onClick={handleUnBlock}>Un-Block Now</Button>
              </div>
            )
          };
          break; // Exit the loop early since we've found a match
        }

        if (reportedUserAddress === accountLower) {
          chatStatus = {
            allow: false,
            reportedId: list._id,
            msg: <div>You are Blocked by the Admin.</div>
          };
          break; // Exit early as the status is determined
        }
      } else {
        // Check for non-group chat blocking logic
        if (reportedByAddress === accountLower) {
          chatStatus = {
            allow: false,
            reportedId: list._id,
            msg: (
              <div>
                You Block This Chat <Button onClick={handleUnBlock}>Un-Block Now</Button>
              </div>
            )
          };
          break; // Exit early as the status is determined
        }

        if (reportedUserAddress === accountLower) {
          chatStatus = {
            allow: false,
            reportedId: list._id,
            msg: <div>You are Blocked by the user.</div>
          };
          break; // Exit early as the status is determined
        }
      }
    }

    // If no blocking is detected, default status
    setChatStatus(chatStatus);
  }, [message, account, handleUnBlock]);

  if (!chatStatus.allow) {
    return (
      <div className="sticky bottom-12 flex h-[calc((80/16)*1rem)] w-full items-center gap-5 rounded-lg border px-5 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
        {chatStatus.msg}
      </div>
    );
  }
  return (
    <>
      <div className="sticky bottom-12 flex h-[calc((80/16)*1rem)] w-full items-center gap-5 rounded-lg border px-5 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
        <Input
          placeholder="Type here..."
          value={input}
          className="h-10 rounded-full text-sm placeholder:text-sm dark:bg-theme-mine-shaft"
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex flex-1 items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                <ImagePlus className="size-6 text-gray-600 dark:text-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-wrap gap-2">
              <DropdownMenuItem onClick={handleToggleEmoji}>
                <Smile className="size-5" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleGif}>
                <ImagePlay className="size-5" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleMedia}>
                <Paperclip className="size-5" />
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={handleToggleMedia}>
                <PiggyBank className="size-5" />
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="gradientOne" className="size-10 p-0" onClick={sendHandler}>
            <SendHorizonal className="size-5 text-white" />
          </Button>
        </div>
      </div>
    </>
  );
}
