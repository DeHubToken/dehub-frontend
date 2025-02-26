"use client" 

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { NFT } from "@/services/nfts";

 
import { streamInfoKeys } from "@/configs";

interface Props {
  description: string;
  name: string;
  feed: NFT;
}
export function FeedContent({ name, description, feed }: Props) { 
  const { account, chainId } = useActiveWeb3React();
  const isOwner =!!(account) &&
  (feed?.minter?.toLowerCase() === account?.toLowerCase() ||
    feed?.owner?.toLowerCase() === account?.toLowerCase())
  const isFreeStream =
    !feed?.streamInfo ||
    !(
      feed?.streamInfo?.[streamInfoKeys?.isLockContent] ||
      feed?.streamInfo?.[streamInfoKeys?.isPayPerView]||feed?.plansDetails?.length>0
    )
      ? true
      : false;

  const blur = !isOwner && !isFreeStream! && !isAnySubscribed(feed?.plansDetails);
  return (
    <div className="flex flex-col gap-3">
      <p>{name}</p>

      <p
        className={`text-theme-monochrome-300 max-h-40 overflow-scroll text-base ${blur ? "blur-sm" : null}`}
      >
        {description}
      </p>
    </div>
  );
}

function isAnySubscribed(array: any) {
  // Check if any object in the array has alreadySubscribed set to true
  return array.some((item: any) => item.alreadySubscribed === true);
}
