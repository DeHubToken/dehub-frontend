/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { BellRing, Crown, Gift, HandCoins, Heart, PartyPopper, Sparkles } from "lucide-react";
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
  streamId: string;
};

const giftTiers = [
  { min: 1000000, name: "Magic Ring", icon: BellRing, color: "text-purple-500" },
  { min: 100000, name: "Crown", icon: Crown, color: "text-yellow-500" },
  { min: 50000, name: "Bouquet of Flowers", icon: Gift, color: "text-pink-500" },
  { min: 25000, name: "Box of Chocolate", icon: Gift, color: "text-brown-500" },
  { min: 10000, name: "Love Heart", icon: Heart, color: "text-red-500" },
  { min: 1000, name: "Rose", icon: Sparkles, color: "text-rose-500" },
  { min: 17, name: "Basic Gift", icon: PartyPopper, color: "text-blue-500" }
];

export function GiftModal(props: Props) {
  const { tokenId, to, triggerProps } = props;
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const { library, account, chainId } = useActiveWeb3React();
  const multicallContract = useContract(MULTICALL2_ADDRESSES, MULTICALL_ABI);
  const token: any = supportedTokens.find((e) => e.symbol === "DHB");
  const [tokenBalance, setTokenBalance] = useState<any>(undefined);
  const [isApproved, setIsApproved] = useState(true); // set to true for testing
  const [isRunningTx, setIsRunningTx] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  // const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState<any>(null);

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

  async function handleGift() {
    console.log({
      amount: Number(amount),
      selectedTier,
      celebration: selectedTier ? true : false
    });
    return toast.warning("Feature not implemented yet");
    // if (!account) {
    //   toast.error("Please connect your wallet to tip this upload");
    //   return;
    // }

    // try {
    //   setIsRunningTx(true);
    //   const txHash = await sendTipWithToken(streamController, library, amount, token, tokenId, to);
    //   if (txHash) addTransaction({ hash: txHash, description: "Tip", confirmations: 3 });
    //   setIsRunningTx(false);
    // } catch (e) {
    //   setIsRunningTx(false);
    //   // throw new Error(e.message);
    // }
    // setTimeout(() => setIsUpdate(!isUpdate), 200);
  }

  useEffect(() => {
    const numAmount = Number(amount);

    if (numAmount < 17) {
      setSelectedTier(null);
    } else if (numAmount >= 1000000) {
      setSelectedTier(giftTiers[0]); // Magic Ring
    } else if (numAmount >= 100000) {
      setSelectedTier(giftTiers[1]); // Crown
    } else if (numAmount >= 50000) {
      setSelectedTier(giftTiers[2]); // Bouquet of Flowers
    } else if (numAmount >= 25000) {
      setSelectedTier(giftTiers[3]); // Box of Chocolate
    } else if (numAmount >= 10000) {
      setSelectedTier(giftTiers[4]); // Love Heart
    } else if (numAmount >= 1000) {
      setSelectedTier(giftTiers[5]); // Rose
    } else if (numAmount >= 17) {
      setSelectedTier(giftTiers[6]); // Basic Gift
    }
  }, [amount]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full" variant="gradientOne" {...triggerProps}>
          <HandCoins className="size-5" /> Gift
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-tanker text-4xl tracking-wider">
            Gift the streamer
          </DialogTitle>
        </DialogHeader>
        <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
          <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
            {giftTiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier?.min === tier.min;
              return (
                <button
                  key={tier.min}
                  onClick={() => {
                    setAmount(tier.min);
                    setSelectedTier(tier);
                  }}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all ${
                    isSelected
                      ? "border-theme-orange-500 bg-theme-orange-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <Icon className={`size-8 ${tier.color}`} />
                  <span className="mt-2 font-medium">{tier.name}</span>
                  <span className="text-sm text-gray-400">{tier.min} DHB</span>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-base">
            Or enter custom amount of{" "}
            <span className="text-theme-orange-500 font-semibold">$DHB:</span>
          </p>
          <Input
            type="number"
            placeholder="0"
            min={0}
            // max={limitTip}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-10 text-base"
          />

          {selectedTier && (
            <div className="w-full rounded-lg bg-gray-900/50 p-4 text-center">
              <p>
                Selected Gift: <span className="font-semibold">{selectedTier.name}</span>
              </p>
              {selectedTier.min >= 300000 && (
                <p className="text-sm text-gray-400">Includes Spartans army celebration!</p>
              )}
              {selectedTier.min >= 500000 && (
                <p className="text-sm text-gray-400">Includes party celebration!</p>
              )}
              {selectedTier.min >= 750000 && (
                <p className="text-sm text-gray-400">Includes golden screen (3 seconds)!</p>
              )}
              {selectedTier.min >= 1000000 && (
                <p className="text-sm text-gray-400">Includes all celebrations!</p>
              )}
            </div>
          )}

          <div className="flex size-auto items-center justify-center gap-4">
            {isApproved && (
              <Button
                className="gap-2 rounded-full"
                variant="gradientOne"
                size="sratch"
                disabled={!isApproved || isRunningTx}
                onClick={handleGift}
              >
                <HandCoins className="size-5" /> Gift
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

export default GiftModal;
