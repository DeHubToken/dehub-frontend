/* eslint-disable */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BigNumber } from "ethers";
import { toast } from "sonner";
import { useWaitForTransaction } from "wagmi"; 

import { Button } from "@/components/ui/button";

import { useERC20Contract, useSubscriptionContract } from "@/hooks/use-web3";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { webhookPlanCreated } from "@/services/subscription-plans";

import { getSignInfo } from "@/web3/utils/web3-actions";

import { SB_ADDRESS } from "@/configs";

interface PublishOnChainProps {
  chainId: number;
  deployedPlan: { id: string; name: string; description: string; duration: number };
  field: {
    chainId: number;
    token: string;
    buyCurrency: string;
    price: number;
    isPublished: boolean;
  };
  disabled: boolean; 
}

const PublishOnChain: React.FC<PublishOnChainProps> = ({
  chainId,
  disabled,
  deployedPlan,
  field
}) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const subcontract: any = useSubscriptionContract(SB_ADDRESS[chainId]);
  const token: any = useERC20Contract(field.token);
  const router = useRouter();
  const { account, library }: any = useActiveWeb3React();

  // Wait for the transaction using useWaitForTransaction
  //@ts-ignore
  const { data, isLoading, isError, isSuccess } = useWaitForTransaction({
    hash: hash,
    onSuccess: async (receipt) => {
      console.log("Transaction successful,receipt :", receipt);
      const sig = await getSignInfo(library, account);
      if (sig.error) {
        toast.error("Error signing transaction");
        return;
      } 
      const data: any = await webhookPlanCreated({
        planId: deployedPlan.id,
        isSuccess: true,
        chainId: chainId,
        sig: sig.sig,
        address: account,
        token:field.token,
        timestamp: sig.timestamp,
        hash: receipt.transactionHash
      });
      if (data.error) {
        toast.error("Error creating plan please try again");
      }
      toast.success("Plan created successfully");
    }
  });

  const createPlan = async (
    planId: string,
    duration: number,
    title: string,
    description: string,
    status: boolean,
    buyCurrency: string,
    amount: number
  ) => {
    try {
      const sig = await getSignInfo(library, account);

      if (sig.error) {
        toast.error("Error signing transaction");
        return;
      }
      // Fetch token decimals
      const decimals = await token.decimals();
      const dur = duration > 12 ? 0 : duration;
      // Adjust the amount using BigNumber
      const adjustedAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

      // Send the transaction
      const txResponse = await subcontract.createPlan(
        planId,
        dur,
        title,
        description,
        adjustedAmount,
        status,
        buyCurrency
      );

      // Set the transaction hash to wait for it
      setHash(txResponse.hash);

      console.log("Transaction submitted, waiting for confirmation...");
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };
  // Transaction success or failure handling
  if (data && !isLoading) {
    console.log("Transaction successful:", data);

    if (!field.isPublished) {
      router.push("/plans");
    }
  }

  if (isError) {
    console.error("Transaction failed!");
  }

  return (
    <div className="sm:w-40 md:w-48">
      <Button
        variant="gradientOne"
        type="button"
        onClick={() =>
          createPlan(
            deployedPlan.id,
            deployedPlan.duration,
            deployedPlan.name,
            deployedPlan.description,
            true,
            field.token,
            field.price
          )
        }
        className="w-full text-sm"
        disabled={chainId !== field.chainId || isLoading || field.isPublished || disabled} // Disable in various conditions
      >
        {isLoading
          ? "Processing..."
          : field.isPublished
            ? "Published"
            : chainId !== field.chainId
              ? "Switch chain to Publish"
              : "Publish Now"}
      </Button>
    </div>
  );
};

export default PublishOnChain;
