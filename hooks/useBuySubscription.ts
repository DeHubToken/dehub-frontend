/* eslint-disable */

import { useCallback, useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { toast } from "sonner";
import { useWaitForTransactionReceipt } from "wagmi";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { buyPlan, webhookPlanPurchased } from "@/services/subscription-plans";

import { calculateGasMargin, GAS_MARGIN } from "@/web3/utils/transaction";
import { getSignInfo } from "@/web3/utils/web3-actions";

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
  const [subscriptionId, setSubscriptionId] = useState<number | undefined>(undefined);
  // Use web3-react active account
  const {
    account,
    chainId,
    library
  }: { chainId: number; account: `0x${string}` | undefined; library: any } = useActiveWeb3React();

  // Track transaction status
  const {
    isLoading: isTransactionPending,
    isSuccess: isTransactionSuccess,
    isError: isTransactionError
  } = useWaitForTransactionReceipt({
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
      const sig = await getSignInfo(library, account);
      if (sig.error||!sig.sig||!sig.timestamp) {
        toast.error("Failed to sign the transaction");
        return;
      }
      // Validate input parameters
      if (!planId || !creator || duration <= 0) {
        toast.error("Invalid subscription details provided.");
        return;
      }

      // API Call to create subscription
      const { data, error }: any = await buyPlan({ planId, account ,sig:sig?.sig,timestamp:sig?.timestamp});

      if (!data?.success) {
        toast.error(error || "Failed to Buy subscription.");
        return;
      }
      const subscriptionId = data?.data?.id;

      if (!subscriptionId) {
        toast.error("Subscription creation failed, missing subscription ID.");
        return;
      }
      setSubscriptionId(subscriptionId);
      // Estimate gas price with a 10% increase
      const dur = duration > 12 ? 0 : duration;
      const estimatedGasPrice = await library.getGasPrice();
      const adjustedGasPrice = estimatedGasPrice.mul(BigNumber.from(130)).div(BigNumber.from(100));
      const estimatedGasLimit = await subcontract?.estimateGas?.buySubscription(
        creator,
        subscriptionId,
        dur
      );

      //@ts-ignore
      const txResponse: any = await subcontract.buySubscription(creator, subscriptionId, dur, {
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: adjustedGasPrice
      });
      setHash(txResponse.hash); // Set transaction hash for tracking

      toast.success(`Transaction submitted. Hash: ${txResponse.hash}`);
      console.log("Transaction submitted. Waiting for confirmation...");
    } catch (error: any) {
      console.error("Error during subscription purchase:", error);
      toast.error(
        error.message ||
          "An error occurred during the subscription purchase. Check console for details."
      );
    }
  };

  useEffect(() => {
    if (isTransactionSuccess) {
      callSuccessWebhook();
    }
    if (isTransactionError) {
      toast.error("Transaction failed. Please try again.");
      console.error("Transaction failed.");
    }
  }, [isTransactionSuccess, isTransactionError]);

  const callSuccessWebhook = useCallback(async () => {
    if (!account) {
      toast.error("Please connect your wallet.");
      return;
    }
    if (!subscriptionId) {
      toast.error("Subscription creation failed, missing subscription ID.");
      return;
    }
    toast.success("Subscription purchase successful!");
    console.log("Subscription purchase successful!");
    const sig = await getSignInfo(library, account);
    if (sig.error) {
      toast.error("Failed to sign the transaction");
      return;
    }
    await webhookPlanPurchased({
      planId,
      subId: subscriptionId,
      isSuccess: true,
      chainId,
      sig: sig.sig,
      address: account,
      timestamp: sig.timestamp
    });
  }, [isTransactionSuccess]);

  return { buySubscription, hash, isTransactionPending, isTransactionSuccess, isTransactionError };
};