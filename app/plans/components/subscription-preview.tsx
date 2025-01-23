"use client";

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

import { useUser } from "@/hooks/use-user";

import { cn } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";

/* ----------------------------------------------------------------------------------------------- */
interface Props {
  tiers: any;
}
export function SubscriptionModalPreView({ tiers = [] }: Props) {
  const {user}: any = useUser(); 
  const displayName = user?.result?.displayName;
  const avatarImageUrl = user?.result?.avatarImageUrl;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="default" size="sratch" className="rounded-full">
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] sm:rounded-3xl max-h-[80vh] overflow-auto">
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
        <div className="mt-8 flex flex-wrap gap-6">
          {tiers?.map((tier: any, index: number) => (
            <SubscriptionCard>
              <SubscriptionCardHeader>
                <SubscriptionCardTitle>{tier?.name}</SubscriptionCardTitle>
                <SubscriptionCardDescription>{tier?.description}</SubscriptionCardDescription>
              </SubscriptionCardHeader>
              <SubscriptionPricing price={tier?.price} tier={tier?.duration} />
              <SubscriptionBenefits benefits={tier?.benefits} />
            </SubscriptionCard>
          ))}
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
        "flex max-w-full m-auto  flex-col items-center gap-8 rounded-lg border bg-theme-mine-shaft-dark py-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft"
      )}
    />
  );
}

export function SubscriptionCardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "border-theme-monochrome-600 flex  w-full flex-col items-center gap-4 border-b px-5",
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

export function SubscriptionPricing(
  props: React.HTMLAttributes<HTMLDivElement> & { price: string; tier: string }
) {
  const { price, tier, ...rest } = props;
  return (
    <div {...rest} className={cn("flex w-full flex-col items-center gap-3 px-5", rest.className)}>
      <h1 className="text-3xl">{price}</h1>
      <h2 className="text-theme-monochrome-200 text-sm">{tier}</h2>
      <Button className="w-3xs" variant="gradientOne">
        Subscribe
      </Button>
    </div>
  );
}

export function SubscriptionBenefits(props: { benefits: string[] }) {
  const { benefits } = props;
  return (
    <ul className="flex flex-col gap-3 relative">
      {benefits?.map(({ value }: any, index: number) => (
        <li key={index} className="flex items-center gap-4 pl-8 relative ">
          <CheckCircle className=" absolute left-1 top-1" />
          <span className="text-xs">{value}</span>
        </li>
      ))}
    </ul>
  );
}
