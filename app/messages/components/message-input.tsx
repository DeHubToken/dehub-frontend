import { ImagePlus, SendHorizonal, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MessageInput() {
  return (
    <div className="sticky bottom-12 flex h-[calc((80/16)*1rem)] w-full items-center gap-5 rounded-lg border px-5 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
      <Input
        placeholder="Type here..."
        className="h-10 rounded-full text-sm placeholder:text-sm dark:bg-theme-mine-shaft"
      />

      <div className="flex flex-1 items-center gap-3">
        <button className="size-10">
          <ImagePlus className="size-6 text-gray-600 dark:text-gray-300" />
        </button>
        <Button variant="gradientOne" className="size-10 p-0">
          <SendHorizonal className="size-5 text-white" />
        </Button>
      </div>
    </div>
  );
}
