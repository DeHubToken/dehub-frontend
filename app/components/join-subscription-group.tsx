import React, { useState } from "react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "react-day-picker";

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {};

const SubscriptionGroupList = (props: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={() => setOpen((o) => !o)}>
      <DialogTrigger>
        <Button>Groups</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to Join our Groups</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionGroupList;
