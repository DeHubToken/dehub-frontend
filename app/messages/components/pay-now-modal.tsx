import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { toast } from "sonner";
import { useWaitForTransaction } from "wagmi";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

import { useERC20Contract } from "@/hooks/use-web3";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { saveDMTnx, updateDMTnx } from "@/services/dm";

import { supportedNetworks } from "@/web3/configs";
import { calculateGasMargin, GAS_MARGIN } from "@/web3/utils/transaction";

import { supportedTokens } from "@/configs";

type Props = {
  messageId: string;
  dmId: string;
  callback: () => void;
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
  const {
    purchaseOptions,
    sender,
    toggleSendFund,
    handleToggleSendFund,
    messageId,
    dmId,
    callback
  } = props;

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedToken, setSelectedToken] = useState<null | string>(null);
  const tokenContract: any = useERC20Contract(selectedToken);
  const [tnx, setTnx] = useState<any>();
  const { account, chainId, library } = useActiveWeb3React();
  const [tnxId, setTnxId] = useState(null);

  useWaitForTransaction({
    hash: tnx?.hash,
    onSuccess(data) {
      const obj = {
        tnxId,
        status: data.status,
        dmId,
        tnxHash: data.transactionHash
      };
      updateDMTnx(obj)
        .then((res) => {
          const { success, error }: any = res;
          if (!success) {
            toast.error(error);
          } else {
            callback();
          }
          setIsProcessing(false);
        })
        .catch((err) => {
          toast.error(err.message || "Transaction update failed.");
          setIsProcessing(false);
        });
    },
    onError(err) {
      toast.error(err.message || "Transaction failed.");
      setIsProcessing(false);
    }
  });

  useEffect(() => {
    if (purchaseOptions.length > 0) {
      const defaultToken = purchaseOptions[0].address; // Automatically select the first token
      setSelectedToken(defaultToken);
    }
  }, [purchaseOptions]);

  const fetchDecimals = async () => {
    if (!tokenContract) return 18; // Default fallback to 18 decimals
    return await tokenContract.decimals();
  };

  const handleSendFund = async (option: {
    amount: string;
    address: string;
    chainId: number;
    _id: string;
  }) => {
    const { amount, address: tokenAddress } = option;
    const token = supportedTokens.find((t) => t.address === tokenAddress);

    if (!token) {
      toast.error("Token not supported.");
      return;
    }

    try {
      const decimals = await fetchDecimals();
      if (!decimals) {
        toast.error("Unable to fetch token decimals.");
        return;
      }

      setIsProcessing(true);
      const adjustedAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));

      // Check the balance of the sender
      const balance = await tokenContract.balanceOf(account);
      if (balance.lt(adjustedAmount)) {
        toast.error("Insufficient balance to complete the transaction.");
        setIsProcessing(false);
        return;
      }

      // Estimate gas price with a 10% increase
      const estimatedGasPrice = await library.getGasPrice();
      const adjustedGasPrice = estimatedGasPrice.mul(BigNumber.from(110)).div(BigNumber.from(100));

      // Estimate gas limit
      const estimatedGasLimit = await tokenContract.estimateGas.transfer(
        sender?.address,
        adjustedAmount
      );

      const data = await tokenContract.transfer(sender?.address, adjustedAmount, {
        gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
        gasPrice: adjustedGasPrice
      });

      setTnx(data);
      const transactionData = {
        messageId,
        senderAddress: account,
        receiverAddress: sender?.address,
        chainId: chainId,
        amount,
        tokenAddress: selectedToken,
        type: "paid-dm",
        transactionHash: data.hash,
        dmId,
        description: `For Paid Content Sent ${amount} ${token.symbol} to ${sender?.address}`
      };

      const saveTnx = await saveDMTnx(transactionData);
      const { success, data: tnxData, error }: any = saveTnx;
      if (!success) {
        toast.error(error);
        setIsProcessing(false);
        return;
      }

      setTnxId(tnxData._id || tnxData.data._id);
    } catch (error: any) {
      console.log("dddddddddddd",error)
      toast.error(error.message || "Transaction failed.");
      setIsProcessing(false);
    }
  };

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
                className="rounded-lg border  p-4 transition  "
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

                {chainId===chain?.chainId?<button
                  onClick={() => handleSendFund(option)}
                  disabled={isProcessing}
                  className={`mt-2 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium   ${
                    isProcessing
                      ? "cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isProcessing ? <Spinner /> : "Send Fund"}
                </button>:<div>Switch Chain to {chain?.label} pay</div>}
              </div>
            );
          })}
        </div>

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
