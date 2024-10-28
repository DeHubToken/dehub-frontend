
import { supportedNetworks } from "@/web3/configs";
import { AnyAaaaRecord } from "dns";

export const getDistinctTokens = (tokens: any, chainId: number | undefined) => {
  const result: any = [];
  tokens.forEach((e:any) => {
    if (
      !result.find((token:any) => token.symbol === e.symbol) &&
      (chainId ? e.chainId === chainId : true)
    )
      result.push(e);
  });
  return result;
};

export const getNetworksForToken = (tokenSymbol: string, tokenList: any) => {
  const chainIds: number[] = [];
  tokenList.forEach((e:any) => {
    if (tokenSymbol === e.symbol) chainIds.push(e.chainId);
  });
  return supportedNetworks.filter((e) => chainIds.includes(e.chainId));
};
