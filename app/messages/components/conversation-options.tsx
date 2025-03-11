import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import { CircleAlert, CircleEllipsis, CircleX, EllipsisVertical, User } from "lucide-react";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { useMessage } from "./provider";

type Props = {
  type: "dm" | "group";
  participant: {
    username: string;
    address: string;
  };
};

const ConversationOptions = ({ type, participant }: Props) => {
  const router = useRouter();
  const {
    setSelectedMessageId,
    me,
    handleToggleUserReport,handleToggleDeleteChat,
    handleExitGroup,
    handleToggleConversationMoreOptions
  }: any & { handleToggleUserReport: () => void } = useMessage("ConversationOptions");
  const { account } = useActiveWeb3React(); 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="size-6 " />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2 bg-gray-100  rounded-md border border-solid dark:border-theme-mine-shaft-dark dark:bg-theme-background">
        {type == "dm" && (
          <DropdownMenuItem
            className="flex gap-1 p-2 "
            onClick={() => {
              router.push(`/${participant.username || participant.address}`);
            }}
          >
            <User className="size-5" /> <span> Profile</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="flex gap-1 p-2 "
          onClick={() => {
            setSelectedMessageId(null);
          }}
        >
          <CircleX className="size-5" /> <span> Close chat</span>
        </DropdownMenuItem>

        {type == "dm" && (
          <DropdownMenuItem
            className="flex gap-1    p-2  "
            onClick={handleToggleUserReport}
          >
            <CircleAlert className="size-5" />
            <span> Block </span>
          </DropdownMenuItem>
        )}
        {type == "dm" && (
          <DropdownMenuItem
            className="flex gap-1    p-2  "
            onClick={handleToggleDeleteChat}
          >
            <CircleAlert className="size-5" />
            <span> Delete Chat </span>
          </DropdownMenuItem>
        )}
        {type == "group" && me?.role != "admin" && (
          <DropdownMenuItem
            className="flex gap-1    p-2  "
            onClick={() => handleExitGroup(account?.toLocaleLowerCase())}
          >
            <ExitIcon className="size-5" />
            <span> Exist Group </span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="flex gap-1    p-2 "
          onClick={handleToggleConversationMoreOptions}
        >
          <CircleEllipsis />
          <span> more </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationOptions;
