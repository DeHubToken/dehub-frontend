"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { getSupply } from "@/services/dpay";

import TokenAndChainIcon from "./TokenAndChainIcon";

const SupplyMonitor = () => {
  const [supplyData, setSupplyData] = useState<{
    [chainId: string]: {
      [token: string]: number;
    };
  }>({});

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
    fetchSupply();
  }, [fetchSupply]);

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-medium">📦 Token Supply Monitor</h1>

      {Object.keys(supplyData).length === 0 ? (
        <p className="text-xs  ">Loading supply data...</p>
      ) : (
        <div className="w-full space-y-6">
          {Object.entries(supplyData).map(([cid, tokens]) => (
            <div key={cid} className="space-y-4">
              {/* Tokens inline */}
              <div className="space-y-4">
                {Object.entries(tokens).map(([symbol, value]) => (
                  <div
                    key={symbol}
                    className="flex w-max items-center justify-start gap-6 rounded-lg border border-theme-neutrals-700 p-6"
                  >
                    <TokenAndChainIcon chainId={Number(cid)} tokenSymbol={symbol} />
                    <p className="text-base">
                      {symbol} :{" "}
                      <span className="font-medium">
                        {Number(value) === 0 ? (
                          <span className="text-red-500">No Supply</span>
                        ) : (
                          Number(value).toLocaleString(undefined, {
                            maximumFractionDigits: 4
                          })
                        )}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplyMonitor;
