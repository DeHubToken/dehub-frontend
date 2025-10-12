import { api } from "@/libs/api";
import objectToGetParams, { removeUndefined } from "@/libs/utils";

import { getSignInfo } from "@/web3/utils/web3-actions";

type SearchParams = {
  unit?: number;
  page?: number;
  sortMode?: string;
  sort?: string;
  minter?: string;
  owner?: string;
  search?: string;
  range?: string | number;
  category?: string | null;
  address?: string;
  postType?: string;
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
  isHidden: Boolean;
  isLiked: Boolean;
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
        sort: params?.sort,
        unit: 50,
        range: params.range,
        category: params.category,
        address: params.address,
        page: params.page,
        postType: params.postType
      })
    );
    const tag = params?.postType ? `nfts-${params.postType}` : "nfts-all";
    const url = `/search_nfts${query}`;
    console.log("search_nfts_url", url);

    const res = await api<{ result: GetNFTsResult[] }>(url, {
      method: "GET",
      next: { revalidate: 2 * 60, tags: [tag] }
    });

    console.log("search_nfts_res", res);

    return res;
  }

  const query = objectToGetParams(
    removeUndefined({
      q: params?.search,
      search: params?.search,
      unit: 50,
      range: params?.range,
      sort: params?.sort,
      category: params?.category,
      address: params?.address,
      page: params?.page,
      sortMode: params?.sortMode,
      minter: params?.minter,
      owner: params?.owner,
      postType: params?.postType
    })
  );
  const tag = params?.postType ? `nfts-${params.postType}` : "nfts-all";
  const url = `/search_nfts${query}`;
  const res = await api<{ result: GetNFTsResult[] }>(url, {
    method: "GET",
    next: { revalidate: 2 * 60, tags: [tag] }
  });
  return res;
}

export async function getLikedNFTs(
  params: { page: number; address: string | undefined; sort?: string },
  library: any
) {
  const sigData = await getSignInfo(library, params?.address as string);
  const payload = {
    ...params,
    sig: sigData?.sig,
    timestamp: sigData?.timestamp
  };
  const query = objectToGetParams(payload || {});
  const url = `/liked_videos${query}`;
  const res = await api<{ result: GetNFTsResult[] }>(url, {
    method: "GET",
    next: { revalidate: 2 * 60, tags: ["liked_nfts"] }
  });
  return res;
}
