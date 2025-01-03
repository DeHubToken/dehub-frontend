import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { toast } from "react-toastify";
import { parseEther } from "viem";
import { useSendTransaction, useWaitForTransaction } from "wagmi";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useERC20Contract } from "@/hooks/use-web3";

import { supportedNetworks } from "@/web3/configs";

import { supportedTokens } from "@/configs";

type Props = {
  toggleSendFund: boolean;
  handleToggleSendFund: (b: boolean) => void;
  type: "tip" | "tip-media";
  sender: { address: string; username: string; displayName: string };
  purchaseOptions: {
    isLocked: boolean;
    amount: string;
    address: string;
    chainId: number;
    _id: string;
  }[];
};

const PayNowModal = (props: Props) => {
  const { purchaseOptions, sender, toggleSendFund, handleToggleSendFund } = props;
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<null | string>(null);
  const tokenContract: any = useERC20Contract(selectedToken);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [decimals, setDecimals] = useState<number | null>(null);

  // Fetch decimals when the token contract is available
  useEffect(() => {
    const fetchDecimals = async () => {
      if (tokenContract) {
        const decimals = await tokenContract.decimals();
        setDecimals(decimals);
      }
    };
    fetchDecimals();
  }, [tokenContract]);

  const handleSendFund = async (option: {
    amount: string;
    address: string;
    chainId: number;
    _id: string;
  }) => {
    const { amount, address: tokenAddress } = option;
    const token = supportedTokens.find((t) => t.address === tokenAddress);
    if (token == null) {
      toast.error("Token not supported.");
      return;
    }

    setSelectedToken(token?.address);

    // Ensure decimals is set
    if (!decimals) {
      toast.error("Unable to fetch token decimals.");
      return;
    }

    const adjustedAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

    try {
      setIsProcessing(true);
      const data = await tokenContract.transfer(sender?.address, adjustedAmount);
      console.log("DDDDDDDDD", data);
      if(data){
        console.log("data aya")
      }else{
        console.log("koni aya")

      }

      setHash(data);
      setTransactionHash(data.hash);
    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  console.log("hash", hash);
  return (
    <Dialog open={toggleSendFund} onOpenChange={handleToggleSendFund}>
      <DialogContent className="shadow-lg max-w-lg rounded-lg p-6">
        <h2 className="mb-4 text-2xl font-semibold">Send Funds</h2>

        <p className="mb-6 text-sm text-gray-600">
          <span className="font-medium">{sender?.displayName || sender.username}</span>
        </p>

        <div className="space-y-4">
          {purchaseOptions.map((option) => {
            const token = supportedTokens.find((t) => t.address === option.address);
            const chain = supportedNetworks.find((c) => c.chainId === option.chainId);

            return (
              <div
                key={option._id}
                className="rounded-lg border bg-gray-50 p-4 transition hover:bg-gray-100"
              >
                <p className="text-sm text-gray-700">
                  Amount:
                  <span className="flex items-center gap-2 font-medium">
                    {option.amount}
                    <img
                      height={25}
                      width={25}
                      src={token?.iconUrl || "/fallback-token.png"}
                      alt={token?.symbol || "Token"}
                    />
                    {token?.symbol || "Unknown Token"}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  To Address: <span className="font-medium">{option.address}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Chain: <span className="font-medium">{chain?.label || "Unknown Chain"}</span>
                </p>
                <button
                  onClick={() => handleSendFund(option)}
                  disabled={isProcessing}
                  className={`mt-2 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white ${
                    isProcessing
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isProcessing ? <span className="spinner" /> : "Send Fund"}
                </button>
              </div>
            );
          })}
        </div>

        {transactionHash && (
          <div className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-green-700">
            <p>Transaction successful!</p>
            <p className="break-all">Hash: {transactionHash}</p>
          </div>
        )}

        <button
          onClick={() => handleToggleSendFund(false)}
          className="mt-6 w-full rounded-lg bg-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default PayNowModal;
