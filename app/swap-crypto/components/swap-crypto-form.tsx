"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveWeb3React } from "@/hooks/web3-connect";
import { toast } from "sonner";
import { ethers } from "ethers";
import {
  getTokenBalance,
  approveToken,
  getPoolInfo,
  quoteAndLogSwap,
  prepareSwapParamsObject,
  executeSwap,
  tokens,
  POOL_FACTORY_CONTRACT_ADDRESS,
  QUOTER_CONTRACT_ADDRESS,
  SWAP_ROUTER_CONTRACT_ADDRESS,
} from "../helper/swapHelpers";

const provider = new ethers.providers.Web3Provider((window as any).ethereum);
const signer = provider.getSigner();

const ConnectButton = dynamic(() => import("@/components/fix-connect-button"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <Skeleton className="bg-theme-monochrome-500 h-12 w-[162px] rounded-full" />
    </div>
  ),
});

export default function SwapCryptoForm() {
  const [fromCurrency, setFromCurrency] = useState<"ETH" | "DHB">("ETH");
  const [toCurrency, setToCurrency] = useState<"ETH" | "DHB">("DHB");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { account } = useActiveWeb3React();

  const tokenIn = fromCurrency === "ETH" ? tokens.WETH : tokens.DHB;
  const tokenOut = fromCurrency === "ETH" ? tokens.DHB : tokens.WETH;

  useEffect(() => {
    if (!account || !fromAmount) {
      setToAmount("");
      return;
    }

    async function fetchOnChainQuote() {
      try {
        const factoryContract = new ethers.Contract(
          POOL_FACTORY_CONTRACT_ADDRESS,
          require("@/web3/abis/factory.json"),
          provider
        );
        const quoterContract = new ethers.Contract(
          QUOTER_CONTRACT_ADDRESS,
          require("@/web3/abis/quoter.json"),
          provider
        );

        const { fee } = await getPoolInfo(factoryContract, tokenIn, tokenOut);
        const amountIn = ethers.utils.parseUnits(fromAmount, tokenIn.decimals);

        const quotedAmountOut = await quoteAndLogSwap(
          quoterContract,
          fee,
          signer,
          amountIn,
          tokenIn,
          tokenOut
        );

        const outFormatted = ethers.utils.formatUnits(
          quotedAmountOut,
          tokenOut.decimals
        );
        setToAmount(outFormatted);
      } catch (error) {
        console.error("Error fetching on-chain quote:", error);
        setToAmount("");
      }
    }

    fetchOnChainQuote();
  }, [account, fromAmount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwapTransaction = async () => {
    if (!fromAmount || !account) {
      toast.error("Please enter an amount and connect your wallet.");
      return;
    }
    setLoading(true);

    try {
      console.log("Using network:", await provider.getNetwork());

      const factoryContract = new ethers.Contract(
        POOL_FACTORY_CONTRACT_ADDRESS,
        require("@/web3/abis/factory.json"),
        provider
      );
      const quoterContract = new ethers.Contract(
        QUOTER_CONTRACT_ADDRESS,
        require("@/web3/abis/quoter.json"),
        provider
      );

      const amountIn = ethers.utils.parseUnits(fromAmount, tokenIn.decimals);

      const balance = await getTokenBalance(
        tokenIn.address,
        tokenIn.decimals,
        signer
      );
      if (balance.lt(amountIn)) {
        toast.error("Insufficient balance.");
        setLoading(false);
        return;
      }

      await approveToken(tokenIn.address, amountIn, signer);

      const { fee } = await getPoolInfo(factoryContract, tokenIn, tokenOut);

      const quotedAmountOut = await quoteAndLogSwap(
        quoterContract,
        fee,
        signer,
        amountIn,
        tokenIn,
        tokenOut
      );

      const paramsObj = prepareSwapParamsObject(
        fee,
        amountIn,
        quotedAmountOut,
        signer,
        tokenIn,
        tokenOut
      );

      const swapRouter = new ethers.Contract(
        SWAP_ROUTER_CONTRACT_ADDRESS,
        require("@/web3/abis/swaprouter.json"),
        signer
      );

      await executeSwap(swapRouter, paramsObj, signer);

      toast.success("Swap transaction successful!");
      setFromAmount("");
      setToAmount("");
      setFromCurrency("ETH");
      setToCurrency("DHB");
    } catch (error: any) {
      console.error("Swap transaction error:", error);
      toast.error("Swap transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Swap Crypto</h1>
        </div>
        <div style={styles.swapCard}>
          <div style={styles.swapRow}>
            <div style={styles.amountColumn}>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.0"
                style={styles.amountInput}
                disabled={loading}
              />
            </div>
            <select
              style={styles.select}
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value as "ETH" | "DHB")}
              disabled={loading}
            >
              <option value="ETH">ETH</option>
              <option value="DHB">DHB</option>
            </select>
          </div>

          <div style={styles.swapIconContainer}>
            <button
              style={styles.swapIconBtn}
              onClick={handleSwapCurrencies}
              disabled={loading}
            >
              ↕
            </button>
          </div>

          <div style={styles.swapRow}>
            <div style={styles.amountColumn}>
              <input
                type="number"
                value={toAmount}
                readOnly
                placeholder="0.0"
                style={styles.amountInput}
              />
            </div>
            <select
              style={styles.select}
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value as "ETH" | "DHB")}
              disabled={loading}
            >
              <option value="ETH">ETH</option>
              <option value="DHB">DHB</option>
            </select>
          </div>

          <div style={styles.buttonRow}>
            {!account ? (
              <div style={styles.connectButtonContainer}>
                <ConnectButton label="Connect Wallet" />
              </div>
            ) : (
              <button
                style={styles.swapButton}
                onClick={handleSwapTransaction}
                disabled={loading}
              >
                {loading ? "Swapping..." : "Swap"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    margin: 0,
    padding: 0,
    // Removed forced black background so it adapts to any theme
    minHeight: "100vh",
    width: "100vw",
    boxSizing: "border-box",
    display: "block",
  },
  container: {
    // Remove forced white text so it inherits from the page/theme
    fontFamily: "sans-serif",
    marginTop: "8rem",
    marginLeft: "15%",
    padding: "2rem",
    boxSizing: "border-box",
    maxWidth: "600px",
    width: "100%",
    fontSize: "1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "3rem",
    margin: 0,
  },
  swapCard: {
    // Remove forced dark background
    borderRadius: "8px",
    padding: "2rem",
    // Use a neutral border or subtle background so it's visible on any theme
    border: "1px solid #ccc",
  },
  swapRow: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  amountColumn: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  amountInput: {
    // Use transparent background & inherited color
    backgroundColor: "transparent",
    color: "inherit",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1.25rem",
    padding: "0.75rem",
    marginBottom: "0.25rem",
  },
  select: {
    minWidth: "140px",
    backgroundColor: "transparent",
    color: "inherit",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1.25rem",
    padding: "0.75rem",
  },
  swapIconContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  swapIconBtn: {
    backgroundColor: "#00C98E", // keep your brand color
    border: "none",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    color: "#fff",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  buttonRow: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  connectButtonContainer: {
    minWidth: "200px",
  },
  swapButton: {
    backgroundColor: "#00C98E", // keep your brand color
    border: "none",
    borderRadius: "4px",
    padding: "1rem 2rem",
    color: "#fff",
    fontSize: "1.25rem",
    fontWeight: 600,
    cursor: "pointer",
    minWidth: "470px",
  },
};