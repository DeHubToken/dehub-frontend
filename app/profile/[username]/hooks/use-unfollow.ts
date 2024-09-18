import type { User } from "@/stores";

import { toast } from "sonner";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { unFollow } from "@/services/user";

type Props = { user: User };

export function useUnFollow(props: Props) {
  const { user } = props;
  const { account, library } = useActiveWeb3React();

  async function unfollow() {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!user || !user.address) {
      toast.error("User has no address");
      return;
    }

    const res = await unFollow({
      account,
      library,
      to: user.address!
    });

    if (!res.success) {
      toast.error(res.error);
      return;
    }

    toast.success("Followed successfully");
  }

  return { unfollow };
}
