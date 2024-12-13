import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";

import { useMessage } from "./provider";

export function ConversationHeader() {
  const { selectedMessage: message } = useMessage("MessageListHeader");
  const { participant }: any = message;
  if (!participant) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{createAvatarName(participant.name)}</AvatarFallback>
            <AvatarImage
              className="size-12 object-cover"
              alt={participant?.username}
              src={getAvatarUrl(participant.avatarUrl || "")}
            />
          </Avatar>
          <span className="text-2xl font-bold">
            {" "}
            {participant?.displayName ||
              participant?.username ||
              `${participant?.address.substring(0, 6)}...${participant?.address.slice(-4)}`}
          </span>
          {!participant?.isPro && <AvatarStar />}
        </div>
      </div>
      <span className=" ml-12">
        {`${participant?.address.substring(0, 6)}...${participant?.address.slice(-4)}`}
      </span>
    </div>
  );
}
