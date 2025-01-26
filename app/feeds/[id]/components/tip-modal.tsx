/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { HandCoins } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useContract, useERC20Contract, useStreamControllerContract } from "@/hooks/use-web3";
import { useActiveWeb3React } from "@/hooks/web3-connect";


import MULTICALL_ABI from "@/web3/abis/multicall.json";
import { STREAM_CONTROLLER_CONTRACT_ADDRESSES } from "@/web3/configs";
import { getReadableNumber } from "@/web3/utils/format";
import { multicallRead } from "@/web3/utils/multicall";
import { approveToken, sendTipWithToken } from "@/web3/utils/transaction";

import { limitTip, MULTICALL2_ADDRESSES, supportedTokens } from "@/configs";

type Props = {
  tokenId: number;
  to: string;
  triggerProps?: React.ComponentProps<typeof Button>;
};

export function TipModal(props: Props) {
  const { tokenId, to, triggerProps } = props;
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const { library, account, chainId } = useActiveWeb3React();
  const multicallContract = useContract(MULTICALL2_ADDRESSES, MULTICALL_ABI);
  const token: any = supportedTokens.find((e) => e.symbol === "DHB");
  const [tokenBalance, setTokenBalance] = useState<any>(undefined);
  const [isApproved, setIsApproved] = useState(false);
  const [isRunningTx, setIsRunningTx] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const tokenContract = useERC20Contract(token?.address);
  const streamController = useStreamControllerContract();
  const addTransaction = useAddRecentTransaction();
  const streamControllerContractAddress = useMemo(
    // @ts-expect-error fix types later
    () => STREAM_CONTROLLER_CONTRACT_ADDRESSES[chainId],
    [chainId]
  );

  const isToAddressSameAsAccount = useMemo(
    () => account?.toLowerCase() === to?.toLowerCase(),
    [account, to]
  );

  useEffect(() => {
    (async () => {
      if (account && chainId && multicallContract && tokenContract) {
        const callDataArray = [];
        callDataArray.push({
          contract: tokenContract,
          functionName: "balanceOf",
          param: [account],
          returnKey: `wallet`
        });
        callDataArray.push({
          contract: tokenContract,
          functionName: "allowance",
          param: [account, streamControllerContractAddress],
          returnKey: `allowance`
        });
        // @ts-expect-error fix types later
        const result: any = await multicallRead(multicallContract, callDataArray);
        if (result) {
          result.wallet = getReadableNumber(result.wallet, token.decimals);
          if (
            amount > 0 &&
            amount <= Number(ethers.utils.formatUnits(result.allowance, token.decimals))
          )
            setIsApproved(true);
          else setIsApproved(false);
        }
        setTokenBalance(result);
      } else setTokenBalance(null);
    })();
  }, [
    account,
    chainId,
    multicallContract,
    token,
    amount,
    tokenContract,
    streamControllerContractAddress,
    isUpdate
  ]);

  const onApproveClick = async () => {
    if (!account) {
      toast.error("Please connect your wallet to tip this uploader");
      return;
    }
    setIsRunningTx(true);
    const txHash = await approveToken(tokenContract, library, streamControllerContractAddress);
    // @ts-expect-error fix types later
    if (txHash) addTransaction({ hash: txHash, description: "Approve", confirmations: 3 });
    setIsRunningTx(false);
    setTimeout(() => setIsUpdate(!isUpdate), 100);
  };

  async function handleTip() {
    if (!account) {
      toast.error("Please connect your wallet to tip this upload");
      return;
    }

    try {
      setIsRunningTx(true);
      const txHash = await sendTipWithToken(streamController, library, amount, token, tokenId, to);
      if (txHash) addTransaction({ hash: txHash, description: "Tip", confirmations: 3 });
      setIsRunningTx(false);
    } catch (e) {
      setIsRunningTx(false);
      // throw new Error(e.message);
    }
    setTimeout(() => setIsUpdate(!isUpdate), 200);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full" variant="gradientOne" {...triggerProps}>
          <HandCoins className="size-5" /> Tip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-tanker text-4xl tracking-wider">Send a tip</DialogTitle>
        </DialogHeader>
        <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
          <p className="text-base">
            Enter amount of <span className="font-semibold text-theme-orange-500">$DHB :</span>
          </p>
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={limitTip}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-10 text-base"
          />
          <div className="flex size-auto items-center justify-center gap-4">
            {isApproved && (
              <Button
                className="gap-2 rounded-full"
                variant="gradientOne"
                size="sratch"
                disabled={!isApproved || isRunningTx || isToAddressSameAsAccount}
                onClick={handleTip}
              >
                <HandCoins className="size-5" /> Tip
              </Button>
            )}
            {!isApproved && (
              <Button
                className="gap-2 rounded-full"
                variant="gradientOne"
                size="sratch"
                disabled={isApproved || isRunningTx || isToAddressSameAsAccount}
                onClick={onApproveClick}
              >
                Approve
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

export default TipModal;
