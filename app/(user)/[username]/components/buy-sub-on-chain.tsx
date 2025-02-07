import React, { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";

import { Button } from "@/components/ui/button";

import { useERC20Contract, useSubscriptionContract } from "@/hooks/use-web3";
import { useBuySubscription } from "@/hooks/useBuySubscription";
import { useTokenApproval } from "@/hooks/useTokenApproval";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { SB_ADDRESS } from "@/configs";

interface BuySubOnChainProps {
  chainId: number;
  creator: string;
  planId: string;
  duration: number;
  field: {
    chainId: number;
    token: string; // Token address
    buyCurrency: string;
    price: number; // Price in smallest token unit
    isPublished: boolean;
  };
  onPurchase: (field: any) => void; // Trigger when the purchase is successful
}

// Map chain IDs to block explorers
const EXPLORERS: Record<number, string> = {
  1: "https://etherscan.io/tx/",
  56: "https://bscscan.com/tx/",
  137: "https://polygonscan.com/tx/",
  42161: "https://arbiscan.io/tx/"
};

const BuySubOnChain: React.FC<BuySubOnChainProps> = ({
  chainId,
  creator,
  planId,
  field,
  duration,
  onPurchase
}) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [fees, setFees] = useState(null);
  useEffect(() => {
    getFee();
  }, []);
  // Initialize subscription contract dynamically based on chainId
  const subcontract: any = useSubscriptionContract(SB_ADDRESS[chainId]);
 
  const { account } = useActiveWeb3React();
  const getFee = async () => {
    const fee = await subcontract._checkFeeByBadges(creator, account, duration);
    console.log("fee", fee);
    setFees(fee);
  };

  // Use the buy subscription hook
  const { buySubscription, isTransactionPending, isTransactionSuccess, isTransactionError } =
    useBuySubscription(subcontract, planId, creator, duration);
  // Use token approval hook
  const {
    approveToken,
    isApproved,
    hash: approvalHash
  } = useTokenApproval(
    field.token,
    SB_ADDRESS[chainId], // contract address
    field.price,
    fees
  );

  // Handle successful transaction
  useEffect(() => {
    if (isTransactionSuccess && hash) {
      onPurchase(field); // Trigger callback
      window.location.reload()
      console.log(`Transaction Sent: ${hash}`);
    }
  }, [isTransactionSuccess, hash, onPurchase, field]);

  // Handle transaction error
  useEffect(() => {
    if (isTransactionError) {
      console.error("Transaction failed.");
    }
  }, [isTransactionError]);

  // Get the block explorer URL for the current chain
  const explorerUrl = EXPLORERS[chainId] || "https://etherscan.io/tx/";

  return (
    <div className="sm:w-40 md:w-48">
      {!isApproved ? (
        <Button
          variant="gradientOne"
          type="button"
          onClick={approveToken} // Approve tokens before purchasing
          className="w-full text-sm"
          disabled={!field.isPublished || isTransactionPending || !field.isPublished}
        >
          {!field.isPublished
            ? "Not Published Yet"
            : isTransactionPending
              ? "Approving..."
              : "Approve Tokens"}
        </Button>
      ) : (
        <Button
          variant="gradientOne"
          type="button"
          onClick={async () => {
            await buySubscription(); // Execute subscription purchase
            setHash(hash); // Set transaction hash for tracking
          }}
          className="w-full text-sm"
          disabled={chainId !== field.chainId || isTransactionPending || !field.isPublished}
        >
          {isTransactionPending
            ? "Processing..."
            : field.isPublished
              ? "Subscribe Now"
              : "Not Published Yet"}
        </Button>
      )}
      {hash && (
        <div className="mt-2 text-xs text-gray-500">
          View transaction:{" "}
          <a
            href={`${explorerUrl}${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {hash.slice(0, 10)}...
          </a>
        </div>
      )}
    </div>
  );
};

export default BuySubOnChain;
