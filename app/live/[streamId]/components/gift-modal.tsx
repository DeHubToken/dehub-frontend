/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
  BellRing,
  BellRingIcon,
  Clock,
  Crown,
  Flower2,
  Gift,
  HandCoins,
  Heart,
  PartyPopper,
  ShieldPlus,
  Sparkles,
  Star,
  Trophy
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useContract, useERC20Contract, useStreamControllerContract } from "@/hooks/use-web3";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { recordLiveGift } from "@/services/broadcast/broadcast.service";

import MULTICALL_ABI from "@/web3/abis/multicall.json";
import { STREAM_CONTROLLER_CONTRACT_ADDRESSES } from "@/web3/configs";
import { getReadableNumber } from "@/web3/utils/format";
import { multicallRead } from "@/web3/utils/multicall";
import {
  approveToken,
  calculateGasMargin,
  GAS_MARGIN,
  sendTipWithToken
} from "@/web3/utils/transaction";
import { getSignInfo } from "@/web3/utils/web3-actions";

import { limitTip, MULTICALL2_ADDRESSES, StreamStatus, supportedTokens } from "@/configs";

type Props = {
  tokenId: number;
  to: string;
  triggerProps?: React.ComponentProps<typeof Button>;
  trigger?: React.ReactNode;
  stream: any;
};

export const giftTiers = [
  {
    min: 1000000,
    name: "Ultimate Celebration",
    icon: Trophy,
    color: "text-indigo-500",
    description: "Includes all celebrations and Emojis! with extra confetti and party music."
  },
  {
    min: 750000,
    name: "Golden Screen (10s)",
    icon: Star,
    color: "text-yellow-500",
    description: "Screen goes gold and coins drop from sky with sirens (10 seconds)."
  },
  {
    min: 500000,
    name: "Golden Screen (3s)",
    icon: Star,
    color: "text-amber-500",
    description: "Screen goes gold and coins drop from sky with sirens (3 seconds)."
  },
  {
    min: 300000,
    name: "Party Celebration",
    icon: PartyPopper,
    color: "text-pink-400",
    description: "Party starts, confetti flies, disco balls spin."
  },
  {
    min: 200000,
    name: "Spartans Army",
    icon: ShieldPlus,
    color: "text-red-700",
    description: "Spartans Army run on Screen"
  },
  {
    min: 100000,
    name: "Magic Ring",
    icon: BellRing,
    color: "text-purple-500",
    description: "Magic Ring Emoji pops up on Screen"
  },
  {
    min: 50000,
    name: "Crown",
    icon: Crown,
    color: "text-yellow-500",
    description: "Crown Emoji pops on Screen"
  },
  {
    min: 25000,
    name: "Bouquet of Flowers",
    icon: Flower2,
    color: "text-rose-400",
    description: "Bouquet of flowers Emoji Pops up on Screen"
  },
  {
    min: 10000,
    name: "Box of Chocolate",
    icon: Gift,
    color: "text-brown-500",
    description: "Box of Chocolate Emoji Pops Up on Screen."
  },
  {
    min: 1000,
    name: "Love Heart",
    icon: Heart,
    color: "text-red-500",
    description: "Love Heart Emoji Pop up on screen."
  }
];
// {
//   min: 1,
//   name: "Rose",
//   icon: Sparkles,
//   color: "text-rose-500",
//   description: "Rose Emoji Pop up on screen."
// }

