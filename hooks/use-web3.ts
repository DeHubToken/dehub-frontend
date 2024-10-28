
import { Contract } from "ethers";
import { useMemo } from "react";

import * as ERC20_ABI from "../contracts/ERC20.json";
import VAULT_ABI from "../web3/abis/vault.json";
import MULTICALL_ABI from "../web3/abis/multicall.json";
import STREAM_CONTROLLER_ABI from "../web3/abis/stream-controller.json";
import STREAMNFTABI from "../web3/abis/erc1155.json";
import { useActiveWeb3React } from "./web3-connect";
import { STREAM_COLLECTION_CONTRACT_ADDRESSES, STREAM_CONTROLLER_CONTRACT_ADDRESSES, VAULT_CONTRACT_ADDRESSES } from "@/web3/configs";
import { DHB_ADDRESSESS, MULTICALL2_ADDRESSES } from "@/configs";
import { getContract } from "@/web3/utils/contract";

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  // eslint-disable-next-line
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { library, account, chainId } = useActiveWeb3React();
  

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !library || !account || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === "string") address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract(address, ABI, library as any, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [addressOrAddressMap, ABI, library, chainId, withSignerIfPossible, account]) as T;
}

// eslint-disable-next-line
export const useStreamCollectionContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(!!account && !!chainId ? STREAM_COLLECTION_CONTRACT_ADDRESSES : undefined, STREAMNFTABI, true);
};

export const useDHBTokenContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(!!account && !!chainId ? DHB_ADDRESSESS : undefined, (ERC20_ABI as any).abi, true);
};

export const useERC20Contract = (tokenAddress:any) => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(!!account && !!chainId ? tokenAddress : undefined, (ERC20_ABI as any).abi, true);
};

export const useVaultContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(!!account && !!chainId ? VAULT_CONTRACT_ADDRESSES : undefined, VAULT_ABI, true);
};

export const useStreamControllerContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(
    !!account && !!chainId ? STREAM_CONTROLLER_CONTRACT_ADDRESSES : undefined,
    STREAM_CONTROLLER_ABI,
    true,
  );
};

export const useMulticallContract = () => {
  const { account, chainId } = useActiveWeb3React();
  return useContract(!!account && !!chainId ? MULTICALL2_ADDRESSES : undefined, MULTICALL_ABI, true);
};