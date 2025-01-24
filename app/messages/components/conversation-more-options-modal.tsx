import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { CircleMinus, EllipsisVertical, UserCircle, UserRoundMinus } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn, createAvatarName } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";

import { useMessage } from "./provider";
import { AddUserInChatModal } from "./add-user-in-group-modal";

type Props = {};

const ConversationMoreOptionsModal = (props: Props) => {
  const {
    toggleConversationMoreOptions = false,
    handleToggleConversationMoreOptions,
    me={role:"member"},
    selectedMessage: message
  }: any = useMessage("ConversationMoreOptions");

  const { conversationType } = message;
  const { role = "member" } = me;
 

  return (
    <Dialog open={toggleConversationMoreOptions} onOpenChange={handleToggleConversationMoreOptions}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
        </DialogHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
          {conversationType === "group" && role == "admin" && (
            <AddUserInChatModal/>
          )}
          <MemberListModal /> 
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConversationMoreOptionsModal; 
export const MemberListModal = () => {
  const [toggleMembersListModal, setToggleMembersListModal] = useState<boolean>(false);
  const { selectedMessage: message }: any = useMessage("MemberListModal");
  const handleToggleMembersListModal = () => {
    setToggleMembersListModal((prev: boolean) => !prev);
  };
  return (
    <Dialog open={toggleMembersListModal} onOpenChange={handleToggleMembersListModal}>
      <DialogTrigger className="w-full">
        <Button className="w-full">Member List</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users list</DialogTitle>
        </DialogHeader>
        <div className=" max-h-96 overflow-scroll ">
          {message.participants.map((participant: any) => (
            <User participant={participant} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export const User = ({ participant }: any) => {
  const user = participant.participant;
  const role = participant.role;
  return (
    <div
      className={cn(
        " flex cursor-pointer items-center gap-2 rounded-lg p-3 transition-colors duration-300 hover:bg-gray-200 hover:dark:bg-theme-mine-shaft"
      )}
    >
      <>
        <Avatar>
          <AvatarFallback>{createAvatarName(user.username)}</AvatarFallback>
          <AvatarImage
            className="object-cover"
            alt={user?.username}
            src={getAvatarUrl(user?.avatarImageUrl || "")}
          />
        </Avatar>
        <div className="flex flex-grow flex-col">
          <div className="flex flex-row items-center gap-2">
            <span className="text-base font-bold">
              {user?.displayName ||
                user?.username ||
                `${user?.address?.substring(0, 6)}...${user?.address?.slice(-4)}`}
            </span>
          </div>
        </div>
        <span>{role}</span>
        <UserOptions user={user} />
      </>
    </div>
  );
};
export const UserOptions = ({ user }: any) => {
  const {
    selectedMessage: message,
    me,
    handleUnBlock,
    blockChatHandler,
    handleExitGroup
  }: any = useMessage("UserOptions");
  const router = useRouter();
  const { blockList } = message;
  const { isBlocked = false, reportId = null } =
    blockList?.reduce(
      (acc: boolean, item: any) => {
        if (
          item?.reportedUserDetails?.[0]?.address?.toLowerCase() === user?.address?.toLowerCase()
        ) {
          return { isBlocked: true, reportId: item._id };
        }
        return acc;
      },
      { isBlocked: false, reportId: "" }
    ) ?? {};
  const { account } = useActiveWeb3React();
  console.log("account:00", account, me);
  const isMeAdmin =
    user.address?.toLocaleLowerCase() == me?.participant?.address?.toLocaleLowerCase()
      ? true
      : false;
  console.log("isMeAdmin:", isMeAdmin);
  const handleBlockUserOrGroup = async () => {
    if (me?.role != "admin") {
      toast.error("only admin can Block users.");
      return;
    }
    blockChatHandler(null, user.address).then(() => {
      toast.success("user Blocked");
    });
  };
  const handleUnBlockUser = async () => {
    if (me.role != "admin") {
      toast.error("only admin can Block users.");
      return;
    }
    handleUnBlock(reportId);
  };
  const handleRemove = async () => {
    handleExitGroup(user.address.toLowerCase());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="size-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2  rounded-md border border-solid dark:border-theme-mine-shaft-dark dark:bg-theme-background ">
        <DropdownMenuItem
          className="flex gap-1 p-2"
          onClick={() => {
            router.push(`/profile/${user.username || user.address}`);
          }}
        >
          <UserCircle /> <span> Profile</span>
        </DropdownMenuItem>
        {me?.role == "admin" && !isMeAdmin && (
          <DropdownMenuItem
            className="flex gap-1 p-2"
            onClick={() => handleRemove()}
          >
            <CircleMinus /> <span> Remove</span>
          </DropdownMenuItem>
        )}{" "}
        {me?.role == "admin"&& !isMeAdmin  && (
          <DropdownMenuItem
            className="flex gap-1 p-2"
            onClick={isBlocked ? handleUnBlockUser : handleBlockUserOrGroup}
          >
            <UserRoundMinus /> <span>{isBlocked ? "UnBlock" : "Block"}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
