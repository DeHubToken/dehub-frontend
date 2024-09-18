import { supportedChainIds } from "@/configs";

export const isValidChain = (chainId: number | undefined): boolean => {
  if (!chainId) return false;
  if (supportedChainIds.indexOf(chainId) < 0) return false;
  return true;
};
