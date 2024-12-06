"use client";

import type { MulticallContract, MultiCallProps } from "@/web3/utils/multicall";
import type { ContractInterface } from "ethers";
import type { Interface } from "ethers/lib/utils";

import { useEffect } from "react";
import { ethers } from "ethers";
import { useSetAtom } from "jotai";

import { ERC20Abi } from "@/web3/abis";
import { STREAM_CONTROLLER_CONTRACT_ADDRESSES } from "@/web3/configs";
import { getContractData } from "@/web3/utils/contract";
import { multicallRead } from "@/web3/utils/multicall";

import { saveUserAtom } from "@/stores";

import { supportedTokens } from "@/configs";

import { useGetAccount } from "./use-get-account";
import { useMulticallContract } from "./use-web3";
import { useActiveWeb3React } from "./web3-connect";

export function useUser() {
  const saveUser = useSetAtom(saveUserAtom);
  const multicallContract = useMulticallContract();
  const { account, library, chainId } = useActiveWeb3React();
  const { isLoading, data, ...rest } = useGetAccount({ account });
  let user = data;

  useEffect(() => {
    if (isLoading) return;
    if (account && library && chainId) {
      const callDataArray: {
        contract: { address: string | undefined; abi: ContractInterface; interface: Interface };
        functionName: string;
        param: string[];
        returnKey: string;
      }[] = [];
      const streamControllerContractAddress =
        STREAM_CONTROLLER_CONTRACT_ADDRESSES[
          chainId as keyof typeof STREAM_CONTROLLER_CONTRACT_ADDRESSES
        ];

      supportedTokens
        .filter((e) => e.chainId === chainId)
        .forEach((token) => {
          const tokenContract = getContractData(token.address, ERC20Abi);
          callDataArray.push({
            contract: tokenContract,
            functionName: "balanceOf",
            param: [account],
            returnKey: `${token.address}_wallet`
          });
          callDataArray.push({
            contract: tokenContract,
            functionName: "allowance",
            param: [account, streamControllerContractAddress],
            returnKey: `${token.address}_allowance`
          });
        });

      if (!multicallContract) return;
      multicallRead(
        multicallContract as unknown as MulticallContract,
        callDataArray as unknown as MultiCallProps
      )
        .then((result) => {
          supportedTokens
            .filter((e) => e.chainId === chainId)
            .forEach((token) => {
              const walletKey = token.address.toString() + "_wallet";
              const allowanceKey = token.address.toString() + "_allowance";

              if (result && result[walletKey as keyof typeof result]) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                result[walletKey] = Number(
                  ethers.utils.formatUnits(result[walletKey as keyof typeof result], token.decimals)
                );
              }

              if (result) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                result[allowanceKey] = Number(
                  ethers.utils.formatUnits(
                    result[allowanceKey as keyof typeof result],
                    token.decimals
                  )
                );
              }
            });

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          // eslint-disable-next-line react-hooks/exhaustive-deps
          user = { ...data, result: { ...data?.result, walletBalances: result } };
          if (user) {
            saveUser(user.result);
          }
        })
        .catch(() => {});
    }
  }, [account, chainId, isLoading, library]);

 
  return { isLoading, user, account, library, chainId, ...rest };
}
