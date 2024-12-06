import React, { useState } from "react";
import { BigNumber } from "ethers";
import { useWaitForTransaction } from "wagmi";

import { Button } from "@/components/ui/button";

import { useERC20Contract, useSubscriptionContract } from "@/hooks/use-web3";

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
  disabled:boolean;
  onPublish: (field: any) => void;
}

const PublishOnChain: React.FC<PublishOnChainProps> = ({
  chainId,
  disabled,
  deployedPlan,
  field,
  onPublish
}) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const subcontract: any = useSubscriptionContract(SB_ADDRESS[chainId]);
  const token: any = useERC20Contract(field.token);

  // Wait for the transaction using useWaitForTransaction
  const { data, isLoading, isError } = useWaitForTransaction({
    hash // Transaction hash for monitoring
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
      // Fetch token decimals
      const decimals = await token.decimals();
      console.log("Decimals:", decimals);

      // Adjust the amount using BigNumber
      const adjustedAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
      // Send the transaction
      const txResponse = await subcontract.createPlan(
        planId,
        duration,
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
      onPublish(field); // Trigger onPublish callback to update state
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
        disabled={chainId !== field.chainId || isLoading || field.isPublished||disabled} // Disable in various conditions
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
