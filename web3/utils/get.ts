import { Contract, ethers } from "ethers";

import { dhbStakingAbi, ERC20Abi, multicallAbi } from "@/web3/abis";
import { STAKING_CONTRACT_ADDRESSES } from "@/web3/configs";
import { getContractForChain } from "@/web3/utils/contract";
import { multicallRead } from "@/web3/utils/multicall";

import { ChainId, DHB_ADDRESSESS, MULTICALL2_ADDRESSES, supportedTokens } from "@/configs";

export async function erc20Balance(
  account: string,
  provider: ethers.providers.Provider,
  tokenAddress = DHB_ADDRESSESS[ChainId.BSC_TESTNET]
) {
  const contract = new Contract(tokenAddress, ERC20Abi, provider);
  try {
    const tokenDecimals = await contract.decimals();
    const tokenBalance = await contract.balanceOf(account);
    if (tokenBalance.toString() === "0") return 0;
    return parseFloat(ethers.utils.formatUnits(tokenBalance, tokenDecimals));
  } catch (e) {
    return 0;
  }
}

export async function getBalanceOfDHB(
  account: string,
  provider: ethers.providers.Provider,
  chainId = ChainId.BSC_TESTNET
) {
  const balance = await erc20Balance(account, provider, DHB_ADDRESSESS[chainId]);
  return balance;
}

export async function getStakingAmount(account: string) {
  if (!account) return 0;
  const stakingContract = getContractForChain(
    ChainId.BSC_MAINNET,
    STAKING_CONTRACT_ADDRESSES[ChainId.BSC_MAINNET as keyof typeof STAKING_CONTRACT_ADDRESSES],
    dhbStakingAbi
  );

  if (!stakingContract) return 0;

  try {
    const stakedAmount = await stakingContract.userTotalStakedAmount(account);
    if (stakedAmount.toString() === "0") return 0;
    return parseFloat(ethers.utils.formatUnits(stakedAmount, 18));
  } catch (e) {
    return 0;
  }
}

type AccountArray = string[];

export async function getStakedForAccounts(accountArray: AccountArray) {
  if (!accountArray) return null;

  const multicallContract = getContractForChain(
    ChainId.BSC_MAINNET,
    MULTICALL2_ADDRESSES[ChainId.BSC_MAINNET],
    multicallAbi
  );
  const stakingContract = getContractForChain(
    ChainId.BSC_MAINNET,
    STAKING_CONTRACT_ADDRESSES[ChainId.BSC_MAINNET as keyof typeof STAKING_CONTRACT_ADDRESSES],
    dhbStakingAbi
  );
  const calldataList = accountArray.map((e) => ({
    contract: stakingContract,
    functionName: "userTotalStakedAmount",
    param: [e],
    returnKey: e
  }));

  if (!multicallContract || !stakingContract) return null;

  try {
    const staked = await multicallRead(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      multicallContract,
      calldataList
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    Object.keys(staked).forEach((e) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      staked[e] = parseFloat(ethers.utils.formatUnits(staked[e], 18));
    });
    return staked;
  } catch (e) {
    return null;
  }
}

export async function getBalancesOfMultichain(
  account: string,
  tokenSymbol: string,
  chainIds: number[]
) {
  if (!account || !chainIds?.length) return null;
  const balances = [];
  for (const chainId of chainIds) {
    const token = supportedTokens.find((e) => e.chainId === chainId && e.symbol === tokenSymbol);
    if (!token) continue;
    const tokenContract = getContractForChain(chainId, token.address, ERC20Abi);
    if (!tokenContract) continue;
    try {
      const bigNumBalance = await tokenContract.balanceOf(account);
      const balance = parseFloat(ethers.utils.formatUnits(bigNumBalance, token.decimals));
      balances.push({ chainId, balance });
    } catch (e) {
      // TODO: handle error
    }
  }
  return balances;
}
