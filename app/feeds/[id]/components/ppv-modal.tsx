/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { NFT } from "@/services/nfts";

import { useEffect, useMemo, useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ethers } from "ethers";
import { useAtomValue } from "jotai";
import { LockKeyholeOpen } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import { useContract, useERC20Contract, useStreamControllerContract } from "@/hooks/use-web3";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getUnlockedNfts } from "@/services/nfts";

import MULTICALL_ABI from "@/web3/abis/multicall.json";
import { STREAM_CONTROLLER_CONTRACT_ADDRESSES } from "@/web3/configs";
import { sleep } from "@/web3/utils/calc";
import { getReadableNumber } from "@/web3/utils/format";
import { multicallRead } from "@/web3/utils/multicall";
import { approveToken, sendFundsForPPV } from "@/web3/utils/transaction";
import { getStreamStatus } from "@/web3/utils/validators";

import { userAtom } from "@/stores";

import { MULTICALL2_ADDRESSES, streamInfoKeys } from "@/configs";

import { unlockPPV } from "../actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = {
  nft: NFT;
};

export function PPVModal(props: Props) {
  const { nft } = props;
  const [ppvModal, setPPVModal] = useState(false);
  const { account, chainId, library } = useActiveWeb3React();
  const user = useAtomValue(userAtom);
  const streamStatus = getStreamStatus(nft, user, chainId);
  const ppvToken = streamStatus.ppvToken;
  // @ts-expect-error no null index
  const ppvBalance = user?.walletBalances?.[`${ppvToken?.address}_wallet`] || 0;
  // const ppvBalance = tokenBalance?.tokenBalances?.[ppvToken?.address] || 0;
  // @ts-expect-error no null index
  const ppvAllowance = user?.walletBalances?.[`${ppvToken?.address}_allowance`] || 0;

  const multicallContract = useContract(MULTICALL2_ADDRESSES, MULTICALL_ABI);
  const tokenContract = useERC20Contract(ppvToken?.address as string);
  const streamController = useStreamControllerContract();
  const streamControllerContractAddress = useMemo(
    // @ts-expect-error no index with type number on STREAM_CONTROLLER_CONTRACT_ADDRESSES
    () => STREAM_CONTROLLER_CONTRACT_ADDRESSES[chainId],
    [chainId]
  );
  const [isApproved, setIsApproved] = useState(false);
  const [isRunningTx, setIsRunningTx] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const ppvAmount = nft?.streamInfo?.[streamInfoKeys.payPerViewAmount];

  useEffect(() => {
    if (Number(ppvAmount) <= ppvAllowance) setIsApproved(true);
    else setIsApproved(false);
  }, [ppvAllowance, ppvAmount]);

  const onApproveClick = async () => {
    if (!account || !library) {
      toast.error("Please connect your wallet.");
      return;
    }
    if (Number(ppvAmount) > Number(ppvBalance)) {
      toast.error(`You need ${ppvAmount} ${ppvToken?.symbol} to unlock this video`);
      return;
    }
    setIsRunningTx(true);
    const txHash = await approveToken(tokenContract, library, streamControllerContractAddress);
    if (txHash) {
      setIsApproved(true);
    }
    setIsRunningTx(false);
    setTimeout(() => setIsUpdate(!isUpdate), 100);
    setTimeout(() => setIsUpdate(!isUpdate), 12000);
  };

  const onClickProceed = async () => {
    if (Number(ppvAmount) > Number(ppvBalance)) {
      toast.error(`You need ${ppvAmount} ${ppvToken?.symbol} to unlock this video`);
      return;
    }

    try {
      setIsRunningTx(true);
      const tx: any = await sendFundsForPPV(
        streamController,
        library,
        ppvAmount,
        ppvToken,
        nft?.tokenId,
        nft?.minter
      );
      const totalItems = 40;
      const arr = Array.from({ length: totalItems }, (_, i) => i + 1);

      if (tx?.hash) {
        // const confirmTx = toast.loading("Confirming transaction.");
        // addTransaction({ hash: tx.hash, description: "Send PPV", confirmations: 3 });
        await tx.wait(1);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _item of arr) {
          await sleep(500);
          const response = await getUnlockedNfts(account);
          // @ts-expect-error fix types later
          const nftRes = response?.data?.result;
          if (nftRes?.unlocked?.includes(nft?.tokenId)) break;
        }

        await unlockPPV(nft.tokenId);
        toast.success("Sent PPV funds. Reload stream");
        setPPVModal(false);
      }
    } catch (e) {
      setPPVModal(false);
    }

    setIsRunningTx(false);
    setTimeout(() => setIsUpdate(!isUpdate), 200);
  };

  useEffect(() => {
    (async () => {
      if (!account || !multicallContract || !tokenContract) return;

      const callDataArray = [
        {
          params: [account],
          contract: tokenContract,
          returnKey: "wallet",
          functionName: "balanceOf"
        },
        {
          contract: tokenContract,
          functionName: "allowance",
          params: [account, streamControllerContractAddress],
          returnKey: `allowance`
        }
      ];

      // @ts-expect-error Fix types later
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await multicallRead(multicallContract, callDataArray);

      if (result) {
        result.wallet = getReadableNumber(result.wallet, ppvToken?.decimals);
        if (
          Number(ppvAmount) > 0 &&
          Number(ppvAmount) <=
            Number(ethers.utils.formatUnits(result.allowance, ppvToken?.decimals))
        )
          setIsApproved(true);
        else setIsApproved(false);
      }
    })();
  }, [
    account,
    multicallContract,
    ppvAmount,
    ppvToken,
    streamControllerContractAddress,
    tokenContract,
    isUpdate
  ]);

  if (!streamStatus?.streamStatus?.isLockedWithPPV) {
 
    return null;
  }

  return (
    <Dialog open={ppvModal} onOpenChange={setPPVModal}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 rounded-full"
          variant="gradientOne"
          onClick={() => setPPVModal(true)}
        >
          <LockKeyholeOpen className="size-5" /> Unlock:
          {nft.streamInfo?.[streamInfoKeys.payPerViewAmount]}{" "}
          {nft.streamInfo?.[streamInfoKeys.payPerViewTokenSymbol]}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-tanker text-4xl tracking-wider">Unlock PPV</DialogTitle>
        </DialogHeader>
        <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
          <p className="text-base">
            Balance:{" "}
            <span className="font-semibold text-theme-orange-500">
              {ppvBalance}
              {ppvToken?.symbol}
            </span>
          </p>
          <p className="text-base">
            Required Amount:{" "}
            <span className="font-semibold text-theme-orange-500">
              {ppvAmount} {ppvToken?.symbol}
            </span>
          </p>
          <p className="text-base">You can watch this stream for lifetime.</p>
          <div className="flex size-auto items-center justify-center gap-4">
            {!isApproved && (
              <Button
                className="gap-2 rounded-full"
                variant="gradientOne"
                size="sratch"
                onClick={onApproveClick}
                disabled={isApproved || isRunningTx}
              >
                Approve
              </Button>
            )}
            {isApproved && (
              <Button
                className="gap-2 rounded-full"
                variant="gradientOne"
                size="sratch"
                onClick={onClickProceed}
                disabled={!isApproved || isRunningTx}
              >
                <LockKeyholeOpen className="size-5" /> Unlock
              </Button>
            )}
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
