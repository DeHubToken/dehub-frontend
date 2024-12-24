import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { CircleAlert, CircleX, EllipsisVertical, User } from "lucide-react";

import { useMessage } from "./provider";

type Props = {
  participant: {
    username: string;
    address: string;
  };
};

const ConversationOptions = ({ participant }: Props) => {
  const router = useRouter();
  const {
    setSelectedMessageId,
    handleToggleUserReport
  }: any & { handleToggleUserReport: () => void } = useMessage("ConversationOptions");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
          <EllipsisVertical className="size-6 text-gray-600 dark:text-gray-300" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2   rounded-md bg-slate-500 ">
        <DropdownMenuItem
          className="flex gap-1 p-2 hover:bg-slate-600"
          onClick={() => {
            router.push(`/profile/${participant.username || participant.address}`);
          }}
        >
          <User className="size-5" /> <span> Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1 p-2 hover:bg-slate-600"
          onClick={
            //handleToggleMediaUpload
            () => {
              setSelectedMessageId(null);
            }
          }
        >
          <CircleX className="size-5" /> <span> Close chat</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1    p-2  hover:bg-slate-600"
          onClick={handleToggleUserReport}
        >
          <CircleAlert className="size-5" />
          <span> Block</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationOptions;
