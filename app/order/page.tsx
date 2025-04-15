"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

import { useActiveWeb3React } from "@/hooks/web3-connect";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const POLL_INTERVAL_MS = 10000; // 10 seconds

const OrderPage = () => {
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);
  const [usdAmount, setUsdAmount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const { account, library, chainId } = useActiveWeb3React();
  // 🧠 Memoized value to prevent recalculating tokens
  const tokensToReceive = useMemo(() => {
    if (!tokenPrice) return 0;
    return usdAmount / tokenPrice;
  }, [usdAmount, tokenPrice]);

  // 🚀 Memoized fetch function
  const fetchTokenPrice = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=dehub&vs_currencies=usd"
      );
      const price = data?.dehub?.usd;
      if (price) {
        setTokenPrice(price);
      }
    } catch (err) {
      console.error("Failed to fetch token price:", err);
    }
  }, []);

  // ⏲ Realtime fetch with cleanup
  useEffect(() => {
    fetchTokenPrice(); // initial fetch

    const interval = setInterval(() => {
      fetchTokenPrice();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [fetchTokenPrice]);

  // 🧾 Memoized checkout handler
  const handleCheckout = useCallback(async () => {
    setLoading(true);
    const stripe = await stripePromise;
    const res = await axios.post("/api/create-checkout-session", { amount: usdAmount });

    const result = await stripe?.redirectToCheckout({ sessionId: res.data.id });
    if (result?.error) alert(result.error.message);
    setLoading(false);
  }, [usdAmount]);

  return (
    <div className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Buy DeHub Token</h1>
      <p className="mb-2">
        Current DEHUB Price:{" "}
        <span className="font-medium text-green-600">
          {tokenPrice ? `$${tokenPrice.toFixed(4)}` : "Loading..."}
        </span>
      </p>

      <label className="mb-2 block">
        USD Amount:
        <input
          type="number"
          value={usdAmount}
          onChange={(e) => setUsdAmount(Number(e.target.value))}
          className="w-full rounded border px-3 py-2"
          min={1}
        />
      </label>

      <p className="mb-4">
        You will receive approximately <strong>{tokensToReceive.toFixed(2)}</strong> DEHUB
      </p>

      <button
        onClick={handleCheckout}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy with Stripe"}
      </button>
    </div>
  );
};

export default OrderPage;
