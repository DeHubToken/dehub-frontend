import { api } from "@/libs/api";
import objectToGetParams, { removeUndefined } from "@/libs/utils";

type SearchParams = {
  unit?: number;
  page?: number;
  sortMode?: string;
  minter?: string;
  search?: string;
  range?: string | number;
  category?: string | null;
};

export type GetNFTsResult = {
  streamInfo?: {
    isAddBounty?: boolean;
    addBountyAmount?: number;
    addBountyTokenSymbol?: string;
    isPayPerView?: boolean;
    payPerViewAmount?: number;
    isLockContent?: boolean;
    lockContentAmount?: number;
    lockContentTokenSymbol?: string;
    payPerViewTokenSymbol?: string;
  };
  category: string[];
  chainId: number;
  createdAt: string;
  description: string;
  imageUrl: string;
  likes: number;
  mintTxHash: string;
  minter: string;
  minterAvatarUrl: string;
  minterDisplayName: string;
  mintername: string;
  name: string;
  status: string;
  tokenId: number;
  totalVotes: {
    for: number;
  };
  transcodingStatus: string;
  videoDuration: number;
  videoExt: string;
  videoInfo: {
    bitrate: number;
    channelLayout: string;
    h: number;
    lang: string;
    size: number;
    w: number;
  };
  videoUrl: string;
  views: number;
};

export async function getNFTs(params?: SearchParams) {
  if (params?.search) {
    const query = objectToGetParams(
      removeUndefined({
        q: params.search,
        search: params.search,
        unit: 50,
        range: params.range,
        category: params.category
      })
    );
    const url = `/search_nfts${query}`;
    const res = await api<{ result: GetNFTsResult[] }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60, tags: ["nfts"] }
    });
    return res;
  }

  const query = objectToGetParams(params || {});
  const url = `/search_nfts${query}`;
  const res = await api<{ result: GetNFTsResult[] }>(url, {
    method: "GET",
    next: { revalidate: 2 * 60, tags: ["nfts"] }
  });
  return res;
}
