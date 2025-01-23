"use client";

import type { TMessage } from "../utils";

import { useState } from "react";
import { CirclePlus, MessageCircle, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

import { cn } from "@/libs/utils";

import { ContactList } from "./contact-list";
import { NewChatModal } from "./new-chat-modal";
import { NewGroupChatModal } from "./new-group-chat";

type MobileContactListProps = React.ComponentProps<"div">;

export function MobileContactList(props: MobileContactListProps) {
  const [open, setOpen] = useState(false);
  const [isOpenGroupModal, setIsOpenGroupModal] = useState(false);
  const [isDmModal, setIsDmModal] = useState(false);
  const handleDmChatModal = () => {
    setIsDmModal((b) => !b);
  };
  const handleGroupChatModal = () => {
    setIsOpenGroupModal((b) => !b);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="absolute left-4 top-16 z-10 flex size-12 flex-col items-center justify-center rounded-full bg-gray-100 p-2 dark:bg-theme-mine-shaft-dark lg:hidden">
          <MessageCircle className="size-5 text-gray-400" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full">
        <SheetHeader className="mb-4">
          <SheetTitle>Messages</SheetTitle>
          <Button onClick={handleDmChatModal}>
            <CirclePlus className="size-5" />
            &nbsp;&nbsp;Dm
          </Button>
          <Button onClick={handleGroupChatModal}>
            <Users className="size-5" />
            &nbsp;&nbsp;Group
          </Button>
          <SheetDescription className="sr-only">Your inbox</SheetDescription>
        </SheetHeader>
        <ContactList
          {...props}
          className={cn("max-h-[calc(100vh-24px-16px)]", props.className)}
          onMessageSelect={() => setOpen(false)}
        />
      </SheetContent>
      <NewGroupChatModal open={isOpenGroupModal} setOpen={setIsOpenGroupModal} />
      <NewChatModal open={isDmModal} setOpen={setIsDmModal} />
    </Sheet>
  );
}
