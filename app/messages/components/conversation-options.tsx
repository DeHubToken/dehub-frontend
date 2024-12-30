import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { CircleAlert, CircleEllipsis, CircleX, EllipsisVertical, User } from "lucide-react";

import { Button } from "@/components/ui/button";

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
    handleToggleUserReport,
    handleToggleConversationMoreOptions
  }: any & { handleToggleUserReport: () => void } = useMessage("ConversationOptions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="size-6 text-gray-600 dark:text-gray-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2   rounded-md bg-slate-500 ">
        {type == "dm" && (
          <DropdownMenuItem
            className="flex gap-1 p-2 hover:bg-slate-600"
            onClick={() => {
              router.push(`/profile/${participant.username || participant.address}`);
            }}
          >
            <User className="size-5" /> <span> Profile</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="flex gap-1 p-2 hover:bg-slate-600"
          onClick={() => {
            setSelectedMessageId(null);
          }}
        >
          <CircleX className="size-5" /> <span> Close chat</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex gap-1    p-2  hover:bg-slate-600"
          onClick={handleToggleUserReport}
        >
          <CircleAlert className="size-5" />
          <span> Block </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1    p-2  hover:bg-slate-600"
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
