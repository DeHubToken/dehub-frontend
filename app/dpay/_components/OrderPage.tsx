"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { Link } from "lucide-react";
import { FaCoins, FaDollarSign, FaWallet } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { miniAddress } from "@/libs/strings";

import { dpayCreateOrder, getDpayPrice, getSupply } from "@/services/dpay";

import { supportedNetworks } from "@/web3/configs";
import { getAuthParams, getSignInfo } from "@/web3/utils/web3-actions";

import { chainIcons, ChainId, isDevMode, supportedCurrencies, supportedTokens } from "@/configs";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const POLL_INTERVAL_MS = 10000;

type DpayCreateOrderData = {
  sessionId: string;
};

type DpayCreateOrderApiResponse = {
  success: boolean;
  data?: DpayCreateOrderData;
  error?: string;
};

const OrderPage = () => {
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(10);
  const [selectedChainId, setSelectedChainId] = useState(
    isDevMode ? ChainId.BSC_TESTNET : ChainId.BASE_MAINNET
  );
  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  const [tokenSymbol, setTokenSymbol] = useState("DHB");
  // List of allowed chains
  const allowedChainIds = [ChainId.BSC_TESTNET, ChainId.BASE_MAINNET, ChainId.BSC_MAINNET];

  // Filter once and memoize (optional for performance)
  const filteredChains = useMemo(
    () => supportedNetworks.filter((c) => allowedChainIds.includes(c.chainId)),
    [supportedNetworks]
  );

  // Get the label of the selected chain
  const selectedChainLabel = useMemo(() => {
    return filteredChains.find((c) => c.chainId === selectedChainId)?.label || "Select Chain";
  }, [filteredChains, selectedChainId]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { account, chainId, library }: any = useActiveWeb3React();

  const [supplyData, setSupplyData] = useState<{
    [chainId: string]: {
      [token: string]: number;
    };
  }>({});

  const tokensToReceive = useMemo(() => {
    if (!tokenPrice) return 0;
    return amount / tokenPrice;
  }, [amount, tokenPrice]);

  const fetchTokenPrice = useCallback(async () => {
    try {
      const res = await getDpayPrice({ currency: selectedCurrency, chainId: selectedChainId }); // pass selectedCurrency to API
      const { success, data, error }: any = res;

      if (!success || !data) {
        console.error("Price fetch failed:", error);
        return;
      }

      const { price } = data;
      if (price) {
        setTokenPrice(price);
      }
    } catch (err) {
      toast.error("Failed to fetch token price");
      console.error("Failed to fetch token price:", err);
    }
  }, [selectedCurrency]);

  const fetchSupply = useCallback(async () => {
    try {
      const res = await getSupply();
      const { success, data, error }: any = res;

      if (!success || !data) {
        console.error("Supply fetch failed:", error);
        return;
      }

      setSupplyData(data.balance);
    } catch (err) {
      toast.error("Failed to fetch token supply");
      console.error("Supply fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchTokenPrice();
    fetchSupply();

    const interval = setInterval(() => {
      fetchTokenPrice();
      fetchSupply();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchTokenPrice, fetchSupply]);

  const handleConfirmCheckout = useCallback(async () => {
    console.log("sending....");
    if (!account) {
      toast.error("Please connect to Wallet");
      return;
    }
    setLoading(true);
    try {
      const sig = await getSignInfo(library, account);
      // const chainSupply = supplyData?.[selectedChainId]?.DHB || 0;
      // if (chainSupply === 0) {
      //   toast.error( " Purchase unavailable — no DEHUB supply on this chain.");
      //   setLoading(false);
      //   return;
      // }
      const stripe = await stripePromise;
      const data = {
        chainId: selectedChainId,
        address: account,
        receiverAddress: account,
        amount: amount,
        tokensToReceive,
        tokenSymbol,
        currency: selectedCurrency,
        redirect: window.location.origin,
        ...sig
      };
      const res: any = await dpayCreateOrder(data); 
      if (!res.success) {
        toast.error(res.error);
        return
      }
      const result = await stripe?.redirectToCheckout({ sessionId: res.data.sessionId });
      if (result?.error) alert(result.error.message);
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  }, [amount, tokensToReceive, account, chainId, selectedChainId]);

  useEffect(() => {
    const fun = async () => {
      const { sig, timestamp, error } = await getSignInfo(library, account);
      const parms = await getAuthParams(library, account);
      console.log("getAuthParams parms", parms);
    };

    fun();
  }, [account, library, chainId]);

  const openModal = async () => {
    if (!account) {
      toast.error("Please connect to Wallet");
      return;
    }

    setShowModal(true);
  };
  return (
    <div className="flex   items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-6   bg-slate-50  bg-opacity-5 shadow-xl">
        {/* DPay Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">DPay</h1>
          <p className="text-sm">Buy DeHub tokens using DPay</p>
        </div>
        <label className="mb-3 block text-sm font-medium">
          <div className="mb-1 flex items-center gap-2">Select Currency:</div>
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="h-10 w-full rounded-md bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportedCurrencies.map((cur) => (
                <SelectItem key={cur} value={cur}>
                  {cur.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        {/* Token Price */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <span>Current DEHUB Price:</span>
          <span className="font-semibold">
            {tokenPrice
              ? `${tokenPrice.toFixed(4)} ${selectedCurrency.toUpperCase()}`
              : "Loading..."}
          </span>
        </div>

        {/* USD Amount Input */}
        <label className="mb-3 block text-sm font-medium">
          <div className="mb-1 flex items-center gap-2">Amount [{selectedCurrency.toUpperCase()}]:</div>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-lg border focus:outline-none"
            min={1}
          />
        </label>

        {/* Wallet Address */}
        <label className="mb-3 block text-sm font-medium">
          <div className="mb-1 flex items-center gap-2">
            <FaWallet /> Wallet Address:
          </div>
          <Input
            type="text"
            value={miniAddress(account) || ""}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border px-4 py-2"
          />
        </label>
        <label className="mb-3 block text-sm font-medium">
          <div className="mb-1 flex items-center gap-2">
            <Link className=" size-4 font-bold" /> Select Chain:
          </div>

          <Select
            value={`${selectedChainId}`}
            onValueChange={(value) => setSelectedChainId(Number(value))}
          >
            <SelectTrigger className="h-10 min-w-32 rounded-md bg-transparent dark:bg-transparent">
              <SelectValue>
                {" "}
                <span className="flex gap-1">
                  <Image
                    src={chainIcons[selectedChainId]}
                    alt={`${selectedChainLabel} Icon`}
                    width={25}
                    height={25}
                  />
                  <span>{selectedChainLabel}</span>{" "}
                </span>
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {filteredChains.map(({ chainId, label }) => (
                <SelectItem key={chainId} value={`${chainId}`}>
                  <div className="flex items-center gap-4">
                    <Image src={chainIcons[chainId]} alt={`${label} Icon`} width={25} height={25} />
                    <span className="text-lg">{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        {/* Token Estimate */}
        <div className="mb-5 text-center text-sm">
          <FaCoins className="mx-auto mb-1" />
          You’ll receive approximately{" "}
          <span className="font-semibold text-indigo-600">{tokensToReceive.toFixed(2)} DEHUB</span>
        </div>

        {/* Trigger Modal */}
        <Button onClick={openModal} disabled={loading} className="w-full" variant={"gradientOne"}>
          {loading ? "Processing..." : "Buy with Dpay"}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-xl p-6">
          <div className="space-y-4">
            <h2 className="text-center text-xl font-semibold">Confirm Purchase</h2>

            <div className="rounded-lg p-4 text-sm shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span>{selectedCurrency.toUpperCase()} Amount</span>
                <span className="font-medium">{amount.toFixed(2)} [{selectedCurrency.toUpperCase()}]</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span>Approx Receive {tokenSymbol}</span>
                <span className="font-medium">{tokensToReceive.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Wallet Address</span>
                <span className="max-w-[160px] truncate text-right text-xs font-medium">
                  {miniAddress(account)}
                </span>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleConfirmCheckout} disabled={loading}>
                {loading ? "Processing..." : "Confirm & Pay"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPage;
