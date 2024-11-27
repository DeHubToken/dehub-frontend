/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { NFT } from "@/services/nfts";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { streamInfoKeys } from "@/configs";

import { useClaimBounty } from "../hooks/use-claim-bounty";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  // triggerProps?: React.ComponentProps<typeof Button>;
  triggerProps?: any;
  actionButtonProps?: React.ComponentProps<typeof Button>;
};

export function Modal(props: Props) {
  const {
    open,
    onOpenChange,
    title,
    description,
    triggerProps,
    actionButtonProps,
    cancelButtonProps
  } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {/* <Button className="gap-2 rounded-full" variant="gradientOne" {...triggerProps} /> */}
        {triggerProps}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-tanker text-4xl tracking-wider">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
          {description}
          <div className="flex size-auto items-center justify-center gap-4">
            <Button
              className="gap-2 rounded-full"
              variant="gradientOne"
              size="sratch"
              {...actionButtonProps}
            />
            <DialogClose asChild>
              <Button className="rounded-full" size="sratch" {...cancelButtonProps}>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ClaimAsViewer(props: { nft: NFT; tokenId: number }) {
  const { nft, tokenId } = props;
  const { claim, cliamBounty, isSupportedNetwork, txStatus, submitClaim } = useClaimBounty(
    nft,
    tokenId,
    0
  );
  const [open, setOpen] = useState(isSupportedNetwork);

  if (!claim) return null;
  if (claim && !claim.viewer) return null;

  const description = `Claim Amount: ${nft?.streamInfo?.[streamInfoKeys.addBountyAmount]} ${
    nft?.streamInfo?.[streamInfoKeys.addBountyTokenSymbol]
  }`;

  if (claim.viewer_claimed) {
    return (
      <Button variant="gradientOne" disabled>
        Bounty Claimed
      </Button>
    );
  }

  return (
    <Modal
      title="Claim Bounty"
      description={
        <div>
          <h4>Claim Type: Viewer</h4>
          <p className="text-base">{description}</p>
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      actionButtonProps={{
        onClick: async () => {
          await submitClaim();
          setOpen(false);
        },
        children: "Claim",
        disabled: txStatus === "pending"
      }}
      cancelButtonProps={{
        onClick: () => {
          if (txStatus === "pending") return;
          setOpen(false);
        }
      }}
      triggerProps={
        <Button variant="gradientOne" onClick={cliamBounty}>
          Claim as Viewer
        </Button>
      }
    />
  );
}

export function ClaimAsCommentor(props: { nft: NFT; tokenId: number }) {
  const { nft, tokenId } = props;
  const { claim, cliamBounty, isSupportedNetwork, txStatus, submitClaim } = useClaimBounty(
    nft,
    tokenId,
    1
  );
  const [open, setOpen] = useState(isSupportedNetwork);
  if (!claim) return null;
  if (claim && !claim.commentor) return null;

  const description = `Claim Amount: ${nft?.streamInfo?.[streamInfoKeys.addBountyAmount]} ${
    nft?.streamInfo?.[streamInfoKeys.addBountyTokenSymbol]
  }`;

  if (claim.commentor_claimed) {
    return (
      <Button variant="gradientOne" disabled>
        Bounty Claimed
      </Button>
    );
  }

  return (
    <Modal
      title="Claim Bounty"
      description={
        <div>
          <h4>Claim Type: Commentor</h4>
          <p className="text-base">{description}</p>
        </div>
      }
      open={open}
      onOpenChange={setOpen}
      actionButtonProps={{
        onClick: async () => {
          await submitClaim();
          setOpen(false);
        },
        children: "Claim",
        disabled: txStatus === "pending"
      }}
      cancelButtonProps={{
        onClick: () => {
          if (txStatus === "pending") return;
          setOpen(false);
        }
      }}
      triggerProps={
        <Button variant="gradientOne" onClick={cliamBounty}>
          Claim as Commentor
        </Button>
      }
    />
  );
}
