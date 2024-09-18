/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Contract } from "ethers";

import { useMemo } from "react";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import ERC20_ABI from "@/web3/abis/erc20.json";
import STREAMNFTABI from "@/web3/abis/erc1155.json";
import MULTICALL_ABI from "@/web3/abis/multicall.json";
import STREAM_CONTROLLER_ABI from "@/web3/abis/stream-controller.json";
import VAULT_ABI from "@/web3/abis/vault.json";
import {
  STREAM_COLLECTION_CONTRACT_ADDRESSES,
  STREAM_CONTROLLER_CONTRACT_ADDRESSES,
  VAULT_CONTRACT_ADDRESSES
} from "@/web3/configs";
import { getContract } from "@/web3/utils/contract";

import { BJ_ADDRESSESS, MULTICALL2_ADDRESSES } from "@/configs";

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any
): T | null {
  const { library, account, chainId } = useActiveWeb3React();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !account || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(address, ABI, library);
    } catch (error) {
      return null;
    }
  }, [addressOrAddressMap, ABI, library, chainId, account]) as T;
}

// eslint-disable-next-line
export const useStreamCollectionContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(
    !!account && !!chainId ? STREAM_COLLECTION_CONTRACT_ADDRESSES : undefined,
    STREAMNFTABI
  );
};

export const useBJTokenContract = () => {
  const { account, chainId } = useActiveWeb3React();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return useContract(!!account && !!chainId ? BJ_ADDRESSESS : undefined, ERC20_ABI);
};

export const useERC20Contract = (tokenAddress: string) => {
  const { account, chainId } = useActiveWeb3React();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return useContract(!!account && !!chainId ? tokenAddress : undefined, ERC20_ABI);
};

export const useVaultContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(!!account && !!chainId ? VAULT_CONTRACT_ADDRESSES : undefined, VAULT_ABI);
};

export const useStreamControllerContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(
    !!account && !!chainId ? STREAM_CONTROLLER_CONTRACT_ADDRESSES : undefined,
    STREAM_CONTROLLER_ABI
  );
};

export const useMulticallContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(!!account && !!chainId ? MULTICALL2_ADDRESSES : undefined, MULTICALL_ABI);
};
