"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BigNumber } from "ethers";
import { toast } from "sonner";
import { useWaitForTransaction } from "wagmi";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { useERC20Contract } from "@/hooks/use-web3";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { saveDMTnx, updateDMTnx } from "@/services/dm";

import { supportedNetworks } from "@/web3/configs";
import { getAvatarUrl } from "@/web3/utils/url";

import { supportedTokens } from "@/configs";

import { useMessage } from "./provider";

const TipModal = () => {
  const {
    toggleTipModal: isOpen,
    handleToggleTipModal,
    selectedMessage
  }: any = useMessage("BlockModal");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const token = supportedTokens?.find((t) => t.address === selectedToken);
  const [amount, setAmount] = useState(0);
  const { account, chainId } = useActiveWeb3React();
  const [selectAddress, setSelectAddress] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);
  const tokenContract: any = useERC20Contract(selectedToken);
  const [tnx, setTnx] = useState<any>();
  const [tnxId, setTnxId] = useState(null);
  const handleInputChange = (e: any) => {
    const value = +e.target.value;
    if (value < 0) {
      setAmount(0);
      return;
    }
    setAmount(value);
  };
  const { participants, conversationType,_id: dmId  } = selectedMessage; 
  useEffect(() => {
    setSelectAddress(participants[0].participant.address);
  }, [conversationType]);
  const fetchDecimals = async () => {
    return await tokenContract?.decimals();
  };
  const handleSendFund = async () => {
    try {
      const decimals = await fetchDecimals();
      if (!decimals) {
        toast.error("Unable to fetch token decimals.");
        return;
      }
      if (amount<=0) {
        toast.error("Enter Valid Amount.");
        return;
      }
      
      setIsProcessing(true);
      const adjustedAmount = BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
      const data = await tokenContract.transfer(selectAddress, adjustedAmount, {
        gasLimit: "50000"
      });
      setTnx(data);
      const transactionData = {
        messageId: null,
        senderAddress: account,
        receiverAddress: selectAddress,
        chainId: chainId,
        amount,
        tokenAddress: selectedToken,
        type: "tip",
        transactionHash: data.hash,
        dmId,
        description: `Tip Sent ${amount} ${token?.symbol ?? ""} to ${selectAddress}`
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
  useWaitForTransaction({
    hash: tnx?.hash,
    onSuccess(data) {
      const obj = {
        tnxId,
        status: data.status,
        tnxHash: data.transactionHash
      };
      updateDMTnx(obj)
        .then((res) => {
          const { success, data: dmTnxData, error }: any = res;
          if (!success) {
            toast.error(error);
          }
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
  return (
    <Dialog open={isOpen} onOpenChange={handleToggleTipModal}>
      <DialogContent>
        <h2 className="mb-4 text-lg font-bold">Tip</h2>
        <div className="  items-center gap-2 p-5">
          <label htmlFor="payment-amount" className="text-sm font-semibold">
            User
          </label>
          <Select value={selectAddress} onValueChange={(value: string) => setSelectAddress(value)}>
            <SelectTrigger className="h-10 min-w-32 rounded-md bg-transparent dark:bg-transparent">
              <SelectValue placeholder="Select User" />
            </SelectTrigger>
            <SelectContent>
              {participants.map(({ participant, role }: any, i: number) => {
                return (
                  <SelectItem key={i} value={participant.address}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={getAvatarUrl(participant.avatarImageUrl)}
                        width={24}
                        height={24}
                        alt={participant.username}
                        className="size-10"
                      />
                      {participant.p}
                      <span className="text-lg">{participant.username || participant.address}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="payment-amount" className="text-sm font-semibold">
            Enter Tip Amount
          </label>
          <div className="flex items-center gap-2 p-5">
            <Input
              id="payment-amount"
              type="number"
              value={amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Select
              value={selectedToken}
              onValueChange={(value: string) => setSelectedToken(value)}
            >
              <SelectTrigger className="h-10 min-w-32 rounded-md bg-transparent dark:bg-transparent">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {supportedTokens
                  .filter((t) => t.chainId == chainId)
                  .map((token, i: number) => {
                    const network = supportedNetworks.find((net) => net.chainId == token.chainId);
                    return (
                      <SelectItem key={i} value={token.address}>
                        <div className="flex items-center gap-4">
                          <Image
                            src={token.iconUrl}
                            width={24}
                            height={24}
                            alt={token.label}
                            className="size-10"
                          />
                          <span className="text-lg">{token.label}</span>
                          {network?.value || network?.chainId}
                        </div>
                      </SelectItem>
                    );
                  })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row justify-evenly gap-5">
            <button
              onClick={() => handleToggleTipModal(false)}
              disabled={isProcessing}
              className="mt-6 w-full rounded-lg bg-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Close
            </button>{" "}
            <Button
              disabled={isProcessing}
              onClick={handleSendFund}
              className="mt-6 w-full rounded-lg bg-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TipModal;