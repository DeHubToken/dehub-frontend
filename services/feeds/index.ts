/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/libs/api";
import objectToGetParams, { removeUndefined } from "@/libs/utils";


type SearchParams = {
    unit?: number;
    page?: number;
    sortMode?: string;
    sort?: string;
    minter?: string;
    search?: string;
    range?: string | number;
    category?: string | null;
    address?: string;
    postType?:string;
  };

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

export type GetNFTsResult = {
  category: string[];
  chainId: number;
  comments: Comment[];
  createdAt: string;
  description: string;
  imageUrls?: string[];
  mintTxHash: string;
  minter: string;
  minterAvatarUrl: string;
  minterDisplayName: string;
  minterStaked: number;
  mintername: string;
  isHidden: boolean;
  isLiked: boolean;
  name: string;
  status: string;
  tokenId: number;
  totalVotes?: { for: number; against: number };
  totalTips?: number; 
  views: number;
  lockedBounty?: {
    viewer: string;
    commentor: string;
  };
  streamInfo: Record<string, string>;
};

export async function getFeedNFTs(params?: SearchParams) { 
  console.log("getFeedNFTs")
    if (params?.search) {
      const query = objectToGetParams(
        removeUndefined({
          q: params.search,
          search: params.search,
          unit: 50,
          sort:params?.sort,
          range: params.range,
          category: params.category,
          address: params.address,
          postType:"feed-all"
        })
      ); 
      const url = `/search_nfts${query}`; 
      const res = await api<{ result: GetNFTsResult[] }>(url, {
        method: "GET",
        next: { revalidate: 2 * 60, tags: ["nfts"] }
      });
      console.log("getFeedNFTs",res)
      return res;
    } 

    const query = objectToGetParams(params || {});
    const url = `/search_nfts${query}`;
    const res = await api<{ result: GetNFTsResult[] }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60, tags: ["nfts"] }
    });

    console.log("getFeedNFTs",res)
    return res;

}