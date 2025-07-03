"use client";

import type { ClaimBounty, NFT } from "@/services/nfts";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";

import { useStreamControllerContract } from "@/hooks/use-web3";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { requestSigForClaimBounty } from "@/services/nfts";

import { getSignInfo } from "@/web3/utils/web3-actions";

import { streamInfoKeys } from "@/configs";

import { claimBounty } from "../actions";

export function useClaimBounty(nft: NFT, tokenId: number, bountyType: number) {
  const { account, library, chainId } = useActiveWeb3React();
  const [claim, setClaim] = useState<null | ClaimBounty>(null);
  const [txStatus, setTxStatus] = useState<"pending" | "success" | "failed" | "idle">("idle");
  const [isSupportedNetwork, setIsSupportedNetwork] = useState(false);
  const streamController = useStreamControllerContract();

  async function cliamBounty() {
    setTxStatus("pending");
    let isSupportedNetwork = false;
    if (Number(nft?.streamInfo?.[streamInfoKeys.addBountyChainId]) !== Number(chainId)) {
      toast.error("Please switch to supported chain to claim bounty");
    } else {
      isSupportedNetwork = true;
    }
    setIsSupportedNetwork(isSupportedNetwork);
    setTimeout(() => {
      setTxStatus("idle");
    }, 1000);
  }

  async function claimForViewer() {
    if (!claim || !claim.viewer) return;
    if (!streamController) return;
    const sig = claim.viewer;
    setTxStatus("pending");
    try {
      const gasLimit = ethers.utils.hexlify(3000000);
      const tx = await streamController.claimBounty(tokenId, sig.r, sig.s, sig.v, bountyType, {
        gasLimit
      });
      await tx.wait(1);
      await claimBounty(tokenId);
      toast.success("Bounty claimed");
      setTxStatus("success");
    } catch (err) {
      toast.error("Bounty claim failed");
      setTxStatus("failed");
    }
  }

  async function claimForCommentor() {
    if (!claim || !claim.commentor) return;
    if (!streamController) return;
    const sig = claim.commentor;
    setTxStatus("pending");
    try {
      const gasLimit = ethers.utils.hexlify(3000000);
      const tx = await streamController.claimBounty(tokenId, sig.r, sig.s, sig.v, bountyType, {
        gasLimit
      });
      await tx.wait(1);
      toast.success("Bounty claimed");
      setTxStatus("success");
    } catch (err) {
      toast.error("Bounty claim failed");
      setTxStatus("failed");
    }
  }

  async function submitClaim() {
    if (bountyType === 0) {
      await claimForViewer();
    } else {
      await claimForCommentor();
    }
  }

  useEffect(() => {
    (async () => {
      if (account && library && nft && nft.streamInfo?.[streamInfoKeys.isAddBounty]) {
        try {
          const sigData = await getSignInfo(library, account);
          const data = await requestSigForClaimBounty({
            tokenId,
            account,
            timestamp: sigData.timestamp,
            sig: sigData.sig
          });
          if (data.success) {
            setClaim(data?.data?.result as ClaimBounty);
          }
        } catch (err) {
          // --
        }
      }
    })();
  }, [account, library, nft, tokenId]);

  return { claim, cliamBounty, txStatus, isSupportedNetwork, submitClaim };
}
