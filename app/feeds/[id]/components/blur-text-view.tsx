"use client";

import React from "react";
import { useAtomValue } from "jotai";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getStreamStatus } from "@/web3/utils/validators";

import { userAtom } from "@/stores";

import { streamInfoKeys } from "@/configs";

const BlurTextView = ({ nft }: any) => {
  const { account, chainId } = useActiveWeb3React();
  const isOwner =
    account &&
    nft?.owner &&
    nft?.minter &&
    (nft?.minter?.toLowerCase() === account?.toLowerCase() ||
      nft?.owner?.toLowerCase() === account?.toLowerCase());
  const isFreeStream =
    !nft?.streamInfo ||
    !(
      nft?.streamInfo?.[streamInfoKeys?.isLockContent] ||
      nft?.streamInfo?.[streamInfoKeys?.isPayPerView] ||
      nft?.plansDetails?.length > 0
    )
      ? true
      : false;

  const blur = !isOwner && !isFreeStream! && !isAnySubscribed(nft?.plansDetails);
  console.log("nft?.plansDetails?.length>0 ", nft?.plansDetails?.length > 0, {
    isOwner,
    isFreeStream,
    blur,
    account
  });
  return <span className={blur ? "blur-sm" : ""}>{nft.description}</span>;
};

export default BlurTextView;

function isAnySubscribed(array: any) {
  // Check if any object in the array has alreadySubscribed set to true
  return array.some((item: any) => item.alreadySubscribed === true);
}
