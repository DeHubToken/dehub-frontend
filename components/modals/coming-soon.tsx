"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Button } from "../ui/button";

export default function ComingSoonModal({
  icon,
  name,
  children
}: {
  icon: React.ReactNode;
  name: string;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <DialogTrigger asChild>
            <TooltipTrigger className="w-full" asChild>
              <Button
                variant="ghost"
                className="w-full cursor-pointer justify-center gap-2 px-8 py-6 text-base text-theme-neutrals-200 hover:bg-transparent hover:text-theme-neutrals-200 lg:justify-start"
              >
                {icon}
                {children}
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent className="font-tanker text-sm capitalize">{name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader className="gap-4">
          <DialogTitle className="text-3xl">Coming Soon!</DialogTitle>
          <DialogDescription className="dark:text-white">
            Something awesome is coming your way! We’re putting the final touches on a brand new
            feature you’re going to love. Hang tight — it’ll be worth the wait!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
