"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getSignInfo } from "@/web3/utils/web3-actions";

import { voteOnNFT } from "../actions";

type LikeButtonProps = {
  children: React.ReactNode;
};

export function LikeButton(
  props: LikeButtonProps & { tokenId: number; vote: boolean; votes: number }
) {
  const { children, tokenId, vote, votes } = props;
  const { account, library } = useActiveWeb3React();
  const [total, setTotal] = useState(votes);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onVote() {
    if (!account) {
      toast.error("Please connect your wallet to like this upload");
      return;
    }

    setStatus("loading");
    try {
      const signData = await getSignInfo(library, account);
      const res = await voteOnNFT({
        account,
        streamTokenId: tokenId,
        vote,
        sig: signData.sig,
        timestamp: signData.timestamp
      });
      if (!res.success) {
        toast.error(res.error);
        setStatus("error");
        return;
      }

      if (res.success && res.error) {
        toast.error(res.error);
        setStatus("error");
        return;
      }

      const message = vote ? "Vote successfully" : "Unvote successfully";
      setTotal(total + 1);
      setStatus("success");
      toast.success(message);
    } catch (err) {
      toast.error("Failed to vote");
      setStatus("error");
    }
  }

  return (
    <Button onClick={onVote} className="gap-2 rounded-full" disabled={status === "loading"}>
      {children}
      {total}
      {status === "loading" && (
        <div className="absolute flex h-full w-full items-center justify-center">
          <Spinner />
        </div>
      )}
    </Button>
  );
}
