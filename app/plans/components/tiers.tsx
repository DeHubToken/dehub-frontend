"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from 'next/router';
import { CheckCircle } from "@/components/icons/check-circle";
import { Button } from "@/components/ui/button";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { getPlans } from "@/services/subscription-plans";

import { supportedNetworks } from "@/web3/configs";

import { supportedTokens } from "@/configs";

type Props = {
  focus: string
};

const Tiers = (props: Props) => {
  const { account, chainId } = useActiveWeb3React();
  const [plans, setPlans] = useState([]);

  const planFocusRef: any = useRef(null);

  useEffect(() => { 
    getTiers(); 
    planFocusRef.current?.focus();  
  }, [props.focus]);

  async function getTiers() {
    const data: any = await getPlans({ address: account?.toLowerCase(), chainId });
    if (!data.success) {
      toast.error(data.error);
      return;
    }
    setPlans(data.data.plans);
  }
  useEffect(() => {
    getTiers();
  }, []);
  return (
    <div ref={planFocusRef} tabIndex={-1}
      className="mt-8 flex flex-wrap gap-6">
      {plans.map((tier: any) => {
        return (
          <SubscriptionCard>
            <SubscriptionCardHeader>
              <SubscriptionCardTitle>{tier?.name}</SubscriptionCardTitle>
              <SubscriptionCardDescription>{tier?.description}</SubscriptionCardDescription>
            </SubscriptionCardHeader>

            <SubscriptionPricing
              chainId={chainId}
              chains={tier?.chains}
              tier={tier?.duration}
              id={tier.id}
            />
            <SubscriptionBenefits benefits={tier?.benefits} />
          </SubscriptionCard>
        );
      })}
    </div>
  );
};

export default Tiers;

export function SubscriptionCard(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex max-h-fit min-w-[calc((250/16)*1rem)] max-w-[calc((250/16)*1rem)] flex-col items-center gap-8 rounded-lg border bg-theme-mine-shaft-dark py-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft"
      )}
    />
  );
}

export function SubscriptionCardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "border-theme-monochrome-600 flex max-w-[calc((170/16)*1rem)] flex-col items-center gap-4 border-b px-5",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export function SubscriptionCardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 {...props} className={cn("text-lg font-bold", props.className)} />;
}

export function SubscriptionCardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn("text-theme-monochrome-300 text-xs", props.className)} />;
}

interface SubscriptionPricingProps extends React.HTMLAttributes<HTMLDivElement> {
  chainId: number;
  chains: Array<any>;
  tier: string;
  id: string;
}

export function SubscriptionPricing(props: SubscriptionPricingProps) {
  const { chains, tier, id, ...rest } = props;
  console.log("object-chains", chains, supportedNetworks)
  return (
    <div {...rest} className={cn(" items-center gap-5 px-5", rest.className)}>

      <div className=" flex w-full flex-col gap-5 max-h-80 overflow-scroll">
        {chains.map((chain) => {
          const token: any = supportedTokens.find(
            (token) => token?.chainId === chain?.chainId && token.address === chain?.token
          );
          const network = supportedNetworks.find((n) => n?.chainId == token?.chainId);
          console.log("object-token", token, network)

          if (!token) {
            return (
              <div
                key={chain.chainId}
                className="shadow-sm flex w-full flex-col items-center gap-2 rounded-lg border p-4"
              >
                <h2 className="text-lg font-bold">Chain {chain.chainId}</h2>
                <p className="text-sm text-red-500">Token Not Found</p>
              </div>
            );
          }

          return (
            <div
              key={chain.chainId}
              className="shadow-sm flex w-full flex-col items-center gap-2 rounded-lg border p-4"
            >
              <h2 className="text-lg font-bold">
                {token.label} ({network?.label})
              </h2>
              <div className="flex items-center gap-2">
                <span> Price:</span>
                <img src={token.iconUrl} alt={`${token.label} Icon`} className="h-6 w-6" />
                <p className="text-theme-monochrome-200 text-sm">
                  {chain.price} {token.symbol}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Button className="mt-4 w-full" variant="gradientOne">
        <Link href={`plans/${id}`}>Explore</Link>
      </Button>
    </div>
  );
}
export function SubscriptionBenefits(props: { benefits: string[] }) {
  const { benefits } = props;
  return (
    <ul className="flex flex-col gap-3">
      {benefits?.map((value: any, index: number) => (
        <li key={index} className="flex items-center gap-4">
          <CheckCircle />
          <span className="text-xs">{value}</span>
        </li>
      ))}
    </ul>
  );
}
