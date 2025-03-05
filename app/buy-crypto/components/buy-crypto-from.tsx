"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { env } from "@/configs";
import { useActiveWeb3React } from "@/hooks/web3-connect";

// CoinGecko IDs for the tokens
// Use "base-protocol" for Base Protocol (~$0.40).
// If you actually want the ~$0.0000047 Base token, use "base".
const coinGeckoIds: { [key: string]: string } = {
  ETH: "ethereum",
  BASE: "base-protocol",
};

/**
 * Fetch a MoonPay quote for ETH only.
 * (MoonPay doesn't support "base-protocol".)
 * This version uses the test endpoint along with parameters that simulate a UK user.
 */
async function fetchMoonPayQuote(
  fiatAmount: string | number,
  fiatCurrency: string
) {
  const moonPayApiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY;
  if (!moonPayApiKey) {
    throw new Error("MoonPay API key is missing. Check your .env.local setup.");
  }

  const query = new URLSearchParams({
    apiKey: moonPayApiKey,
    baseCurrencyAmount: String(fiatAmount),
    baseCurrencyCode: fiatCurrency,
    areFeesIncluded: "true",
    paymentMethod: "credit_debit_card", // Simulate card purchase fees
    country: "GB", // Simulate a UK user
  });

  // Use the test endpoint (MoonPay sandbox)
  const url = `https://api.moonpay.io/v3/currencies/eth/quote?${query.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch quote from MoonPay (test env).");
  }
  return await response.json();
}

export default function BuyCryptoForm() {
  const { account } = useActiveWeb3React();

  // State variables
  const [payAmount, setPayAmount] = useState("");
  const [payCurrency, setPayCurrency] = useState("GBP"); // Default fiat currency set to GBP
  const [getCurrency, setGetCurrency] = useState("ETH"); // "ETH" or "BASE"
  const [getAmount, setGetAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // On mount, check for query parameters for transaction status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionStatus = params.get("transactionStatus");
    if (transactionStatus) {
      if (transactionStatus === "completed") {
        toast.success("Payment successful!");
      } else if (transactionStatus === "failed") {
        toast.error("Payment failed. Please try again.");
      } else if (transactionStatus === "pending") {
        toast.info("Payment is pending, please wait.");
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  /**
   * Whenever `payAmount`, `payCurrency`, or `getCurrency` changes,
   * fetch either the MoonPay quote (for ETH) or the CoinGecko price (for BASE).
   */
  useEffect(() => {
    if (payAmount !== "") {
      const timeout = setTimeout(async () => {
        try {
          if (getCurrency === "ETH") {
            // Use MoonPay quote for ETH
            const quoteData = await fetchMoonPayQuote(payAmount, payCurrency);
            if (quoteData && typeof quoteData.quoteCurrencyAmount === "number") {
              // Round to three decimals
              setGetAmount(quoteData.quoteCurrencyAmount.toFixed(2));
            } else {
              setGetAmount("");
            }
          } else if (getCurrency === "BASE") {
            // Use CoinGecko for BASE
            const tokenId = coinGeckoIds.BASE;
            const cgUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${payCurrency.toLowerCase()}`;
            const cgRes = await fetch(cgUrl);
            const cgData = await cgRes.json();
            const tokenPrice = cgData[tokenId]?.[payCurrency.toLowerCase()];
            if (tokenPrice) {
              // Manual conversion: amount / price
              const converted = parseFloat(payAmount) / tokenPrice;
              // Round to three decimals
              setGetAmount(converted.toFixed(2));
            } else {
              setGetAmount("");
            }
          }
        } catch (error) {
          console.error("Error fetching quote:", error);
          setGetAmount("");
        }
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setGetAmount("");
    }
  }, [payAmount, payCurrency, getCurrency]);

  /**
   * Handle the "Buy Now" button click.
   * Posts payload to your backend for a MoonPay URL.
   */
  const handleBuy = async () => {
    if (!payAmount || !account?.toLowerCase()) {
      toast.error("Please enter the amount and your wallet address.");
      return;
    }

    setIsLoading(true);

    // Payload for the backend
    const payload = {
      currencyCode: getCurrency,
      walletAddress: account.toLowerCase(),
      baseCurrencyAmount: parseFloat(payAmount),
      baseCurrencyCode: payCurrency,
    };

    try {
      const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/buy-crypto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      handleBuyCrypto(data.url);
    } catch (error) {
      console.error("Error purchasing crypto:", error);
      toast.error("Failed to generate purchase URL.");
      setIsLoading(false);
    }
  };

  /**
   * Redirects to the returned URL in the same tab.
   * The final transaction result will be determined via the webhook,
   * and your backend should eventually redirect the user with query parameters
   * indicating transactionStatus (e.g., completed, failed, pending).
   */
  const handleBuyCrypto = (URL: string) => {
    if (URL) {
      window.open(URL, '_blank', 'noopener,noreferrer'); // Opens URL in a new tab securely
    } else {
      toast.error("Buy crypto URL not received.");
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div className="contain_er" style={styles.container}>
        <h1 style={styles.title}>Buy Crypto</h1>
        {/* <h6 style={styles.subtitle}>Purchase Dehub with GBP</h6> */}

        {/* "You Pay" Section */}
        <div style={styles.formGroup}>
          {/* <label style={styles.label}>You Pay</label> */}
          <div className="input_Row" style={styles.inputRow}>
            <h3 className="sub_t" style={styles.subtitle2}>Spend</h3>
            <input
              type="number"
              placeholder="0.00"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              style={styles.input}
              disabled={isLoading}
            />
            <select
              value={payCurrency}
              onChange={(e) => setPayCurrency(e.target.value)}
              style={styles.select}
              disabled={isLoading}
            >
              <option value="GBP">GBP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* "You Get" Section */}
        <div style={styles.formGroup}>
          {/* <label style={styles.label}>You Get</label> */}
          <div className="input_Row" style={styles.inputRow}>
          <h3 className="sub_t" style={styles.subtitle2}>Buy</h3>
            <input
              type="text"
              placeholder="0.00"
              value={getAmount}
              readOnly
              style={styles.input}
            />
            <select
              value={getCurrency}
              onChange={(e) => setGetCurrency(e.target.value)}
              style={styles.select}
              disabled={isLoading}
            >
              <option value="ETH">ETH</option>
              <option value="BASE">BASE</option>
            </select>
          </div>
        </div>

        {/* Buy Button */}
        <button style={styles.buyButton} onClick={handleBuy} disabled={isLoading}>
          {isLoading ? "Processing..." : "Buy Crypto"}
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    margin: 0,
    padding: 0,
    backgroundColor: "#121212",
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    display: "block",
  },
  container: {
    color: "#fff",
    fontFamily: "sans-serif",
    marginTop: "8rem",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "2rem",
    boxSizing: "border-box",
    maxWidth: "600px",
    width: "100%",
    fontSize: "1.5rem",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  subtitle: {
    color:"#ffffff",
    marginBottom: "25px",
    opacity: ".5",
  },
  subtitle2: {
    color:"#ffffff",
    opacity: ".5",
    width: "100px",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.75rem",
    fontSize: "1.25rem",
    opacity: 0.9,
  },
  inputRow: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "10px",
    height: "80px",
    padding: "0 20px",
  },
  input: {
    // flex: 1,
    backgroundColor: "#1E1E1E",
    border: "0px solid #333",
    // color: "#fff",
    // borderRadius: "4px",
    // padding: "1rem",
    fontSize: "1.5rem",
    boxShadow: "none !important",
    height: "77px",
  borderRight: "1px solid rgb(51, 51, 51)",
  width:"100%",
  },


  select: {
    backgroundColor: "#1E1E1E",
    border: "0px solid #333",
    color: "#fff",
    borderRadius: "4px",
    width: "90px",
    fontSize: "18px",
  },
  buyButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#2962FF",
    border: "none",
    borderRadius: "30px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "2rem",
    fontWeight: 600,
    backgroundImage: "linear-gradient(to right, #8cc0fc , #4288f7)",
    maxWidth: "150px", 
    margin: "50px auto 0 auto",
    display: "flex",
  justifyContent: "center",
  },

 
};
