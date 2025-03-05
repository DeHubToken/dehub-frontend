"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { env } from "@/configs";
import { useActiveWeb3React } from "@/hooks/web3-connect";

const coinGeckoIds: { [key: string]: string } = {
  ETH: "ethereum",
  BASE: "base-protocol",
};

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
    paymentMethod: "credit_debit_card",
    country: "GB",
  });

  const url = `https://api.moonpay.io/v3/currencies/eth/quote?${query.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch quote from MoonPay (test env).");
  }
  return await response.json();
}

export default function BuyCryptoForm() {
  const { account } = useActiveWeb3React();

  const [payAmount, setPayAmount] = useState("");
  const [payCurrency, setPayCurrency] = useState("GBP");
  const [getCurrency, setGetCurrency] = useState("ETH");
  const [getAmount, setGetAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check transaction status in the URL
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

  useEffect(() => {
    // Fetch quotes or price data whenever payAmount/payCurrency/getCurrency changes
    if (payAmount !== "") {
      const timeout = setTimeout(async () => {
        try {
          if (getCurrency === "ETH") {
            const quoteData = await fetchMoonPayQuote(payAmount, payCurrency);
            if (quoteData && typeof quoteData.quoteCurrencyAmount === "number") {
              setGetAmount(quoteData.quoteCurrencyAmount.toFixed(2));
            } else {
              setGetAmount("");
            }
          } else if (getCurrency === "BASE") {
            const tokenId = coinGeckoIds.BASE;
            const cgUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=${payCurrency.toLowerCase()}`;
            const cgRes = await fetch(cgUrl);
            const cgData = await cgRes.json();
            const tokenPrice = cgData[tokenId]?.[payCurrency.toLowerCase()];
            if (tokenPrice) {
              const converted = parseFloat(payAmount) / tokenPrice;
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

  const handleBuy = async () => {
    if (!payAmount || !account?.toLowerCase()) {
      toast.error("Please enter the amount and your wallet address.");
      return;
    }

    setIsLoading(true);

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

  const handleBuyCrypto = (URL: string) => {
    if (URL) {
      window.open(URL, "_blank", "noopener,noreferrer");
    } else {
      toast.error("Buy crypto URL not received.");
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div className="contain_er" style={styles.container}>
        <h1 style={styles.title}>Buy Crypto</h1>

        <div style={styles.formGroup}>
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
              <option style={{background:'hsl(var(--theme-background))'}} value="GBP">GBP</option>
              <option style={{background:'hsl(var(--theme-background))'}} value="USD">USD</option>
              <option style={{background:'hsl(var(--theme-background))'}} value="EUR">EUR</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
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
              <option style={{background:'hsl(var(--theme-background))'}} value="ETH">ETH</option>
              <option style={{background:'hsl(var(--theme-background))'}} value="BASE">ETH (BASE)</option>
            </select>
          </div>
        </div>

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
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    display: "block",
    // No backgroundColor here, so it can be set in global CSS
  },
  container: {
    fontFamily: "sans-serif",
    marginTop: "8rem",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "2rem",
    boxSizing: "border-box",
    maxWidth: "600px",
    width: "100%",
    fontSize: "1.5rem",
    // No forced text color here
  },
  title: {
    fontSize: "3rem",
    marginBottom: "20px",
    // No forced text color
  },
  subtitle2: {
    opacity: 0.8,
    width: "100px",
    margin: 0,
    // No forced text color
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  inputRow: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    border: "1px solid #333",
    boxShadow: "none",
    borderRadius: "10px",
    height: "80px",
    padding: "0 20px",
    // No forced text color
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.5rem",
    boxShadow: "none",
    borderRight: "1px solid rgb(51, 51, 51)",
    width: "100%",
    height: "77px"
    // No forced text color
  },
  select: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    width: "90px",
    fontSize: "18px",
    outline: "none",
    cursor: "pointer",
    // No forced text color
  },
  buyButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "30px",
    color: "#fff", // OK to force white text for a button
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
