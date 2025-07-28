"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { getSuccessTotal } from "@/services/dpay";

import TokenAndChainIcon from "./TokenAndChainIcon";

type TotalData = {
  chainId: number;
  tokenSymbol: string;
  total: number;
};

const TransferSummary = () => {
  const [data, setData] = useState<TotalData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGetSuccessTotal = async () => {
    try {
      setLoading(true);
      const res = await getSuccessTotal();
      if (res.success) {
        setData([
          // {
          //   chainId: 8453,
          //   tokenSymbol: "DHB",
          //   total: 0
          // },
          ...res.data
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetSuccessTotal();
  }, []);

  if (loading)
    return (
      <div className="flex w-full max-w-[350px] flex-col gap-8">
        <h2 className="text-3xl font-semibold">Transfers Summary</h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="w-max min-w-80 space-y-6 rounded-2xl border border-green-300 bg-theme-neutrals-900 p-8">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="h-10 w-full animate-pulse rounded-md bg-green-500 bg-theme-neutrals-500">
                <p className="text-base font-bold opacity-0">Loading</p>
              </div>
            </div>
            <h1 className="flex items-start justify-start gap-1 text-3xl font-semibold text-green-600">
              <div className="w-full animate-pulse rounded-md bg-theme-neutrals-500">
                <h1 className="flex items-start justify-start text-3xl font-semibold opacity-0">
                  Loading...
                </h1>
              </div>
            </h1>
          </div>
        </div>
      </div>
    );
  if (data.length <= 0) return null;

  return (
    <div className="flex w-full max-w-[350px] flex-col gap-8">
      <h2 className="text-3xl font-semibold">Transfers Summary</h2>

      <div className="grid grid-cols-1 gap-4">
        {data.map((item, index) => {
          return (
            <div
              className="w-max min-w-80 space-y-6 rounded-2xl border border-green-300 bg-theme-neutrals-900 p-8 shadow-[0px_0px_50px_5px] shadow-green-200/20"
              key={index}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <TokenAndChainIcon tokenSymbol={item.tokenSymbol} chainId={item.chainId} />
                <p className="text-base font-bold">{item.tokenSymbol}</p>
              </div>
              <h1 className="flex items-start justify-start gap-1 text-3xl font-semibold text-green-600">
                {item.total.toLocaleString()}
                <ArrowUpRight className="size-5 animate-bounce text-green-500" />
              </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransferSummary;
