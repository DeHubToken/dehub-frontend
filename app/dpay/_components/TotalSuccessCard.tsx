"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { getSuccessTotal } from "@/services/dpay";

import { chainIcons, supportedTokens } from "@/configs";

import TokenAndChainIcon from "./TokenAndChainIcon";

type TotalData = {
  chainId: number;
  tokenSymbol: string;
  total: number;
};

const TotalSuccessGrid = () => {
  const [data, setData] = useState<TotalData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGetSuccessTotal = async () => {
    try {
      setLoading(true);
      const res = await getSuccessTotal();
      if (res.success) {
        setData([
          {
            chainId: 8453,
            tokenSymbol: "DHB",
            total: 0
          },
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

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (data.length <= 0) return null;

  return (
    <div className="w-full p-6 hover:bg-gray-50 hover:bg-opacity-10 " >
      <h2 className="mb-8 text-3xl font-bold  ">
        Transfers Summary
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2">
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="min-w-48 rounded-2xl border p-5 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Header Row */}
              <div className="mb-4 flex items-center justify-between">
                <TokenAndChainIcon tokenSymbol={item.tokenSymbol} chainId={item.chainId} />
                {/* Badge */}
                <div className="mt-1 inline-block rounded-full px-3 py-1 text-xl font-medium  ">
                  {item.tokenSymbol}
                </div>
              </div>

              {/* Total with Increment Arrow */}
              <div className="mt-2 flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
                {item.total.toLocaleString()}
                <ArrowUpRight className="animate-bounce-slow h-5 w-5 text-green-500" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalSuccessGrid;
