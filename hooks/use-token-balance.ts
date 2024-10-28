import { ethers } from "ethers";

import { useCallback, useEffect, useState } from "react";
import { useMulticallContract } from "./use-web3";
import { useActiveWeb3React } from "./web3-connect";
import { supportedTokens } from "@/configs";
import { getContractData } from "@/web3/utils/contract";
import { ERC20Abi } from "@/web3/abis";
import { multicallRead } from "@/web3/utils/multicall";



export default function useTokenBalance(isUpdate: boolean) {
  const multicallContract = useMulticallContract();
  const { account, library, chainId } = useActiveWeb3React();

  const [isError, setIsError] = useState(false);
  const [tokenBalances, setTokenBalances] = useState(null);

  const fetchWalletBalance = useCallback(async () => {
    if (account && library && chainId && multicallContract) {
      const callDataArray:any = [];
      supportedTokens
        .filter((token:any) => token.chainId === chainId)
        .forEach((token:any) => {
          const tokenContract = getContractData(token.address.toString(), ERC20Abi);
          callDataArray.push({
            param: [account],
            contract: tokenContract,
            functionName: "balanceOf",
            returnKey: token.address.toString(),
          });
        });
      try {
        const result:any = await multicallRead(multicallContract as any, callDataArray);
        supportedTokens
          .filter(e => e.chainId === chainId)
          .forEach(token => {
            const key = token.address.toString();

            if (result[key]) result[key] = Number(ethers.utils.formatUnits(result[`${token.address}`], token.decimals));
          });
        setTokenBalances(result);
      } catch (e) {
        setIsError(true);
        console.log("----read wallet", e);
      }
    }
  }, [account, chainId, library, multicallContract]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance, isUpdate]);

  return { tokenBalances, isError };
}