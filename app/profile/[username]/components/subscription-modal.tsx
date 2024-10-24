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

import { cn } from "@/libs/utils";

/* ----------------------------------------------------------------------------------------------- */

export function SubscriptionModal() {
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
            src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Avatar"
            className="size-16 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-2xl">Name</span>
            <span className="text-theme-monochrome-300 text-sm">
              Hello! Thank you for supporting me!!
            </span>
          </div>
        </DialogHeader>
        <div className="mt-8 flex flex-wrap gap-6">
          <SubscriptionCard>
            <SubscriptionCardHeader>
              <SubscriptionCardTitle>Tier one</SubscriptionCardTitle>
              <SubscriptionCardDescription>
                Tier Description. Description about the tire goes here.
              </SubscriptionCardDescription>
            </SubscriptionCardHeader>
            <SubscriptionPricing price="$10" tier="1 month" />
            <SubscriptionBenefits benefits={["Benefit 1"]} />
          </SubscriptionCard>

          <SubscriptionCard>
            <SubscriptionCardHeader>
              <SubscriptionCardTitle>Tier two</SubscriptionCardTitle>
              <SubscriptionCardDescription>
                Tier Description. Description about the tire goes here.
              </SubscriptionCardDescription>
            </SubscriptionCardHeader>
            <SubscriptionPricing price="$20" tier="3 month" />
            <SubscriptionBenefits benefits={["Benefit 1", "Benefits 2"]} />
          </SubscriptionCard>

          <SubscriptionCard>
            <SubscriptionCardHeader>
              <SubscriptionCardTitle>Tier three</SubscriptionCardTitle>
              <SubscriptionCardDescription>
                Tier Description. Description about the tire goes here.
              </SubscriptionCardDescription>
            </SubscriptionCardHeader>
            <SubscriptionPricing price="$50" tier="6 month" />
            <SubscriptionBenefits benefits={["Benefit 1", "Benefits 2", "Benefits 3"]} />
          </SubscriptionCard>

          <SubscriptionCard>
            <SubscriptionCardHeader>
              <SubscriptionCardTitle>Tier four</SubscriptionCardTitle>
              <SubscriptionCardDescription>
                Tier Description. Description about the tire goes here.
              </SubscriptionCardDescription>
            </SubscriptionCardHeader>
            <SubscriptionPricing price="$100" tier="12 month" />
            <SubscriptionBenefits
              benefits={["Benefit 1", "Benefits 2", "Benefits 3", "Benefits 4"]}
            />
          </SubscriptionCard>

          <SubscriptionCard>
            <SubscriptionCardHeader>
              <SubscriptionCardTitle>Tier five</SubscriptionCardTitle>
              <SubscriptionCardDescription>
                Tier Description. Description about the tire goes here.
              </SubscriptionCardDescription>
            </SubscriptionCardHeader>
            <SubscriptionPricing price="$200" tier="Lifetime" />
            <SubscriptionBenefits
              benefits={["Benefit 1", "Benefits 2", "Benefits 3", "Benefits 4", "Benefits 5"]}
            />
          </SubscriptionCard>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionCard(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex max-h-fit min-w-[calc((250/16)*1rem)] max-w-[calc((250/16)*1rem)] flex-col items-center gap-8 rounded-lg border bg-theme-mine-shaft-dark py-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft"
      )}
    />
  );
}

function SubscriptionCardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
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

function SubscriptionCardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 {...props} className={cn("text-lg font-bold", props.className)} />;
}

function SubscriptionCardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cn("text-theme-monochrome-300 text-xs", props.className)} />;
}

function SubscriptionPricing(
  props: React.HTMLAttributes<HTMLDivElement> & { price: string; tier: string }
) {
  const { price, tier, ...rest } = props;
  return (
    <div {...rest} className={cn("flex w-full flex-col items-center gap-3 px-5", rest.className)}>
      <h1 className="text-3xl">{price}</h1>
      <h2 className="text-theme-monochrome-200 text-sm">{tier}</h2>
      <Button className="w-full" variant="gradientOne">
        Subscribe
      </Button>
    </div>
  );
}

function SubscriptionBenefits(props: { benefits: string[] }) {
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
