'use client'
import { useActiveWeb3React } from '@/hooks/web3-connect';
import { userAtom } from '@/stores';
import { getStreamStatus } from '@/web3/utils/validators';
import { useAtomValue } from 'jotai';
import React from 'react'

const BlurTextView = ({nft}:any) => {
    const user = useAtomValue(userAtom);
    const { chainId } = useActiveWeb3React();
    const streamStatus = getStreamStatus(nft, user, chainId);
    const blur = streamStatus?.streamStatus?.isLockedWithPPV
  return (
    <span className={blur ? 'blur-sm' : ''}>{nft.description}</span>
  )
}

export default BlurTextView