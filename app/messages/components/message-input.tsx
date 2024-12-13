import { useState } from "react";
import { ImagePlus, SendHorizonal, Settings } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useMessage } from "./provider";

export function MessageInput() {
  const { selectedMessage: message, sendMessage } = useMessage("MessageList");
  const [msg, setMsg] = useState("");
  const sendHandler = () => {
    if (msg.trim() == "" || msg == null) {
      toast.error("Please enter message!");
      return
    }
    sendMessage(msg);
    setMsg("");
  };
  return (
    <div className="sticky bottom-12 flex h-[calc((80/16)*1rem)] w-full items-center gap-5 rounded-lg border px-5 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
      <Input
        placeholder="Type here..."
        value={msg}
        className="h-10 rounded-full text-sm placeholder:text-sm dark:bg-theme-mine-shaft"
        onChange={(e) => setMsg(e.target.value)}
      />

      <div className="flex flex-1 items-center gap-3">
        <button className="size-10">
          <ImagePlus className="size-6 text-gray-600 dark:text-gray-300" />
        </button>
        <Button variant="gradientOne" className="size-10 p-0" onClick={sendHandler}>
          <SendHorizonal className="size-5 text-white" />
        </Button>
      </div>
    </div>
  );
}
