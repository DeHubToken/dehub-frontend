'use client'
import { streamInfoKeys } from '@/configs';
import { useActiveWeb3React } from '@/hooks/web3-connect';
import { userAtom } from '@/stores';
import { getStreamStatus } from '@/web3/utils/validators';
import { useAtomValue } from 'jotai';
import React from 'react'

const BlurTextView = ({nft}:any) => {  
      const { account, chainId } = useActiveWeb3React();  
      const isOwner = nft.owner === account?.toLowerCase();
      const isFreeStream =
        !nft?.streamInfo ||
        !(
          nft?.streamInfo?.[streamInfoKeys?.isLockContent] ||
          nft?.streamInfo?.[streamInfoKeys?.isPayPerView]
        )
          ? true
          : false;
      const blur = !isOwner || !isFreeStream ||!isAnySubscribed(nft?.plansDetails);
  return (
    <span className={blur ? 'blur-sm' : ''}>{nft.description}</span>
  )
}

export default BlurTextView

function isAnySubscribed(array: any) {
  // Check if any object in the array has alreadySubscribed set to true
  return array.some((item: any) => item.alreadySubscribed === true);
}