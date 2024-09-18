import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { ERC20Abi } from "@/web3/abis";
import { getContractData } from "@/web3/utils/contract";
import { multicallRead } from "@/web3/utils/multicall";

import { supportedTokens } from "@/configs";

import { useMulticallContract } from "./use-web3";
import { useActiveWeb3React } from "./web3-connect";

export default function useTokenBalance(isUpdate: boolean) {
  const multicallContract = useMulticallContract();
  const { account, library, chainId } = useActiveWeb3React();

  const [isError, setIsError] = useState(false);
  const [tokenBalances, setTokenBalances] = useState(null);

  useEffect(() => {
    async function fetchWalletBalance() {
      if (account && library && chainId && multicallContract) {
        const data: {
          param: string[];
          contract: ReturnType<typeof getContractData>;
          functionName: string;
          returnKey: string;
        }[] = [];

        supportedTokens
          .filter((token) => token.chainId === chainId)
          .forEach((token) => {
            const tokenContract = getContractData(token.address.toString(), ERC20Abi);
            data.push({
              param: [account],
              contract: tokenContract,
              functionName: "balanceOf",
              returnKey: token.address.toString()
            });
          });
        try {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          const result = await multicallRead(multicallContract, data);
          supportedTokens
            .filter((e) => e.chainId === chainId)
            .forEach((token) => {
              const key = token.address.toString();
              if (!result) return;
              if (result[key as keyof typeof result]) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                result[key] = Number(
                  ethers.utils.formatUnits(
                    result[`${token.address}` as keyof typeof result],
                    token.decimals
                  )
                );
              }
            });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setTokenBalances(result);
        } catch (e) {
          setIsError(true);
        }
      }
    }
    fetchWalletBalance();
  }, [account, chainId, library, multicallContract, isUpdate]);

  return { tokenBalances, isError };
}
