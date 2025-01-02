import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { fetchGroupsByPlan, joinGroup } from "@/services/dm";

type Props = {
  plan: any;
};

const SubscriptionGroupList = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const { account }: any = useActiveWeb3React();
  const { id } = props.plan;

  useEffect(() => {
    if (open) {
      getAllGroups();
    }
  }, [open]);

  const getAllGroups = async () => {
    const response = await fetchGroupsByPlan({ id });
    const { success, data }: any = response;

    if (success) {
      setGroups(data); // Update the groups state
    }
  };

  const handleJoinNow = async (groupId: string) => {
    // if (!props.plan.alreadySubscribed) {
    //   toast.info("please subscribe plan to join!");
    // }
    const response = await joinGroup({
      groupId,
      address: account,
      userAddress: account,
      planId: id
    });

    console.log(`Joining group with ID: ${groupId}`, response);
    // Add your logic for joining the group here
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen((o) => !o)}>
      <DialogTrigger>
        <Button>Groups</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to Join our Groups</DialogTitle>
        </DialogHeader>
        <div className="groups-list">
          {groups.map((group) => (
            <div
              key={group._id}
              className="group-item flex items-center justify-between border-b py-4"
            >
              <div>
                <h4 className="text-lg font-semibold">{group.groupName}</h4>
                <p className="text-sm text-gray-500">Participants: {group.sendParticipantCount}</p>
              </div>
              <Button
                // disabled={!props.plan.alreadySubscribed}
                onClick={() => handleJoinNow(group._id)}
              >
                Join Now
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionGroupList;
