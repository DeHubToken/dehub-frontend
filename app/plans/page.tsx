
"use client"
import React, { useState, useEffect } from "react";

import Form from "./components/form";
import Tiers from "./components/tiers";
import { useActiveWeb3React } from "@/hooks/web3-connect";
import { toast } from "sonner";
import { getPlans } from "@/services/subscription-plans";

const page = (props: any) => {
  const [plans, setPlans] = useState([])
  const { account, chainId } = useActiveWeb3React()
  async function getTiers() {
    if (!account) {
      return
    }
    const data: any = await getPlans({ address: account?.toLowerCase(), chainId });
    if (!data.success) {
      toast.error(data.error);
      return;
    }
    setPlans(data.data.plans);

  }

  useEffect(() => {
    getTiers()
  }, [])

  return (
    <div>
      <div className="min-h-screen w-full px-2 py-32 sm:px-6">
        <Form getTiers={getTiers} focus={props.searchParams.focus} />
      </div>
      <div className="min-h-screen w-full px-2 py-32 sm:px-6">
        <div className="flex h-auto w-full flex-col items-start justify-start gap-12 rounded-3xl border border-gray-200/25 px-4 pb-10 pt-10 sm:p-10">
          <div className="flex h-auto w-full flex-wrap items-center justify-center gap-6 text-center md:flex-nowrap md:justify-between md:gap-0 md:text-left">
            <div className="h-auto w-full space-y-2">
              <h1 className="text-4xl sm:text-5xl">My Subscription Tiers </h1>
              <p className="text-lg">Hare is the list of your Tiers</p>
            </div>
          </div>
          <div className="w-full items-center justify-center gap-6 sm:flex-nowrap ">
            <div className="  w-full items-stretch justify-center sm:w-auto ">

              <Tiers plans={plans} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
