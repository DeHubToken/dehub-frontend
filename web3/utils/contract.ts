import { ContractInterface } from "ethers";
import { extraRpcUrls, supportedNetworks } from "../configs";
/**
 *
 * @param address contract address
 * @param abi
 * @returns
 */
export const getContractData = (address: string | undefined, abi: ContractInterface): any => {
  const contractInterface = new ethers.utils.Interface(abi as string);
  return {
    address,
    abi,
    interface: contractInterface,
  };
};

export const getContractForChain = (
  chainId: number | undefined,
  address: string | undefined,
  abi: ContractInterface,
): any => {
  if (!chainId || !address) return null;
  const rpcURL = supportedNetworks.find(e => e.chainId === chainId)?.rpcUrl || extraRpcUrls(chainId);
  if (!rpcURL) return null;
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  return new ethers.Contract(address, abi, provider);
};

import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import "@ethersproject/shims";
import { Contract, ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

// returns the checksummed address if the address is valid, otherwise returns false
// eslint-disable-next-line
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}
// account is not optional
export function getSigner(library: Web3Provider, account: string): any {
  return library;
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
// eslint-disable-next-line
export function getContract(address: string, ABI: any, library: any, account?: string): Contract {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, library);
}