import type { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import type { ContractInterface } from "ethers";

import { extraRpcUrls, supportedNetworks } from "@/web3/configs";

import "@ethersproject/shims";

import { Contract, ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";

/* ================================================================================================= */

// Returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: string): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

// Shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function getSigner(library: Web3Provider) {
  return library;
}

export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library) : library;
}

export function getContract(
  address: string,
  ABI: ContractInterface,
  library: ethers.providers.Provider | ethers.Signer | undefined
): Contract {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return new Contract(address, ABI, library);
}

/**
 *
 * @param {string | undefined} address contract address
 * @param {ContractInterface} abi
 */
export function getContractData(address: string | undefined, abi: ContractInterface) {
  const contractInterface = new ethers.utils.Interface(abi as string);
  return {
    address,
    abi,
    interface: contractInterface
  };
}

export function getContractForChain(
  chainId: number | undefined,
  address: string | undefined,
  abi: ContractInterface
) {
  if (!chainId || !address) return null;
  const rpcURL =
    supportedNetworks.find((e) => e.chainId === chainId)?.rpcUrl || extraRpcUrls(chainId);
  if (!rpcURL) return null;
  const provider = new ethers.providers.JsonRpcProvider(rpcURL);
  return new ethers.Contract(address, abi, provider);
}
