import type { TSupportedTokens } from "@/configs";

import { supportedNetworks } from "@/web3/configs";

export const getDistinctTokens = (tokens: TSupportedTokens, chainId: number | undefined) => {
  const result: TSupportedTokens = [];
  tokens.forEach((e) => {
    if (
      !result.find((token) => token.symbol === e.symbol) &&
      (chainId ? e.chainId === chainId : true)
    )
      result.push(e);
  });
  return result;
};

export const getNetworksForToken = (tokenSymbol: string, tokenList: TSupportedTokens) => {
  const chainIds: number[] = [];
  tokenList.forEach((e) => {
    if (tokenSymbol === e.symbol) chainIds.push(e.chainId);
  });
  return supportedNetworks.filter((e) => chainIds.includes(e.chainId));
};
