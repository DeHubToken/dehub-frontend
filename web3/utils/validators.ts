/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { NFT } from "@/services/nfts";
import type { User } from "@/stores";

import {
  defaultChainId,
  defaultTokenSymbol,
  streamInfoKeys,
  supportedTokens,
  supportedTokensForLockContent
} from "@/configs";

const lockAmountMin = 0.001;
const bountyAmountMin = 0.001;

export const isValidDataForMinting = (
  title: string,
  description: string,
  streamInfo: Record<string, string | number | boolean>,
  user: User,
  tokenBalances: unknown
) => {
  

  if (streamInfo[streamInfoKeys.isLockContent]) {
    let errorKey = "";
    if (!streamInfo[streamInfoKeys.lockContentAmount]) errorKey = "Amount";
    if (!streamInfo[streamInfoKeys.lockContentChainIds]) errorKey = "Network";
    if (!streamInfo[streamInfoKeys.lockContentTokenSymbol]) errorKey = "Token";
    if (errorKey)
      return {
        isError: true,
        error: `${errorKey} for lock content is invalid!`,
        errorKey: streamInfoKeys.lockContentAmount
      };
    // @ts-expect-error
    if (streamInfo[streamInfoKeys.lockContentAmount] < lockAmountMin)
      return {
        isError: true,
        error: "Amount for lock content is too small!",
        errorKey: streamInfoKeys.lockContentAmount
      };
  }

  if (streamInfo[streamInfoKeys.isPayPerView]) {
    let errorKey = "";
    if (!+streamInfo[streamInfoKeys.payPerViewAmount]) errorKey = "Amount";
    if (!streamInfo[streamInfoKeys.payPerViewChainIds]) errorKey = "Network";
    if (!streamInfo[streamInfoKeys.payPerViewTokenSymbol]) errorKey = "Token";
    if (errorKey)
      return {
        isError: true,
        error: `${errorKey} for pay per view is invalid!`,
        errorKey: streamInfoKeys.payPerViewAmount
      };
  }

  if (streamInfo[streamInfoKeys.isAddBounty]) {
    let errorKey = "";
    if (!streamInfo[streamInfoKeys.addBountyAmount]) errorKey = "Amount";
    if (!streamInfo[streamInfoKeys.addBountyChainId]) errorKey = "Network";
    if (!streamInfo[streamInfoKeys.addBountyTokenSymbol]) errorKey = "Token";
    if (errorKey)
      return {
        isError: true,
        error: `${errorKey} for bounty is invalid!`,
        errorKey: streamInfoKeys.addBountyAmount
      };

    const addBountyToken = supportedTokens.find(
      (e) =>
        e.symbol === streamInfo[streamInfoKeys.addBountyTokenSymbol] &&
        e.chainId === streamInfo[streamInfoKeys.addBountyChainId]
    );
    const addBountyTotalAmount =
      // @ts-expect-error
      streamInfo[streamInfoKeys.addBountyAmount] *
      (Number(streamInfo[streamInfoKeys.addBountyFirstXComments]) +
        Number(streamInfo[streamInfoKeys.addBountyFirstXViewers]));
    if (!addBountyToken) {
      return {
        isError: true,
        error: "Token or Chain is not selected!",
        errorKey: streamInfoKeys.addBountyTokenSymbol
      };
    }

    if (!addBountyTotalAmount || addBountyTotalAmount < bountyAmountMin) {
      return {
        isError: true,
        error: "You need to input correct bounty amount!",
        errorKey: addBountyToken.symbol
      };
    }

    // @ts-expect-error
    const bountyTokenBalance = tokenBalances?.[addBountyToken.address] || 0;
    if (bountyTokenBalance < addBountyTotalAmount) {
      return {
        isError: true,
        error: `You need to have enough token balance to add bounty!\n You balance is ${bountyTokenBalance} ${addBountyToken.symbol}`,
        errorKey: addBountyToken.symbol
      };
    }
  }
  return { isError: false };
};

export const isTranscoding = (nftMetadata: NFT): boolean => nftMetadata?.transcodingStatus === "on";

interface StreamStatus {
  isFree: boolean;
  isLockedWithLockContent: boolean;
  isLockedWithPPV: boolean;
  errMsg: string;
  lockToken?: unknown;
  ppvToken?: unknown;
  bountyToken?: unknown;
}

export const getStreamStatus = (nftMetadata: NFT, userInfo: User | null, chainId: number) => {
  if (!nftMetadata) return { streamStatus: null, lockTokenWithLockContent: null, ppvToken: null };
  const streamStatus: StreamStatus = {
    isFree: true,
    isLockedWithLockContent: false,
    isLockedWithPPV: false,
    errMsg: ""
  };
  let lockTokenWithLockContent = null;
  let ppvToken = null;
  if (nftMetadata?.streamInfo?.isLockContent) {
    const supportedChainIds =
      nftMetadata?.streamInfo?.[streamInfoKeys.lockContentChainIds] || defaultChainId;
    streamStatus.isFree = false;
    if (!userInfo?.balanceData) streamStatus.isLockedWithLockContent = true;
    else {
      let lockedTokenBalance = 0;
      streamStatus.isLockedWithLockContent = true;
      userInfo?.balanceData.forEach((e) => {
        if (Number(supportedChainIds) !== e.chainId) return;
        const tokenItem = supportedTokensForLockContent.find(
          (token) => token.address.toLowerCase() === e.tokenAddress && token.chainId === e.chainId
        );
        if (
          tokenItem &&
          tokenItem.symbol === nftMetadata?.streamInfo?.[streamInfoKeys.lockContentTokenSymbol]
        ) {
          lockedTokenBalance += e.walletBalance || 0 + e.staked || 0;
        }
      });
      if (lockedTokenBalance >= Number(nftMetadata?.streamInfo?.[streamInfoKeys.lockContentAmount]))
        streamStatus.isLockedWithLockContent = false;
    }
    const lockToken = supportedTokens.find(
      (e) =>
        e.chainId === chainId &&
        e.symbol ===
          (nftMetadata?.streamInfo?.[streamInfoKeys.lockContentTokenSymbol] || defaultTokenSymbol)
    );
    lockTokenWithLockContent = lockToken;
  }
  if (nftMetadata?.streamInfo?.[streamInfoKeys.isPayPerView]) {
    streamStatus.isFree = false;
    if (!userInfo?.unlocked?.includes(nftMetadata?.tokenId as unknown as string)) {
      streamStatus.isLockedWithPPV = true;
    }
    ppvToken = supportedTokens.find(
      (e) =>
        e.chainId === chainId &&
        e.symbol ===
          (nftMetadata?.streamInfo?.[streamInfoKeys.payPerViewTokenSymbol] || defaultTokenSymbol)
    );
  }
  return { streamStatus, lockTokenWithLockContent, ppvToken };
};

export const isOwner = (nftMetadata: NFT, account: string) =>
  nftMetadata?.minter === account?.toLowerCase();
