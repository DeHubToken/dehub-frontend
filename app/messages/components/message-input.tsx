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
    setChatStatus({
      allow: true,
      msg: <></>,
      reportedId: null
    });
    message?.blockList?.find((list: any) => {
      console.log("chatStatus", list);
      if (message.conversationType == "group") {
        if (list?.reportedByDetails[0]?.address == account?.toLowerCase()) {
          setChatStatus({
            allow: false,
            reportedId: list._id,
            msg: (
              <div>
                You block this Group<Button onClick={handleUnBlock}> Un-Block Now</Button>{" "}
              </div>
            )
          });
        }
        return;
      }
      if (list?.reportedByDetails[0]?.address == account?.toLowerCase()) {
        setChatStatus({
          allow: false,
          reportedId: list._id,
          msg: (
            <div>
              You Block This Chat <Button onClick={handleUnBlock}> Un-Block Now</Button>{" "}
            </div>
          )
        });
      } else if (list?.reportedUserDetails[0]?.address == account?.toLowerCase()) {
        setChatStatus({
          allow: false,
          reportedId: list._id,
          msg: <div>You are Blocked by the user.</div>
        });
      }
    });
  }, [message]);

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
