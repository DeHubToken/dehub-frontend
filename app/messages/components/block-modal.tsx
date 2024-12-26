import React, { useState } from "react";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { toast } from "sonner";

import { AvatarStar } from "@/components/icons/avatar-star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { createAvatarName } from "@/libs/utils";

import { blockDM } from "@/services/user-report";

import { getAvatarUrl, getGroupAvatarUrl } from "@/web3/utils/url";

import { useMessage } from "./provider";

const BlockModal = () => {
  const {
    toggleUserReport: isOpen,
    handleToggleUserReport,
    selectedMessage: conversation
  }: any = useMessage("BlockModal");
  const { account } = useActiveWeb3React();
  const [reason, setReason] = useState("");

  const { participants } = conversation;

  const handleBlock = async () => {
    if (!account) {
      toast.error("please connect to wallet.");
      return;
    }
    toast.info("requesting...");
    const { data ,error }: any = await blockDM({
      conversationId: conversation._id,
      reason,
      address: account?.toLowerCase()
    });
    if (error) {
      toast.error(error);
    }
    setReason("");
    handleToggleUserReport();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleToggleUserReport}>
      <DialogContent>
        <h2 className="mb-4 text-lg font-bold">Block</h2>

        {conversation ? (
          <>
            {conversation.conversationType === "dm" && (
              <div className="space-y-4">
                <UserInfo participant={participants[0]} />
                <p>Are you sure you want to block this user?</p>
              </div>
            )}
            {conversation.conversationType === "group" && (
              <div className="space-y-4">
                <GroupInfo group={conversation} />
                <p>Are you sure you want to block this group?</p>
              </div>
            )}
            <Textarea
              placeholder="Reason for blocking (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-4"
            />

            <DialogFooter className="mt-4 flex justify-end space-x-2">
              <Button variant="secondary" onClick={handleToggleUserReport}>
                Cancel
              </Button>
              <Button variant="ghost" onClick={handleBlock}>
                Block
              </Button>
            </DialogFooter>
          </>
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
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarFallback>{createAvatarName(participant.participant)}</AvatarFallback>
        <AvatarImage
          className="object-cover"
          alt={participant?.username}
          src={getAvatarUrl(participant.avatarUrl || "")}
        />
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
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
    </div>
  );
};

const GroupInfo = ({ group, isPro = false, lastOnline = true, lastMessage }: any) => {
  return (
    <div className="flex items-start space-x-4">
      <Avatar>
        <AvatarFallback>{createAvatarName(group?.groupName)}</AvatarFallback>
        <AvatarImage
          className="object-cover"
          alt={group?.groupName}
          src={getGroupAvatarUrl(group?.avatarUrl || "")}
        />
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{group?.groupName}</span>
          {isPro && <AvatarStar />}
          <span className="text-xs text-gray-500">{dayjs(lastOnline).fromNow()}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{lastMessage?.content}</p>
        </div>
      </div>
    </div>
  );
};
