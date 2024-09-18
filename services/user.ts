import type { UseActiveWeb3ReactReturn } from "@/hooks/web3-connect";
import type { ApiResponse } from "@/libs/api";
import type { User } from "@/stores";

import { ethers } from "ethers";

import { api } from "@/libs/api";
import objectToGetParams from "@/libs/utils";

import { dhbStakingAbi } from "@/web3/abis";
import { STAKING_CONTRACT_ADDRESSES } from "@/web3/configs";
// import { getBadge } from "@/web3/utils/calc";
import { getContractForChain } from "@/web3/utils/contract";
import { getSignInfo } from "@/web3/utils/web3-actions";

import { ChainId } from "@/configs";

export async function getStakingAmount(account: string | undefined) {
  if (!account) return 0;
  const stakingContract = getContractForChain(
    ChainId.BSC_MAINNET,
    STAKING_CONTRACT_ADDRESSES[ChainId.BSC_MAINNET as keyof typeof STAKING_CONTRACT_ADDRESSES],
    dhbStakingAbi
  );
  if (!stakingContract) return 0;
  try {
    const stakedAmount = await stakingContract.userTotalStakedAmount(account);
    if (stakedAmount.toString() === "0") return 0;
    return parseFloat(ethers.utils.formatUnits(stakedAmount, 18));
  } catch (e) {
    return 0;
  }
}

export async function getAccount(usernameOrAddress: string) {
  const url = `/account_info/${usernameOrAddress}`;
  const response = await api<{ result: User }>(url);
  if (response.success) {
    // Uncomment when staking contract comes
    // const stakedDHB = await getStakingAmount(response.data.result.address);
    return {
      ...response,
      data: {
        ...response.data,
        result: {
          ...response.data.result
          //  stakedDHB, badge: getBadge(stakedDHB)
        }
      }
    };
  }
  return response;
}

export async function updateProfile(data: FormData) {
  const url = "/update_profile";
  const response = await api<{ error?: boolean; error_msg?: string; status: boolean }>(url, {
    method: "POST",
    body: data
  });
  return response;
}

export async function commentOnNFT(params: {
  streamTokenId: number;
  account: string;
  content: string;
  commentId?: number;
  timestamp: number;
  sig: string;
}): Promise<ApiResponse<{ result: unknown }>> {
  const { streamTokenId, sig, timestamp, account, content, commentId } = params;
  const url = `/request_comment?address=${account?.toLowerCase()}&sig=${sig}&timestamp=
  ${timestamp}&streamTokenId=${streamTokenId}&content=
  ${content}${commentId ? `&commentId=${commentId}` : ``}`;
  try {
    const response = await api<{ result: unknown }>(url);
    return response;
  } catch (error) {
    return { success: false, error: "Failed to comment." };
  }
}

export async function follow(params: {
  account: string;
  library: UseActiveWeb3ReactReturn["library"];
  to: string;
}): Promise<ApiResponse<{ result: unknown }>> {
  const { account, library, to } = params;
  if (!account || !library) return { success: false, error: "Please connect your wallet." };
  const sigData = await getSignInfo(library, account);
  const p = objectToGetParams({
    address: account?.toLowerCase(),
    sig: sigData.sig,
    timestamp: sigData.timestamp,
    following: to,
    unFollowing: "false"
  });
  const url = `/request_follow${p}`;
  try {
    const res = await api<{ result: unknown }>(url);
    return res;
  } catch (err) {
    return { success: false, error: "Failed to follow." };
  }
}

export async function unFollow(params: {
  account: string;
  library: UseActiveWeb3ReactReturn["library"];
  to: string;
}): Promise<ApiResponse<{ result: unknown }>> {
  const { account, library, to } = params;
  if (!account || !library) return { success: false, error: "Please connect your wallet." };
  const sigData = await getSignInfo(library, account);
  const p = objectToGetParams({
    address: account?.toLowerCase(),
    sig: sigData.sig,
    timestamp: sigData.timestamp,
    following: to,
    unFollowing: "true"
  });
  const url = `/request_follow${p}`;
  try {
    const res = await api<{ result: unknown }>(url);
    return res;
  } catch (err) {
    return { success: false, error: "Failed to follow." };
  }
}

type LibraryType = UseActiveWeb3ReactReturn["library"];

export type TLeaderboard = {
  read: boolean;
  _id: string;
  address: string;
  type: string;
  tokenId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export async function getNotifications(params: {
  account: `0x${string}` | undefined | string;
  library: LibraryType;
}): Promise<ApiResponse<{ result: TLeaderboard[] }>> {
  const { account, library } = params;
  if (!account || !library) return { success: false, error: "Please connect your wallet." };
  const sigData = await getSignInfo(library, account);
  const p = objectToGetParams({
    address: account?.toLowerCase(),
    sig: sigData.sig,
    timestamp: sigData.timestamp
  });
  const url = `/notification${p}`;
  const res = await api<{ result: TLeaderboard[] }>(url);
  return res;
}

export async function requestMarkAsRead(params: {
  account: `0x${string}` | undefined | string;
  library: UseActiveWeb3ReactReturn["library"];
  id: number | string;
}): Promise<ApiResponse<{ result: unknown }>> {
  const { account, library, id } = params;
  if (!account || !library) return { success: false, error: "Please connect your wallet." };
  const sigData = await getSignInfo(library, account);
  const p = objectToGetParams({
    address: account?.toLowerCase(),
    sig: sigData.sig,
    timestamp: sigData.timestamp
  });
  const url = `/notification/${id}${p}`;
  try {
    const res = await api<{ result: unknown }>(url, {
      method: "PATCH"
    });
    return res;
  } catch (err) {
    return { success: false, error: "Failed to update notifications." };
  }
}
