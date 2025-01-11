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
    handleToggleUserReport,
    handleExitGroup,
    handleToggleConversationMoreOptions
  }: any & { handleToggleUserReport: () => void } = useMessage("ConversationOptions");
  const { account } = useActiveWeb3React();
  console.log(me?.role, "KLLK");
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

        {type == "dm" && (
          <DropdownMenuItem
            className="flex gap-1    p-2  hover:bg-slate-600"
            onClick={handleToggleUserReport}
          >
            <CircleAlert className="size-5" />
            <span> Block </span>
          </DropdownMenuItem>
        )}
        {type == "group" && me?.role != "admin" && (
          <DropdownMenuItem
            className="flex gap-1    p-2  hover:bg-slate-600"
            onClick={() => handleExitGroup(account?.toLocaleLowerCase())}
          >
            <ExitIcon className="size-5" />
            <span> Exist Group </span>
          </DropdownMenuItem>
        )}

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
