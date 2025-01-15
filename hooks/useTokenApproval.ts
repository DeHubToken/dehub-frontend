import { useState } from "react";
import { BigNumber } from "ethers";

import { useERC20Contract } from "@/hooks/use-web3"; // Adjust the import as necessary

export const useTokenApproval = (
  tokenAddress: string,
  spenderAddress: string,
  price: number,
  fees: any
) => {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
  const [isApproved, setIsApproved] = useState(false);
  const token: any = useERC20Contract(tokenAddress);

  const approveToken = async () => {
    try { 
      const decimals = await token.decimals(); // Replace with dynamic token decimals if needed 
      const adjustedPrice = BigNumber.from(price +1).mul(BigNumber.from(10).pow(decimals)).add(fees); 
      console.log("Initiating token approval...");
      const approvalTx = await token.approve(spenderAddress, adjustedPrice);
      setHash(approvalTx.hash); // Set approval transaction hash 
      console.log("Approval transaction submitted, waiting for confirmation...");
      await approvalTx.wait(); // Wait for approval transaction to confirm
      setIsApproved(true);
      console.log("Token approval successful!");
    } catch (error) {
      console.error("Error during token approval:", error);
    }
  };

  return { approveToken, isApproved, hash };
};
