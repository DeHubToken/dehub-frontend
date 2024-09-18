// REMOVEME: Remove once types are fixed
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ChainId } from "@/configs";

import { toast } from "@/ui/use-toast";

import { SUPPORTED_NETWORKS, supportedNetworks } from "@/web3/configs";

import { supportedChainIds } from "@/configs";

let isSwitchNetworkPending = false;
export const isWalletConnectMode = (library: { [key: string]: any } | undefined): boolean =>
  !!library?.provider?.wc;

export const addNetwork = async (
  library: { [key: string]: any } | undefined,
  networkParams: { [key: string]: any }
): Promise<boolean> => {
  if (isWalletConnectMode(library)) {
    toast({
      title: "This function can only be used with browser wallet. Please use browser wallet."
    });
    throw new Error("Invalid function");
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error - window.ethereum is not defined in all cases
  await window.ethereum?.request({
    method: "wallet_addEthereumChain",
    params: [networkParams]
  });

  return true;
};

export const switchNetwork = async (
  library: { [key: string]: any } | undefined,
  chainId: number | null | undefined
): Promise<boolean> => {
  try {
    if (!chainId) throw new Error("Invalid Chain");
    if (isWalletConnectMode(library)) {
      toast({ title: "This function is working with browser wallet. Please use browser wallet." });
      throw new Error("Invalid function");
    }

    if (isSwitchNetworkPending) {
      toast({
        title:
          "Switching network request is pending on your wallet. Please try again after it has done."
      });
      throw new Error("Action is pending");
    }

    isSwitchNetworkPending = true;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error - window.ethereum is not defined in all cases
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error: any) {
      if (error?.message?.includes("User")) throw error;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error - SUPPORTED_NETWORKS
      await addNetwork(library, SUPPORTED_NETWORKS[chainId]);
    }
    isSwitchNetworkPending = false;
    return true;
  } catch (error: any) {
    toast({ title: "Switch/Add Network is failed.", description: error.message });
    isSwitchNetworkPending = false;
    throw error;
  }
};

export const isSupportedNetwork = (chainId: ChainId) => supportedChainIds.includes(chainId);

export const getNetworkByChainId = (chainId: number) =>
  supportedNetworks.find((e) => e.chainId === chainId);
