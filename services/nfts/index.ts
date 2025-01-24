/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/libs/api";

export type Comment = {
  address: string;
  content: string;
  createdAt: string;
  id: number;
  parentId?: number;
  replyIds: string[];
  tokenId: number;
  updatedAt: string;
  writor: {
    avatarUrl: string;
    username: string;
  };
};

export type NFT = {
  category: string[];
  chainId: number;
  comments: Comment[];
  createdAt: string;
  description: string;
  imageUrl: string;
  mintTxHash: string;
  minter: string;
  minterAvatarUrl: string;
  minterDisplayName: string;
  minterStaked: number;
  mintername: string;
  minterAboutMe?:string;
  owner?:string;
  isHidden: boolean;
  imageUrls?:string[];
  postType:string;
  isLiked: boolean;
  name: string;
  status: string;
  tokenId: number;
  totalVotes?: { for: number; against: number };
  totalTips?: number;
  transcodingStatus: string;
  videoDuration: number;
  videoExt: string;
  videoInfo?: {
    bitrate: number;
    channelLayout: string;
    h: number;
    lang: string;
    size: number;
    w: number;
  };
  plansDetails?:any,
  videoUrl?: string;
  views: number;
  lockedBounty?: {
    viewer: string;
    commentor: string;
  };
  streamInfo: Record<string, string>;
};

export async function getNFT(tokenId: number, address: string) {
  const res = await api<{ result: NFT }>(`/nft_info/${tokenId}?address=${address}`, {
    // cache: "no-cache",
    // next: {
    //   tags: [`nft_info_${tokenId}`],
    //   revalidate: 300
    // }
  });
  return res;
}

export const getUnlockedNfts = async (address: string | undefined) => {
  const url = `/unlocked_nfts${address}`;
  // const response = await api<{ data: { result:User} }>(url);
  const response = await api(url);
  if (response) return response;
  return null;
};

export async function voteNFT(props: {
  account: string;
  streamTokenId: number;
  vote: boolean;
  sig: string;
  timestamp: number;
}): Promise<{ success: true; error?: string } | { success: false; error: string }> {
  const { account, streamTokenId, vote, sig, timestamp } = props;
  const strUrl = `/request_vote?address=${account?.toLowerCase()}&sig=${sig}&timestamp=${timestamp}&streamTokenId=${streamTokenId}&vote=${vote}`;
  const res = await api<{ error?: string }>(strUrl);
  return res;
}

export type ClaimBounty = {
  claimed: any;
  viewer?: {
    r: string;
    s: string;
    v: number;
  };
  viewer_claimed?: string;
  commentor?: {
    r: string;
    s: string;
    v: number;
  };
  commentor_claimed?: string;
};

export type ClaimBountyResponse = {
  claimed: any;
  error?: boolean;
  result?: ClaimBounty;
};
export async function requestSigForClaimBounty(params: {
  account: string;
  sig: string;
  timestamp: number;
  tokenId: number;
}) {
  const { account, sig, timestamp, tokenId } = params;
  const strUrl = `/claim_bounty?address=${account?.toLowerCase()}&sig=${sig}&timestamp=${timestamp}&tokenId=${tokenId}`;
  const res = await api<ClaimBountyResponse>(strUrl);
  return res;
}
