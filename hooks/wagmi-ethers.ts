"use client";

import type { HttpTransport } from "viem";
// import type { PublicClient, WalletClient } from "wagmi";

import { useMemo } from "react";
import { ethers } from "ethers";
import { usePublicClient, useWalletClient } from "wagmi";

/* ================================================================================================= */

export function publicClientToProvider(publicClient: any) {
  const { chain, transport } = publicClient;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };

  if (transport.type === "fallback") {
    const providers = (transport.transports as ReturnType<HttpTransport>[]).map(
      ({ value }) => new ethers.providers.JsonRpcProvider(value?.url, network)
    );
    if (providers.length === 1) return providers[0];
    return new ethers.providers.FallbackProvider(providers);
  }

  return new ethers.providers.JsonRpcProvider(transport.url, network);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return useMemo(() => publicClientToProvider(publicClient), [publicClient]);
}

export function walletClientToSigner(walletClient: any) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
  };
  const provider = new ethers.providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient]
  );
}
