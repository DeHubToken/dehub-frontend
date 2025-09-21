import { History, Info } from "lucide-react";

import { Send } from "@/components/icons/send";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input.new";

import { BotChatImage, BotMessage, UserMessage } from "./message";

export function Chat() {
  return (
    <div className="order-1 h-full flex-[50%] overflow-hidden rounded-3xl border border-neutral-800 p-4 xl:order-2">
      <div className="flex items-center justify-between p-4">
        <h3 className="text-xl font-semibold text-neutral-400">Chat bot</h3>

        <div className="flex items-center gap-4">
          <History className="size-6 text-gray-200" />
          <Info className="size-6 text-gray-200" />
        </div>
      </div>

      <div className="mt-4 flex min-w-[500px] items-center justify-between overflow-x-auto">
        {suggestedPrompts.map((prompt) => (
          <button key={prompt} className="rounded-lg bg-neutral-800 p-4 text-base text-neutral-500">
            {prompt}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="mt-4 flex h-full max-h-[calc(100%-32px-60px-56px-12px-48px)] flex-col gap-6 overflow-y-auto p-3">
        <UserMessage>
          <span>Generate an image showing a creator working with AI tools</span>
        </UserMessage>
        <BotMessage>
          <span>
            I've generated an image based on your description. You can regenerate it or apply
            different styles using the controls below.
          </span>
        </BotMessage>
        <BotChatImage src="https://images.unsplash.com/photo-1758366278313-70468ec8cb2c" />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <Input placeholder="Ask me anything..." className="h-12 flex-1 rounded-full" />
        <Button variant="gradientOne" className="max-w-[72px] flex-1">
          <Send />
        </Button>
      </div>
    </div>
  );
}

const suggestedPrompts = ["Get post ideas", "Generate images", "Predict performance"];
