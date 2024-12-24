import { EllipsisVertical } from "lucide-react";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl, getGroupAvatarUrl } from "@/web3/utils/url";

import ConversationOptions from "./conversation-options";
import { useMessage } from "./provider";

export function ConversationHeader() {
  const { selectedMessage: message } = useMessage("MessageListHeader");
  const { participants, conversationType, groupName = "" }: any = message;

  const participant = participants[0];
  if (!participant) return null;
  if (conversationType == "dm") {
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
            <ConversationOptions participant={participant}/>
          </div>
        </div>
        <span className=" ml-12">
          {`${participant?.address.substring(0, 6)}...${participant?.address.slice(-4)}`}
        </span>
      </div>
    );
  }
  if (conversationType == "group") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{createAvatarName(groupName)}</AvatarFallback>
              <AvatarImage
                className="size-12 object-cover"
                alt={groupName}
                src={getGroupAvatarUrl("")}
              />
            </Avatar>
            <span className="text-2xl font-bold">{groupName}</span>
            {!participant?.isPro && <AvatarStar />}
          </div>
        </div>
      </div>
    );
  }
  return <>ERROR!</>;
}
