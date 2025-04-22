"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSuccessTotal } from "@/services/dpay";
import { chainIcons, supportedTokens } from "@/configs";

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
            total: 0,
          },
          ...res.data,
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
    <div className="p-6">
      {/* <h2 className="mb-8 text-3xl font-bold text-gray-800">
        🚀 Transfers Summary
      </h2> */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {data.map((item, index) => {
          const token = supportedTokens.find((t) => t.symbol === item.tokenSymbol);
          const tokenIcon = token?.iconUrl ?? "";
          const chainIcon = chainIcons[item.chainId];

          return (
            <div
              key={index}
              className="rounded-2xl bg-white p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-transform hover:-translate-y-1"
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                    <Image
                      src={chainIcon}
                      alt={`Chain ${item.chainId}`}
                      height={40}
                      width={40}
                    />
                  </div>
                  
                </div>

                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <Image src={tokenIcon} alt={item.tokenSymbol} height={40} width={40} />
                </div>
              </div>

              {/* Total */}
              <div className="mt-2 text-2xl font-bold text-green-600">
                {item.total.toLocaleString()}
              </div>

              {/* Badge */}
              <div className="mt-1 inline-block rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                {item.tokenSymbol}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TotalSuccessGrid;
