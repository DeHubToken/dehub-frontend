"use client";

import { ChainIconById } from "@/app/components/ChainIconById";
import SubscriptionGroupList from "@/app/components/join-subscription-group";

import { CheckCircle } from "@/components/icons/check-circle";
import { CirclePlus } from "@/components/icons/circle-plus";
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

/* ----------------------------------------------------------------------------------------------- */

export function SubscriptionModal({ avatarImageUrl, displayName, aboutMe = "", plans = [] }: any) {
  const { account, chainId } = useActiveWeb3React();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full">
          <CirclePlus /> Subscribe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-[1200px] overflow-auto sm:rounded-3xl">
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
              {aboutMe ?? "Hello! Thank you for supporting me!!"}
            </span>
          </div>
        </DialogHeader>
        <div className="mt-8 flex max-h-fit flex-wrap  gap-6 overflow-scroll">
          {plans.map((plan: any, key: number) => {
            return (
              <SubscriptionCard key={key}>
                <SubscriptionCardHeader>
                  <SubscriptionCardTitle>{plan.name}</SubscriptionCardTitle>
                  <SubscriptionCardDescription>{plan.description}</SubscriptionCardDescription>
                </SubscriptionCardHeader>
                {!plan.alreadySubscribed && (
                  <SubscriptionPricing
                    chainId={chainId}
                    chains={plan?.chains}
                    tier={plan?.tier}
                    duration={plan?.duration}
                    planId={plan.id}
                    creator={plan?.address}
                  />
                )}{" "}
                {plan.alreadySubscribed && (
                  <div>
                    <h5>Purchased and Active</h5>
                  </div>
                )}
                <SubscriptionBenefits benefits={plan?.benefits || []} />
                <SubscriptionGroupList plan={plan} />
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
        "ml-auto mr-auto mt-0 flex max-h-fit min-w-[calc((250/16)*1rem)] max-w-[calc((250/16)*1rem)] flex-col items-center gap-8 rounded-lg border bg-theme-mine-shaft-dark  py-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft md:m-0"
      )}
    />
  );
}

export function SubscriptionCardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "border-theme-monochrome-600 flex  flex-col items-center gap-4 border-b px-5",
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
                className="flex w-full flex-col items-center gap-2 rounded-lg border p-4 shadow-sm"
              >
                <h2 className="text-lg font-bold">
                  {" "}
                  <ChainIconById chainId={chain.chainId} label={true} />
                </h2>
                <p className="text-center text-sm text-red-500">
                  Not supported ( <ChainIconById chainId={chain.chainId} label={true} />)
                </p>
              </div>
            );
          }

          return (
            <div
              key={chain.chainId}
              className="flex w-full flex-col items-center gap-2 rounded-lg border p-4 shadow-sm"
            >
              <h2 className="text-lg font-bold">
                <ChainIconById chainId={chain.chainId} label={true} />
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
    <ul className="relative flex flex-col gap-3">
      {benefits.map((benefit, key: number) => (
        <li key={key} className="relative flex items-center gap-4 pl-8">
          <CheckCircle className=" absolute left-1 top-1" />
          <span className="text-xs">{benefit}</span>
        </li>
      ))}
    </ul>
  );
}
