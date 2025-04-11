import { useCallback, useEffect, useState } from "react";
import { ImagePlay, ImagePlus, Paperclip, Coins, SendHorizonal, Smile } from "lucide-react";
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
import { showToast } from "@/libs/toast";

export function MessageInput() {
  const {
    sendMessage,
    setInput,
    chatStatus,
    setChatStatus,
    input,
    handleToggleEmoji,
    handleToggleGif,
    handleToggleMedia,
    handleToggleTipModal,
    handleUnBlock,
    selectedMessage: message
  }: any = useMessage("MessageList");
  const isDmChat = message.conversationType == "dm";
  const isGroupChat = message.conversationType == "group";

  const sendHandler = useCallback(() => {
    if (input.trim() === "") {
      showToast("error","Please enter a message!","top-right");
      return;
    }
    sendMessage(input);
    setInput("");
  }, [input, sendMessage]);
  const { account } = useActiveWeb3React();

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent a new line
      if (input.trim()) {
        sendMessage(input);
        setInput("");
      }
    }
  };
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
                You block this Group{" "}
                <Button onClick={() => handleUnBlock(list._id)}>Un-Block Now</Button>
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
      } else if (message.conversationType === "dm") {
        // Check for non-group chat blocking logic
        if (reportedByAddress === accountLower) {
          chatStatus = {
            allow: false,
            reportedId: list._id,
            msg: (
              <div>
                You Block This Chat{" "}
                <Button onClick={() => handleUnBlock(list._id)}>Un-Block Now</Button>
              </div>
            )
          };
          break; // Exit early as the status is determined
        } else {
          chatStatus = {
            allow: false,
            reportedId: list._id,
            msg: <div>You are Blocked by the user.</div>
          };
        }
      }
    }

    // If no blocking is detected, default status
    setChatStatus(chatStatus);
  }, [message]);

  if (!chatStatus.allow) {
    return (
      <div className="sticky bg-gray-100  bottom-12 flex h-[calc((80/16)*1rem)] w-full items-center gap-5 rounded-lg border px-5 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
        {chatStatus.msg}
      </div>
    );
  }
  return (
    <>
      <div className="sticky bg-gray-100  bottom-12 flex h-[calc((80/16)*1rem)] w-full items-center gap-5 rounded-lg border px-5 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
        <Input
          placeholder="Type here..."
          value={input}
          onKeyDown={handleKeyDown}
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
              {isDmChat && (
                <DropdownMenuItem onClick={handleToggleTipModal}>
                  <Coins className="size-5" />
                </DropdownMenuItem>
              )}
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
