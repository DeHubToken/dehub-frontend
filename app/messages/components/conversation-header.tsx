import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { useMessage } from "./provider";

export function ConversationHeader() {
  const { selectedMessage: message } = useMessage("MessageListHeader");
  if (!message) return null;
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{createAvatarName(message.name)}</AvatarFallback>
          <AvatarImage className="size-12 object-cover" src={message.avatar} alt={message.name} />
        </Avatar>
        <span className="text-2xl font-bold">{message.name}</span>
        {message.isPro && <AvatarStar />}
      </div>
    </div>
  );
}
