"use client";

import React, { useState, useEffect } from "react";
import { useActiveWeb3React } from "@/hooks/web3-connect";
import { env } from "@/configs";
import { toast } from "sonner";

type Fiat = "usd" | "eur" | "gbp";

const coinGeckoIds: { [key: string]: string } = {
  ETH: "ethereum",
  Base: "base-protocol",
};

export default function SellCryptoForm() {
  const [sellAmount, setSellAmount] = useState("");
  const { account } = useActiveWeb3React();
  const [cryptoToken, setCryptoToken] = useState("ETH");
  const [fiatCurrency, setFiatCurrency] = useState("GBP");
  const [conversionResults, setConversionResults] = useState<Partial<Record<Fiat, number>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  // Check for transaction status in query parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionStatus = params.get("transactionStatus");
    const redirectParam = params.get("redirectUrl");
    if (transactionStatus) {
      if (transactionStatus === "completed") {
        toast.success("Sale successful!");
      } else if (transactionStatus === "failed") {
        toast.error("Sale failed. Please try again.");
      } else if (transactionStatus === "pending") {
        toast.info("Sale is pending, please wait.");
      }
      if (redirectParam) {
        setRedirectUrl(redirectParam);
      }
      // Clear query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Update conversion results based on sellAmount and cryptoToken
  useEffect(() => {
    if (sellAmount !== "") {
      const timeout = setTimeout(() => {
        const fetchPrice = async () => {
          try {
            const id = coinGeckoIds[cryptoToken];
            const cgRes = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd,eur,gbp`
            );
            const cgData = await cgRes.json();
            const priceUsd = cgData[id]?.usd;
            const priceEur = cgData[id]?.eur;
            const priceGbp = cgData[id]?.gbp;

            if (priceUsd && priceEur && priceGbp) {
              const amount = parseFloat(sellAmount);
              setConversionResults({
                usd: parseFloat((amount * priceUsd).toFixed(4)),
                eur: parseFloat((amount * priceEur).toFixed(4)),
                gbp: parseFloat((amount * priceGbp).toFixed(4)),
              });
            } else {
              setConversionResults({});
            }
          } catch (error) {
            console.error("Error fetching token price", error);
            setConversionResults({});
          }
        };
        fetchPrice();
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setConversionResults({});
    }
  }, [sellAmount, cryptoToken]);

  // Handle the sell process including the API call and redirect URL
  const handleSell = async () => {
    if (!sellAmount || !account?.toLowerCase()) {
      toast.error("Please enter the sell amount and your wallet address.");
      return;
    }

    // Start the loader
    setIsLoading(true);

    const fiatAmount = conversionResults[fiatCurrency.toLowerCase() as Fiat] || 0;
    const baseCurrencyAmount = parseFloat(sellAmount);

    const payload = {
      defaultBaseCurrencyCode: cryptoToken,
      baseCurrencyAmount,
      fiatAmount,
      quoteCurrencyCode: fiatCurrency,
      walletAddress: account?.toLowerCase(),
    };

    try {
      const response = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/sell-crypto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      handleSellCrypto(data.url);
    } catch (error) {
      console.error("Error selling crypto:", error);
      toast.error("Failed to generate MoonPay URL.");
      setIsLoading(false); // Stop the loader on error
    }
  };

  // Redirects to the URL in a new tab and stops the loader
  const handleSellCrypto = (URL: string) => {
    if (URL) {
      window.open(URL, "_blank", "noopener,noreferrer");
      setIsLoading(false);
    } else {
      toast.error("Sell crypto URL not received.");
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Sell Crypto</h1>

        {/* "You Sell" Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>You Sell</label>
          <div style={styles.inputRow}>
            <input
              type="number"
              placeholder="0.00"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              style={styles.input}
            />
            <select
              value={cryptoToken}
              onChange={(e) => setCryptoToken(e.target.value)}
              style={styles.select}
            >
              <option value="ETH">ETH</option>
              <option value="Base">Base</option>
            </select>
          </div>
        </div>

        {/* "You Receive" Section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>You Receive</label>
          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder="0.00"
              value={
                conversionResults[fiatCurrency.toLowerCase() as Fiat] !== undefined
                  ? conversionResults[fiatCurrency.toLowerCase() as Fiat]
                  : "0.00"
              }
              readOnly
              style={styles.input}
            />
            <select
              value={fiatCurrency}
              onChange={(e) => setFiatCurrency(e.target.value)}
              style={styles.select}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* Sell Button */}
        <button style={styles.sellButton} onClick={handleSell} disabled={isLoading}>
          {isLoading ? "Processing..." : "Sell Now"}
        </button>
      </div>

      {/* Loader Overlay (only shown when isLoading is true) */}
      {isLoading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.loaderText}>Processing...</div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    margin: 0,
    padding: 0,
    backgroundColor: "#121212",
    minHeight: "100vh",
    width: "100vw",
    boxSizing: "border-box",
    display: "block",
    position: "relative",
  },
  container: {
    color: "#fff",
    fontFamily: "sans-serif",
    marginTop: "8rem",
    marginLeft: "15%",
    padding: "2rem",
    boxSizing: "border-box",
    maxWidth: "600px",
    width: "100%",
    fontSize: "1.5rem",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: "3rem",
    marginBottom: "2rem",
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
  },
  input: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "4px",
    padding: "1rem",
    fontSize: "1.5rem",
  },
  select: {
    backgroundColor: "#1E1E1E",
    border: "1px solid #333",
    color: "#fff",
    borderRadius: "4px",
    padding: "1rem",
    fontSize: "1.5rem",
  },
  sellButton: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#D32F2F",
    border: "none",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "1.5rem",
    cursor: "pointer",
    marginTop: "2rem",
    fontWeight: 600,
  },
  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    fontSize: "2rem",
    color: "#fff",
    fontWeight: 600,
  },
};
