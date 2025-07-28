"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "lucide-react";
import { FaCoins, FaWallet } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { NETWORK_URLS, supportedNetworks } from "@/web3/configs";
import { getAuthParams, getSignInfo } from "@/web3/utils/web3-actions";

import { chainIcons, ChainId, env, isDevMode, supportedCurrencies } from "@/configs";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const POLL_INTERVAL_MS = 10000;

type DpayCreateOrderData = {
  sessionId: string;
};

type DpayCreateOrderApiResponse = {
  success: boolean;
  data?: DpayCreateOrderData;
  error?: string;
};

const OrderForm = () => {
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);
  const [amount, setAmount] = useState<number>(10);
  const [selectedChainId, setSelectedChainId] = useState(
    isDevMode ? ChainId.BSC_TESTNET : ChainId.BASE_MAINNET
  );
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [termsAndServicesAccepted, setTermsAndServicesAccepted] = useState(false);

  const [tokenSymbol, setTokenSymbol] = useState("DHB");
  // List of allowed chains
  const allowedChainIds = [ChainId.BSC_TESTNET, ChainId.BASE_MAINNET];

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
    if (!tokenPrice || !amount || tokenPrice <= 0) return 0;
    const grossTokens = amount / tokenPrice;
    const fee = grossTokens * 0.1; // 10% fee
    const netTokens = grossTokens - fee;
    return netTokens;
  }, [amount, tokenPrice]);
  const fetchTokenPrice = useCallback(async () => {
    try {
      const res = await getDpayPrice({
        currency: selectedCurrency,
        tokenSymbol,
        amount,
        chainId: selectedChainId
      }); // pass selectedCurrency to API
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
  }, [selectedCurrency, amount, tokenSymbol]);

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
  }, [showModal]);

  useEffect(() => {
    fetchTokenPrice();
    fetchSupply();

    const interval = setInterval(() => {
      fetchTokenPrice();
      fetchSupply();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchTokenPrice, fetchSupply, showModal]);

  const handleConfirmCheckout = useCallback(async () => {
    if (!account) {
      toast.error("Please connect to Wallet");
      return;
    }
    if (!termsAndServicesAccepted) {
      toast.error("Please accept the Terms and Service");
      return;
    }
    setLoading(true);
    try {
      const sig = await getSignInfo(library, account);
      const chainSupply = supplyData?.[selectedChainId]?.[tokenSymbol] || 0;
      if (chainSupply === 0) {
        toast.error(` Purchase unavailable — no ${tokenSymbol} supply on this chain.`);
        setLoading(false);
        return;
      }
      if (chainSupply <= tokensToReceive) {
        toast.error(
          `Insufficient ${tokenSymbol} supply: only ${chainSupply} available on this chain.`
        );
        setLoading(false);
        return;
      }
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe is not initialized");
        return;
      }
      const data = {
        chainId: selectedChainId,
        address: account,
        receiverAddress: account,
        amount: amount,
        tokensToReceive,
        tokenSymbol,
        currency: selectedCurrency,
        redirect: window.location.origin,
        termsAndServicesAccepted,
        ...sig
      };
      const res: any = await dpayCreateOrder(data);
      if (!res.success) {
        toast.error(res.error);
        return;
      }

      const result = await stripe?.redirectToCheckout({ sessionId: res.data.sessionId });
      if (result?.error) alert(result.error.message);
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  }, [
    amount,
    tokensToReceive,
    account,
    chainId,
    selectedChainId,
    supplyData,
    termsAndServicesAccepted
  ]);

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
    <div className="w-full space-y-5 rounded-2xl border border-theme-neutrals-700 bg-theme-neutrals-900 p-8 sm:p-12">
      <div className="w-full space-y-2 text-center">
        <h1 className="text-4xl font-semibold">Top Up</h1>
        <p className="text-sm sm:text-base">
          Buy $DHB using card and get free gas to use instantly
        </p>
      </div>

      {/* Currency */}
      <div className="w-full space-y-2">
        <Label htmlFor="currency">Select Currency:</Label>
        <Select name="currency" value={selectedCurrency} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="h-auto rounded-full bg-theme-neutrals-800 px-4 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {supportedCurrencies.map(({ code, enabled }) => (
              <SelectItem key={code} value={code}>
                {code.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm">Current DHB Price:</p>
          <p className="text-sm">
            {tokenPrice
              ? `${tokenPrice.toFixed(7)} ${selectedCurrency.toUpperCase()}`
              : "Loading..."}
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="w-full space-y-2">
        <Label htmlFor="amount">Amount [USD]:</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min={1}
          name="amount"
          className="h-auto rounded-full bg-theme-neutrals-800 px-4 py-2 text-base"
        />
      </div>

      {/* Wallet Address */}
      <div className="w-full space-y-2">
        <Label htmlFor="wallet" className="flex items-center gap-2">
          <FaWallet /> Wallet Address:
        </Label>
        <Input
          type="text"
          value={miniAddress(account) || ""}
          readOnly
          name="wallet"
          className="h-auto cursor-not-allowed rounded-full bg-theme-neutrals-800 px-4 py-2 text-base"
        />
      </div>

      {/* Chain Selection */}
      <div className="w-full space-y-2">
        <Label htmlFor="chain" className="flex items-center gap-2">
          <Link className="size-4" />
          Select Chain:
        </Label>
        <Select
          name="chain"
          value={`${selectedChainId}`}
          onValueChange={(value) => setSelectedChainId(Number(value))}
        >
          <SelectTrigger className="h-auto rounded-full bg-theme-neutrals-800 px-4 text-base">
            <SelectValue>
              {" "}
              <span className="flex gap-2">
                <Image
                  src={chainIcons[selectedChainId]}
                  alt={`${selectedChainLabel} Icon`}
                  width={25}
                  height={25}
                  className="size-6"
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
      </div>

      {/* Token Estimate */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-center">
        <FaCoins />
        <p className="text-sm">
          You’ll receive approximately{" "}
          <span className="font-semibold text-indigo-600">{tokensToReceive.toFixed(2)} DEHUB</span>
        </p>
      </div>

      {/* Trigger Modal */}
      <Button
        onClick={openModal}
        disabled={loading}
        className="w-full text-base"
        variant={"gradientOne"}
      >
        {loading ? "Processing..." : "Buy now"}
      </Button>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="space-y-4 rounded-2xl p-8">
          <h1 className="text-center text-3xl font-semibold">Confirm Purchase</h1>

          <div className="w-full">
            <div className="flex w-full items-center justify-between border-b border-theme-neutrals-700 py-4">
              <p className="text-base">{selectedCurrency.toUpperCase()} Amount :</p>
              <p className="text-base font-semibold">
                {amount.toFixed(2)} [{selectedCurrency.toUpperCase()}]
              </p>
            </div>
            <div className="flex w-full items-center justify-between border-b border-theme-neutrals-700 py-4">
              <p className="text-base">Approx Receive {tokenSymbol} :</p>
              <p className="text-base font-semibold">{tokensToReceive.toFixed(2)}</p>
            </div>
            <div className="flex w-full items-center justify-between border-b border-theme-neutrals-700 py-4">
              <p className="text-base">Wallet Address :</p>
              <p className="text-base font-semibold">{miniAddress(account)}</p>
            </div>
            <div className="mt-6 flex items-center justify-start gap-2">
              <Input
                type="checkbox"
                checked={termsAndServicesAccepted}
                onChange={(e) => setTermsAndServicesAccepted(e.target.checked)}
                className="h-5 w-5 bg-theme-neutrals-900 p-1"
                name="terms"
              />
              <Label className="text-sm" htmlFor="terms">
                I accept the{" "}
                <a
                  href="https://docs.dhb.gg/docs/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  Terms and Service
                </a>
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-4">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={loading}
              className="w-full rounded-full border-theme-neutrals-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCheckout}
              disabled={loading}
              variant="gradientOne"
              className="w-full"
            >
              {loading ? "Processing..." : "Confirm & Pay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderForm;
