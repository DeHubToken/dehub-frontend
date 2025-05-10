"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { getSupply } from "@/services/dpay";

import { chainIcons, supportedTokens } from "@/configs";

import TokenAndChainIcon from "./TokenAndChainIcon";

const SupplyBox = () => {
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
    <div className="rounded-xl  p-4 shadow-md  hover:bg-gray-50 hover:bg-opacity-5">
      <h2 className="mb-3 text-sm font-semibold  ">📦 Token Supply Monitor</h2>

      {Object.keys(supplyData).length === 0 ? (
        <p className="text-xs  ">Loading supply data...</p>
      ) : (
        <div className="  flex  flex-wrap  items-start justify-center gap-3 ">
          {Object.entries(supplyData).map(([cid, tokens]) => (
            <div key={cid} className="flex items-start gap-4">
              {/* Tokens inline */}
              <div className="flex flex-wrap items-center gap-3">
                {Object.entries(tokens).map(([symbol, value]) => (
                  <div
                    key={symbol}
                    className="flex items-center gap-2 rounded bg-gray-50 bg-opacity-10  px-2 py-1 text-xs shadow-sm"
                  >
                    <TokenAndChainIcon chainId={Number(cid)} tokenSymbol={symbol} />
                    <span className="font-medium  ">{symbol}</span>
                    <span className="ml-2  ">
                      {Number(value) === 0 ? (
                        <span className="text-red-500">No Supply</span>
                      ) : (
                        Number(value).toLocaleString(undefined, {
                          maximumFractionDigits: 4
                        })
                      )}
                    </span>
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

export default SupplyBox;
