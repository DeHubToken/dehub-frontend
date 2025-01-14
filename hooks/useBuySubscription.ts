import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { toast } from "sonner";
import { useWaitForTransaction } from "wagmi";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { buyPlan } from "@/services/subscription-plans";

import { calculateGasMargin, GAS_MARGIN } from "@/web3/utils/transaction";

// Define type for the subcontract's method
interface SubscriptionContract {
  buySubscription: (
    address: string,
    subscriptionId: string | number,
    duration: number
  ) => Promise<{ hash: string }>;
  estimateGas: {
    buySubscription: (
      address: string,
      subscriptionId: string | number,
      duration: number
    ) => Promise<BigNumber>;
  };
}

// Define hook return type
interface UseBuySubscription {
  buySubscription: () => Promise<void>;
  hash: `0x${string}` | undefined;
  isTransactionPending: boolean;
  isTransactionSuccess: boolean;
  isTransactionError: boolean;
  
}

export const useBuySubscription = (
  subcontract: SubscriptionContract, // Type the subcontract
  planId: string,
  creator: string,
  duration: number
): UseBuySubscription => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  // Use web3-react active account
  const { account, library }: { account: `0x${string}` | undefined; library: any } =
    useActiveWeb3React();

  // Track transaction status
  const {
    isLoading: isTransactionPending,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError
  } = useWaitForTransaction({
    hash
  });

  const buySubscription = async (): Promise<void> => {
    try {
      console.log("Initiating subscription purchase...");

      // Check if wallet is connected
      if (!account) {
        toast.error("Please connect your wallet.");
        return;
      }

      // Validate input parameters
      if (!planId || !creator || duration <= 0) {
        toast.error("Invalid subscription details provided.");
        return;
      }

      // API Call to create subscription
      const { data }: any = await buyPlan({ planId, account });

      if (!data.success) {
        toast.error(data.error || "Failed to create subscription.");
        return;
      }
      console.log("data", data);
      const subscriptionId = data?.data?.id;
      if (!subscriptionId) {
        toast.error("Subscription creation failed, missing subscription ID.");
        return;
      }

      // Estimate gas price with a 10% increase
      const estimatedGasPrice = await library.getGasPrice();
      const adjustedGasPrice = estimatedGasPrice.mul(BigNumber.from(110)).div(BigNumber.from(100));  
      const estimatedGasLimit =await subcontract?.estimateGas?.buySubscription(
        creator,
        subscriptionId,
        duration
      );
      //@ts-ignore
      const txResponse: any = await subcontract.buySubscription(creator, subscriptionId, duration, {
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: adjustedGasPrice
      });
      setHash(txResponse.hash); // Set transaction hash for tracking

      toast.success(`Transaction submitted. Hash: ${txResponse.hash}`);
      console.log("Transaction submitted. Waiting for confirmation...");
    } catch (error) {
      console.error("Error during subscription purchase:", error);
      toast.error("An error occurred during the subscription purchase. Check console for details.");
    }
  };

  useEffect(() => {
    if (isTransactionSuccess) {
      toast.success("Subscription purchase successful!");
      console.log("Subscription purchase successful!");
    }

    if (isTransactionError) {
      toast.error("Transaction failed. Please try again.");
      console.error("Transaction failed.");
    }
  }, [isTransactionSuccess, isTransactionError]);

  return { buySubscription, hash, isTransactionPending, isTransactionSuccess, isTransactionError };
};
