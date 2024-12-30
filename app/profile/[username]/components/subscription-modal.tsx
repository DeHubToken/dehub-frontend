"use client";

import Image from "next/image";
import { CirclePlus } from "lucide-react";

import { CheckCircle } from "@/components/icons/check-circle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { supportedNetworks } from "@/web3/configs";
import { getAvatarUrl } from "@/web3/utils/url";

import { supportedTokens } from "@/configs";

import BuySubOnChain from "./buy-sub-on-chain";
import SubscriptionGroupList from "@/app/components/join-subscription-group";

/* ----------------------------------------------------------------------------------------------- */

export function SubscriptionModal({ avatarImageUrl, displayName, plans = [] }: any) {
  const { account, chainId } = useActiveWeb3React();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="gradientOne" size="sratch" className="gap-2 py-5">
          <CirclePlus className="size-5" /> Subscribe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[1400px] sm:rounded-3xl">
        <DialogTitle className="sr-only">Subscribe</DialogTitle>
        <DialogDescription className="sr-only">Subscribe to my premium plans</DialogDescription>
        <DialogHeader className="flex flex-row gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAvatarUrl(avatarImageUrl)}
            alt="Avatar"
            className="size-16 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-2xl">{displayName}</span>
            <span className="text-theme-monochrome-300 text-sm">
              Hello! Thank you for supporting me!!
            </span>
          </div>
        </DialogHeader>
        <div className="mt-8 flex max-h-fit flex-wrap  gap-6 overflow-scroll">
          {plans.map((plan: any) => {
            return (
              <SubscriptionCard>
                <SubscriptionCardHeader>
                  <SubscriptionCardTitle>{plan.name}</SubscriptionCardTitle>
                  <SubscriptionCardDescription>{plan.description}</SubscriptionCardDescription>
                </SubscriptionCardHeader>
                <SubscriptionPricing
                  chainId={chainId}
                  chains={plan?.chains}
                  tier={plan?.tier}
                  duration={plan?.duration}
                  planId={plan.id}
                  creator={plan?.address}
                />
                <SubscriptionBenefits benefits={plan?.benefits || []} />
                <SubscriptionGroupList/>
              </SubscriptionCard>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
  chains: any;
  tier: number;
  duration: number;
  planId: string;
  creator: string;
}

export function SubscriptionPricing(props: SubscriptionPricingProps) {
  const { chains, tier, planId, duration, creator, chainId, ...rest } = props;
  return (
    <div {...rest} className={cn(" items-center gap-5 px-5", rest.className)}>
      <div className=" mb-5 flex max-h-80 w-full flex-col gap-5 overflow-scroll">
        {chains.map((chain: any) => {
          const token: any = supportedTokens.find(
            (token) => token?.chainId === chain?.chainId && token?.address === chain?.token
          );
          const network = supportedNetworks?.find((n) => n.chainId == token?.chainId);
          if (!token) {
            return (
              <div
                key={chain?.chainId}
                className="shadow-sm flex w-full flex-col items-center gap-2 rounded-lg border p-4"
              >
                <h2 className="text-lg font-bold">Chain {chain?.chainId}</h2>
                <p className="text-center text-sm text-red-500">Not supported (switch chain)</p>
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
              {chain.chainId == chainId && (
                <BuySubOnChain
                  planId={planId}
                  chainId={chainId}
                  creator={creator}
                  duration={duration}
                  field={chain}
                  onPurchase={() => {}}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SubscriptionBenefits(props: { benefits: string[] }) {
  const { benefits } = props;
  return (
    <ul className="flex flex-col gap-3">
      {benefits.map((benefit) => (
        <li key={benefit} className="flex items-center gap-4">
          <CheckCircle />
          <span className="text-xs">{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
