import React from "react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import dayjs from "dayjs";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl, getGroupAvatarUrl } from "@/web3/utils/url";

import { useMessage } from "./provider";

const BlockModal = () => {
  const {
    toggleUserReport: isOpen,
    handleToggleUserReport,
    selectedMessage: conversation
  }: any = useMessage("BlockModal");
  const { participants } = conversation;
  return (
    <Dialog open={isOpen} onOpenChange={handleToggleUserReport}>
      <DialogContent>
        <h2 className="mb-4 text-lg font-bold">Block User</h2>

        {conversation ? (
          <div className="space-y-4">
            <UserInfo participant={participants[0]} />
            are you sure do you went to block
          </div>
        ) : (
          <p>No conversation selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BlockModal;

const UserInfo = ({ participant, isPro = true, lastOnline, lastMessage }: any) => {
  return (
    <>
      <Avatar>
        <AvatarFallback>{createAvatarName(participant.participant)}</AvatarFallback>
        <AvatarImage
          className="object-cover"
          alt={participant?.username}
          src={getAvatarUrl(participant.avatarUrl || "")}
        />
      </Avatar>
      <div className="flex flex-col ">
        <div className="flex flex-row items-center gap-2">
          <span className="text-base font-bold">
            {participant?.displayName ||
              participant?.username ||
              `${participant?.address.substring(0, 6)}...${participant?.address.slice(-4)}`}
          </span>
          {isPro && <AvatarStar />}
          <span className="text-xs text-gray-500">{dayjs(lastOnline).fromNow()}</span>
        </div>

        <div>
          <p className="text-sm text-gray-500">{lastMessage?.content}</p>
        </div>
      </div>
    </>
  );
};

const GroupInfo = ({ group, isPro = false, lastOnline = true, lastMessage }: any) => {
  return (
    <>
      <Avatar>
        <AvatarFallback>{createAvatarName(group?.groupName)}</AvatarFallback>
        <AvatarImage
          className="object-cover"
          alt={group?.groupName}
          src={getGroupAvatarUrl(group?.avatarUrl || "")}
        />
      </Avatar>
      <div className="flex flex-col ">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{group?.groupName}</span>
          {isPro && <AvatarStar />}
          <span className="text-xs text-gray-500">{dayjs(lastOnline).fromNow()}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{lastMessage?.content}</p>
        </div>
      </div>
    </>
  );
};
