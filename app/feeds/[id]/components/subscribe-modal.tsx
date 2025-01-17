/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { HandCoins } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

type Props = {
  tokenId: number;
  to: string;
  triggerProps?: React.ComponentProps<typeof Button>;
};

export function SubscriptionModal(props: Props) {
  const { tokenId, to, triggerProps } = props;
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full" variant="gradientOne" {...triggerProps}>
          <HandCoins className="size-5" /> Subscribe to watch
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-tanker text-4xl tracking-wider">
            Choose Subscription
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
          <div className="flex size-auto items-center justify-center gap-4">
            working on it...
            <DialogClose asChild>
              <Button className="rounded-full" size="sratch">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SubscriptionModal;
