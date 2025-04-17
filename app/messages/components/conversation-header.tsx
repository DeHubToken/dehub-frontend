import { EllipsisVertical } from "lucide-react";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl, getGroupAvatarUrl } from "@/web3/utils/url";

import ConversationOptions from "./conversation-options";
import { useMessage } from "./provider";
import { miniAddress } from "@/libs/strings";

export function ConversationHeader() {
  const { selectedMessage: message } = useMessage("MessageListHeader");
  const { participants, conversationType, groupName = "",iconUrl="" }: any = message; 
  const user = participants[0]?.participant;  
  if (!user) return null;
  if (conversationType == "dm") {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <Avatar>
              <AvatarFallback>{createAvatarName(user.name)}</AvatarFallback>
              <AvatarImage
                className="size-12 object-cover"
                alt={user?.username}
                src={getAvatarUrl(user.avatarImageUrl || "")}
              />
            </Avatar>
            <span className="text-2xl font-bold">
              {" "}
              {user?.displayName ||
                user?.username ||
                   miniAddress(user?.address) }
            </span>
            {!user?.isPro && <AvatarStar />}
            <ConversationOptions type={"dm"} participant={user} />
          </div>
        </div>
        <span className=" ml-12">
              {miniAddress(user?.address) }
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
                src={getGroupAvatarUrl(iconUrl)}
              />
            </Avatar>
            <span className="text-2xl font-bold">{groupName}</span>
            {!user?.isPro && <AvatarStar />}
            <ConversationOptions type="group" participant={user}/>
          </div>
          
        </div>
      </div>
    );
  }
  return <>ERROR!</>;
}
