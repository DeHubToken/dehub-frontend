import React, { useEffect, useState } from "react";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useUser } from "@/hooks/use-user";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { miniAddress } from "@/libs/strings";
import { cn, createAvatarName } from "@/libs/utils";

import { updateGroupInfo } from "@/services/dm";

import { getAvatarUrl, getGroupAvatarUrl } from "@/web3/utils/url";
import { getSignInfo } from "@/web3/utils/web3-actions";

import { AddUserInChatModal } from "./add-user-in-group-modal";
import { useMessage } from "./provider";

type Props = {};

const ConversationMoreOptionsModal = (props: Props) => {
  const {
    toggleConversationMoreOptions = false,
    handleToggleConversationMoreOptions,
    me = { role: "member" },
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
          <MemberListModal />
          {conversationType === "group" && role == "admin" && <AddUserInChatModal />}
          {conversationType === "group" && role == "admin" && <UpdateGroupIcon />}
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


export const UpdateGroupIcon = () => {
  const [toggleGroupIconNameModal, setToggleGroupIconNameModal] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { account, library } = useActiveWeb3React();
  const [originalValues, setOriginalValues] = useState({
    title: "",
    description: "",
    iconUrl: ""
  });

  const {
    toggleConversationMoreOptions = false,
    handleToggleConversationMoreOptions,
    me = { role: "member" },
    selectedMessage: message
  }: any = useMessage("UpdateGroupIcon");

  const { role = "member" } = me;
  const isAdmin = role === "admin";

  useEffect(() => {
    if (message) {
      const initGroupName = message?.groupName || "";
      const initDescription = message?.description || "";
      const initIcon = "";

      setGroupName(initGroupName);
      setDescription(initDescription);
      setPreviewUrl(initIcon);

      setOriginalValues({
        title: initGroupName,
        description: initDescription,
        iconUrl: initIcon
      });
    }
  }, [message]);

  const handleToggleGroupIconNameModal = () => {
    setToggleGroupIconNameModal((prev) => !prev);
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) return;
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleResetForm = () => {
    setGroupName(originalValues.title);
    setDescription(originalValues.description);
    setPreviewUrl(originalValues.iconUrl);
    setIconFile(null);
    setIsLoading(false);
  };

  const handleUpdateGroupInfo = async () => {
    if (!isAdmin || !message?._id) return;
    if (!account) {
      toast.error("please connect wallet.");
      return;
    }

    setIsLoading(true); 
    const sig = await getSignInfo(library, account);  
    const formData = new FormData();
    formData.append("groupId", message._id);
    formData.append("groupName", groupName);
    formData.append("timestamp", sig.timestamp);
    formData.append("sig", sig.sig);
    formData.append("description", description);
    if (iconFile) {
      formData.append("files", iconFile);
    }
    
    try {
      const response = await updateGroupInfo(formData);
      if (response.success === false) {
        toast.error(response.error);
        setIsLoading(false);
      } else {
        toast.success("Group info updated successfully!");
        setToggleGroupIconNameModal(false);
      }
    } catch (error) {
      toast.error("Failed to update group info.");
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={toggleGroupIconNameModal} onOpenChange={handleToggleGroupIconNameModal}>
      <DialogTrigger className="w-full">
        <Button className="w-full">Group Info</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="relative">
          <DialogTitle>Update Group Info</DialogTitle>
        </DialogHeader>

        {/* Icon Preview */}
        <div className="my-4 flex flex-col items-center gap-4">
          <Image
            src={previewUrl || getGroupAvatarUrl(message?.iconUrl)}
            alt="Group Icon Preview"
            width={100}
            height={100}
            className="rounded-full"
          />

          {isAdmin && <input type="file" accept="image/*" onChange={handleIconChange} />}
        </div>

        {/* Reset Button */}
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="top-18 absolute right-2 mr-2 mt-20"
            onClick={handleResetForm}
          >
            Reset
          </Button>
        )}

        {/* Title and Description */}
        <div className="space-y-4">
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={!isAdmin}
          />
          <Textarea
            placeholder="Group Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isAdmin}
          />
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleToggleGroupIconNameModal}>
            Cancel
          </Button>
          {isAdmin && (
            <Button onClick={handleUpdateGroupInfo} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          )}
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
              {user?.displayName || user?.username || miniAddress(user?.address)}
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
            router.push(`/${user.username || user.address}`);
          }}
        >
          <UserCircle /> <span> Profile</span>
        </DropdownMenuItem>
        {me?.role == "admin" && !isMeAdmin && (
          <DropdownMenuItem className="flex gap-1 p-2" onClick={() => handleRemove()}>
            <CircleMinus /> <span> Remove</span>
          </DropdownMenuItem>
        )}{" "}
        {me?.role == "admin" && !isMeAdmin && (
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
