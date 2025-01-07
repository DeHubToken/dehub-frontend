"use client";

import type { User } from "@/stores";

import { CirclePlus, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { TipModal } from "@/app/stream/[id]/components/tip-modal";

import { Button } from "@/components/ui/button";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { useFollow } from "../hooks/use-follow";
import { useUnFollow } from "../hooks/use-unfollow";
import { SubscriptionModal } from "./subscription-modal";
import { getPlans } from "@/services/subscription-plans";
import { useEffect, useState } from "react";

type Props = {
  user: User;
  username: string;
};

type FollowButtonProps = { user: User };

function FollowButton(props: FollowButtonProps) {
  const { user } = props;
  const { follow } = useFollow({ user });
  return (
    <Button variant="gradientOne" size="sratch" className="gap-2 py-5" onClick={follow}>
      <UserPlus className="size-5" /> Follow
    </Button>
  );
}

type UnfollowButtonProps = { user: User };

function UnfollowButton(props: UnfollowButtonProps) {
  const { user } = props;
  const { unfollow } = useUnFollow({ user });
  return (
    <Button variant="gradientOne" size="sratch" className="gap-2 py-5" onClick={unfollow}>
      <UserPlus className="size-5" /> Unfollow
    </Button>
  );
}

export async function ProfileAction(props: Props) {
  const { user } = props;
  const { account } = useActiveWeb3React();
  const isFollowing = user.followers?.includes(account?.toLowerCase() || "");
  const [plans,setPlans] = useState([])

  const fetchMyPlans = async () => {
    if(user?.address){
    const { success, error, data }: any = await getPlans({ address: (user?.address).toLowerCase() });
    if (!success && !data?.plans) {
      toast.error(error);
      return;
    }
    setPlans(data.plans)
  }
  };

  useEffect(() => {
    fetchMyPlans()
  }, [])

  return (
    <div className="flex w-full max-w-screen-xs flex-wrap items-start justify-start gap-3 overflow-hidden sm:gap-4">
      <SubscriptionModal plans={plans} displayName={user.displayName} />
      <TipModal tokenId={0} to={user.address!} />

      {isFollowing && <UnfollowButton user={user} />}
      {!isFollowing && <FollowButton user={user} />}
    </div>
  );
}
