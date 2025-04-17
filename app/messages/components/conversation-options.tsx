import React from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import { CircleAlert, CircleEllipsis, CircleX, EllipsisVertical, Trash, User } from "lucide-react";

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
    handleToggleDeleteChat,
    handleExitGroup,
    handleToggleConversationMoreOptions
  }: any & { handleToggleUserReport: () => void } = useMessage("ConversationOptions");
  const { account } = useActiveWeb3React();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="size-6 " />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-10 flex flex-col gap-2 rounded-md  border border-solid bg-gray-100 dark:border-theme-mine-shaft-dark dark:bg-theme-background">
        {type == "dm" && (
          <DropdownMenuItem
            className="flex gap-1 p-2 "
            onClick={() => {
              router.push(`/${participant.username || participant.address}`);
            }}
          >
            <User className="size-5" /> <> Profile</>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="flex gap-1 p-2 "
          onClick={() => {
            setSelectedMessageId(null);
          }}
        >
          <CircleX className="size-5" /> <> Close chat</>
        </DropdownMenuItem>

        {type == "dm" && (
          <DropdownMenuItem className="flex gap-1    p-2  " onClick={handleToggleUserReport}>
            <CircleAlert className="size-5" />
            <> Block </>
          </DropdownMenuItem>
        )} 
          <DropdownMenuItem className="flex gap-1    p-2  " onClick={handleToggleDeleteChat}>
            <Trash className="size-5" />
            <> Delete All Chat </>
          </DropdownMenuItem>
       
        {type == "group" && me?.role != "admin" && (
          <DropdownMenuItem
            className="flex gap-1    p-2  "
            onClick={() => handleExitGroup(account?.toLocaleLowerCase())}
          >
            <ExitIcon className="size-5" />
            <> Exist Group </>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="flex gap-1    p-2 "
          onClick={handleToggleConversationMoreOptions}
        > 
          <> More </>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationOptions;