export function GiftModal(props: Props) {
  const { tokenId, to, triggerProps, trigger, stream } = props;
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  // const [delay, setDelay] = useState(0);
  const [message, setMessage] = useState("");
  const [minTip] = useState(stream?.settings?.minTip || 1);

  const { library, account, chainId } = useActiveWeb3React();
  const multicallContract = useContract(MULTICALL2_ADDRESSES, MULTICALL_ABI);
  const token: any = supportedTokens.find((e) => e.symbol === "DHB" && e.chainId === chainId);
  const [tokenBalance, setTokenBalance] = useState<any>(undefined);
  const [isApproved, setIsApproved] = useState(false); // set to true for testing
  const [isRunningTx, setIsRunningTx] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  // const [amount, setAmount] = useState('');
  const [selectedTier, setSelectedTier] = useState<any>(null);

  const tokenContract = useERC20Contract(token?.address);
  const streamController = useStreamControllerContract();
  // const addTransaction = useAddRecentTransaction();
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
    if (amount > tokenBalance?.wallet)
      return toast.error(`You don't have enough DHB. Balance: ${tokenBalance?.wallet} DHB`);
    setIsRunningTx(true);
    const txHash = await approveToken(tokenContract, library, streamControllerContractAddress);
    // @ts-expect-error fix types later
    // if (txHash) addTransaction({ hash: txHash, description: "Approve", confirmations: 3 });
    setIsRunningTx(false);
    setTimeout(() => setIsUpdate(!isUpdate), 100);
  };

  async function handleGift() {
    console.log({
      amount: Number(amount),
      selectedTier,
      celebration: selectedTier ? true : false,
      // delay,
      message
    });
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }
    if (stream?.status !== StreamStatus.LIVE) {
      toast.error("Stream is not live");
      return;
    }
    if (isToAddressSameAsAccount) {
      toast.error("You can't tip yourself");
      return;
    }

    if (amount < minTip) return toast.error(`Minimum tip is ${minTip} DHB`);
    if (amount > tokenBalance?.wallet)
      return toast.error(`You don't have enough DHB. Balance: ${tokenBalance?.wallet} DHB`);

    const _toast = toast.loading("Confirm Transaction.");

    try {
      setIsRunningTx(true);

      const estimatedGasPrice = await library
        .getGasPrice()
        .then((gasPrice) =>
          gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100))
        );

      // Convert amount to BigNumber
      const bigNumAmount = ethers.utils.parseUnits(amount.toString(), token?.decimals || 18);

      // Estimate gas limit
      const estimatedSendGasLimit = await streamController?.estimateGas.sendTip(
        tokenId,
        bigNumAmount,
        to,
        token.address
      );

      // Send transaction
      const tx = await streamController?.sendTip(tokenId, bigNumAmount, to, token.address, {
        // @ts-ignore
        gasLimit: calculateGasMargin(estimatedSendGasLimit, GAS_MARGIN),
        gasPrice: estimatedGasPrice
      });

      // Wait for confirmation
      await tx.wait(1);

      // Add to recent transactions
      // addTransaction({ hash: tx.hash, description: "Tip", confirmations: 3 });

      toast.success("Tip confirmed", { id: _toast });

      const signData = await getSignInfo(library, account);

      // Send to backend
      try {
        const response = await recordLiveGift(stream._id, {
          address: account.toLowerCase(),
          amount,
          // delay,
          message,
          recipient: to,
          selectedTier: selectedTier?.name,
          timestamp: signData.timestamp,
          sig: signData.sig,
          tokenAddress: token.address,
          tokenId,
          transactionHash: tx.hash
        });

        if (!response.success) {
          // @ts-ignore
          toast.error(response.error || response.message);
          return;
        }

        toast.success("Tip sent successfully", { id: _toast });
        setOpen(false);
      } catch (backendError) {
        console.error("Failed to save tip details:", backendError);
        toast.error("Transaction successful but failed to record tip", { id: _toast });
      }
      setOpen(false);
    } catch (e) {
      console.error("Transaction failed:", e);
      toast.error("Tip failed", { id: _toast });
    } finally {
      setIsRunningTx(false);
      // @ts-ignore
      toast.dismiss();
      // _toast.dismiss();
      setTimeout(() => setIsUpdate(!isUpdate), 200);
    }
    setTimeout(() => setIsUpdate(!isUpdate), 200);
  }

  useEffect(() => {
    const numAmount = Number(amount);

    if (numAmount < minTip) return setSelectedTier(null);

    if (numAmount >= 1000000) {
      setSelectedTier(giftTiers[0]); // Ultimate Celebration
    } else if (numAmount >= 750000) {
      setSelectedTier(giftTiers[1]); // Golden Screen (10s)
    } else if (numAmount >= 500000) {
      setSelectedTier(giftTiers[2]); // Golden Screen (3s)
    } else if (numAmount >= 300000) {
      setSelectedTier(giftTiers[3]); // Party Celebration
    } else if (numAmount >= 200000) {
      setSelectedTier(giftTiers[4]); // Spartans Army
    } else if (numAmount >= 100000) {
      setSelectedTier(giftTiers[5]); // Magic Ring
    } else if (numAmount >= 50000) {
      setSelectedTier(giftTiers[6]); // Crown
    } else if (numAmount >= 25000) {
      setSelectedTier(giftTiers[7]); // Bouquet of Flowers
    } else if (numAmount >= 10000) {
      setSelectedTier(giftTiers[8]); // Box of Chocolate
    } else if (numAmount >= 1000) {
      setSelectedTier(giftTiers[9]); // Love Heart
    } else {
      setSelectedTier(null);
    }
  }, [amount]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="gap-2 rounded-full" variant="gradientOne" {...triggerProps}>
            <HandCoins className="size-5" /> Tip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-auto max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-tanker text-4xl tracking-wider">
            Tip the streamer
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
            placeholder={`Min: ${minTip} DHB`}
            value={amount === 0 ? "" : amount}
            min={minTip}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="h-10 text-base"
          />

          <div className="w-full space-y-4">
            <Textarea
              placeholder="Add a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-24 resize-none"
            />
          </div>

          {selectedTier && (
            <div className="w-full rounded-lg bg-gray-900/50 p-4 text-center">
              <p>
                Selected Gift: <span className="font-semibold">{selectedTier.name}</span>
              </p>
              <p className="text-sm text-gray-400">{selectedTier.description}</p>
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

export default GiftModal;
