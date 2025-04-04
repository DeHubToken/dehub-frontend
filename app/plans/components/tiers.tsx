"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "sonner";

import { ChainIconById } from "@/app/components/ChainIconById";

import { CheckCircle } from "@/components/icons/check-circle";
import { Button } from "@/components/ui/button";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { getPlans } from "@/services/subscription-plans";

import { supportedNetworks } from "@/web3/configs";

import { supportedTokens } from "@/configs";

type Props = {
  plans: any;
};

const Tiers = (props: Props) => {
  const { plans } = props;
  const { chainId } = useActiveWeb3React();
  const planFocusRef: any = useRef(null);

  useEffect(() => {
    planFocusRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [plans]);
  return (
    <div ref={planFocusRef} tabIndex={-1} className="mt-8 flex flex-wrap gap-6 ">
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
        "ml-auto mr-auto mt-0 flex max-h-fit min-w-[calc((250/16)*1rem)] max-w-[calc((250/16)*1rem)] flex-col items-center gap-8 rounded-lg border bg-theme-mine-shaft-dark py-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft md:m-0"
      )}
    />
  );
}

export function SubscriptionCardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "border-theme-monochrome-600 flex max-w-[calc((170/16)*1rem)] flex-col items-center gap-4 border-b px-1",
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
  console.log("object-chains", chains, supportedNetworks);
  return (
    <div {...rest} className={cn(" items-center gap-5 px-5", rest.className)}>
      <div className=" flex max-h-80 w-full flex-col gap-5 overflow-scroll">
        {chains.map((chain) => {
          const token: any = supportedTokens.find(
            (token) => token?.chainId === chain?.chainId && token.address === chain?.token
          );
          const network = supportedNetworks.find((n) => n?.chainId == token?.chainId);
          console.log("object-token", token, network);

          if (!token) {
            return (
              <div
                key={chain.chainId}
                className="shadow-sm flex w-full flex-col items-center gap-2 rounded-lg border p-4"
              >
                <ChainIconById chainId={chain.chainId} label={true} />
                <p className="text-sm text-red-500">Token Not Found</p>
              </div>
            );
          }

          return (
            <div
              key={chain.chainId}
              className="shadow-sm flex w-full flex-col items-center gap-2 rounded-lg border p-4"
            >
              <ChainIconById chainId={chain.chainId} label={true} />

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
      <Link href={`/plans/${id}?_=${new Date().getMilliseconds()}`}> 
        <Button className="mt-4 w-full" variant="gradientOne">
          Explore
        </Button>
      </Link>
    </div>
  );
}
export function SubscriptionBenefits(props: { benefits: string[] }) {
  const { benefits } = props;
  return (
    <ul className="relative flex flex-col gap-3">
      {benefits?.map((value: any, index: number) => (
        <li key={index} className="relative flex items-center gap-4 pl-8">
          <CheckCircle className=" absolute left-1 top-1" />
          <span className="text-xs">{value}</span>
        </li>
      ))}
    </ul>
  );
}
