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
  const { account, chainId } = useActiveWeb3React();
  const [tnxId, setTnxId] = useState(null);

  useWaitForTransaction({
    hash: tnx?.hash,
    onSuccess(data) {
      const obj = {
        tnxId,
        status: data.status,dmId,
        tnxHash: data.transactionHash
      };
      updateDMTnx(obj)
        .then((res) => {
          const { success, data: dmTnxData, error }: any = res;
          if (!success) {
            toast.error(error);
          }
          callback();
          setIsProcessing(false);
        })
        .catch((err) => {
          const { success, data: dmTnxData, error } = err;
          toast.error(error);
          setIsProcessing(false);
        });
    },
    onError(err) {
      toast.error(err.message);
    }
  });

  useEffect(() => {
    if (purchaseOptions.length > 0) {
      const defaultToken = purchaseOptions[0].address; // Automatically select the first token in the list
      setSelectedToken(defaultToken);
    }
  }, [purchaseOptions]);

  const fetchDecimals = async () => {
    return await tokenContract?.decimals();
  };

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

    try {
      const decimals = await fetchDecimals();
      if (!decimals) {
        toast.error("Unable to fetch token decimals.");
        return;
      }
      setIsProcessing(true);
      const adjustedAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
      const data = await tokenContract.transfer(sender?.address, adjustedAmount, {
        gasLimit: "50000"
      });
      setTnx(data);
      const transactionData = {
        messageId,
        senderAddress: account, // or sender's address from props/context
        receiverAddress: sender?.address, // The receiver's address
        chainId: chainId,
        amount,
        tokenAddress:selectedToken,
        type: "paid-dm",
        transactionHash: data.hash,
        dmId,
        description: `For Paid Content Sent ${amount} ${token.symbol} to ${sender?.address}`
      };
      const saveTnx = await saveDMTnx(transactionData);
      const { success, data: tnxData, error }: any = saveTnx;
      if (!success) {
        toast.error(error);
      }
      setTnxId(tnxData._id || tnxData.data._id);
    } catch (error: any) {
      toast.error(error.message);
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
                  {isProcessing ? <Spinner /> : "Send Fund"}
                </button>
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
