"use client";

import React, { useState, useEffect } from "react";
import { useActiveWeb3React } from "@/hooks/web3-connect";
import { env } from "@/configs";
import { toast } from "sonner";
import GBPICON from "@/assets/gbp-icon.png";
import USDICON from "@/assets/dollar-icon.png";
import EUROICON from "@/assets/euro-icon.png";
import ETHICON from "@/assets/ethereum-icon.png";
import BASEICON from "@/assets/base-icon.svg";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

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

  const handleSell = async () => {
    if (!sellAmount || !account?.toLowerCase()) {
      toast.error("Please enter the sell amount and your wallet address.");
      return;
    }
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
      setIsLoading(false);
    }
  };

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
      <div className="contain_er" style={styles.container}>
        <h1 style={styles.title}>Sell Crypto</h1>

        <div style={styles.formGroup}>
          <div className="input_Row" style={styles.inputRow}>
            <h3 className="sub_t" style={styles.subtitle2}>Sell</h3>
            <input
              type="number"
              placeholder="0.00"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              style={styles.input}
            />
            <div className="max-w-[70%]">
              <Select value={cryptoToken} onValueChange={setCryptoToken}>
                <SelectTrigger className="h-10 min-w-32 rounded-md bg-transparent dark:bg-transparent">
                  <SelectValue placeholder="Select Token" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { label: "ETH", icon: ETHICON },
                    { label: "Base", icon: BASEICON },
                  ].map((token) => (
                    <SelectItem key={token.label} value={token.label}>
                      <div className="flex items-center gap-4">
                        <Image src={token.icon} alt={`${token.label} Icon`} width={25} height={25} />
                        <span className="text-lg">{token.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div style={styles.formGroup}>
          <div className="input_Row" style={styles.inputRow}>
            <h3 className="sub_t" style={styles.subtitle2}>Receive</h3>
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
            <div className="max-w-[70%]">
              <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                <SelectTrigger className="h-10 min-w-32 rounded-md bg-transparent dark:bg-transparent">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { label: "USD", icon: USDICON },
                    { label: "EUR", icon: EUROICON },
                    { label: "GBP", icon: GBPICON },
                  ].map((currency) => (
                    <SelectItem key={currency.label} value={currency.label}>
                      <div className="flex items-center gap-4">
                        <Image src={currency.icon} alt={`${currency.label} Icon`} width={25} height={25} />
                        <span className="text-lg">{currency.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <button style={styles.sellButton} onClick={handleSell} disabled={isLoading}>
          {isLoading ? "Processing..." : "Sell Now"}
        </button>
      </div>

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
    minHeight: "100vh",
    width: "100%",
    boxSizing: "border-box",
    display: "block",
  },
  // Remove color: "#fff" so text can inherit from theme
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
  },
  title: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  // Remove forced white colors and let them inherit
  subtitle2: {
    opacity: ".5",
    width: "130px",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    backgroundColor: "transparent",
    border: "1px solid #333",
    borderRadius: "10px",
    height: "80px",
    padding: "0 20px",
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "1.5rem",
    boxShadow: "none",
    height: "77px",
    borderRight: "1px solid rgb(51, 51, 51)",
    width: "100%",
    // Let color inherit from theme or parent
  },
  select: {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    width: "90px",
    fontSize: "18px",
    // Let color inherit from theme or parent
  },
  sellButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "30px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "2rem",
    fontWeight: 600,
    backgroundImage: "linear-gradient(to right, #8cc0fc , #4288f7)",
    maxWidth: "150px",
    margin: "50px auto 0 auto",
    display: "flex",
    justifyContent: "center",
    // Let color inherit from theme or parent
    color: "#fff", // You can keep the button text white if your gradient background is dark
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
    fontWeight: 600,
    color: "#fff",
  },
};
