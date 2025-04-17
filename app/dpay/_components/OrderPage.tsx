"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { FaCoins, FaDollarSign, FaWallet } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input.new";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { miniAddress } from "@/libs/strings";

import { dpayCreateOrder, getDpayPrice } from "@/services/dpay";

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
  const [usdAmount, setUsdAmount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { account, chainId } = useActiveWeb3React();

  const tokensToReceive = useMemo(() => {
    if (!tokenPrice) return 0;
    return usdAmount / tokenPrice;
  }, [usdAmount, tokenPrice]);
  const fetchTokenPrice = useCallback(async () => {
    try {
      const res = await getDpayPrice();

      const { success, data, error } :any= res;

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
  }, []);

  useEffect(() => {
    fetchTokenPrice();
    const interval = setInterval(fetchTokenPrice, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchTokenPrice]);

  const handleConfirmCheckout = useCallback(async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const res: any = await dpayCreateOrder({
        chainId,
        address: account,
        receiverAddress: account,
        amount: usdAmount,
        tokensToReceive,
        redirect: window.location.origin
      });

      console.log("res", res);
      const result = await stripe?.redirectToCheckout({ sessionId: res.data.sessionId });
      if (result?.error) alert(result.error.message);
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  }, [usdAmount, tokensToReceive, account, chainId]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-6 shadow-xl">
        {/* DPay Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">DPay</h1>
          <p className="text-sm">Buy DeHub tokens using DPay</p>
        </div>

        {/* Token Price */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <span>Current DEHUB Price:</span>
          <span className="font-semibold">
            {tokenPrice ? `$${tokenPrice.toFixed(4)}` : "Loading..."}
          </span>
        </div>

        {/* USD Amount Input */}
        <label className="mb-3 block text-sm font-medium">
          <div className="mb-1 flex items-center gap-2">
            <FaDollarSign /> USD Amount:
          </div>
          <Input
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(Number(e.target.value))}
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
            value={account || ""}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border px-4 py-2"
          />
        </label>

        {/* Token Estimate */}
        <div className="mb-5 text-center text-sm">
          <FaCoins className="mx-auto mb-1" />
          You’ll receive approximately{" "}
          <span className="font-semibold text-indigo-600">{tokensToReceive.toFixed(2)} DEHUB</span>
        </div>

        {/* Trigger Modal */}
        <Button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="w-full"
          variant={"gradientOne"}
        >
          {loading ? "Processing..." : "Buy with Dpay"}
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-xl p-6">
          <div className="space-y-4">
            <h2 className="text-center text-xl font-semibold">Confirm Purchase</h2>

            <div className="rounded-lg   p-4 text-sm shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span>USD Amount</span>
                <span className="font-medium">${usdAmount.toFixed(2)}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span>DEHUB to Receive</span>
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
