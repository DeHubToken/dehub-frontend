"use client";

import type { ChainProviderFn } from "wagmi";

import { useMemo } from "react";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import {
  configureChains,
  createConfig,
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useWalletClient
} from "wagmi";
import { arbitrum, bscTestnet } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { useEthersProvider, useEthersSigner } from "@/hooks/wagmi-ethers";

import {
  rainbowWeb3AuthConnector,
  rainbowWeb3AuthTwitterConnector
} from "@/web3/connectors/rainbow-web3-auth-connector";

import { env } from "@/configs";

/* ================================================================================================= */

const providers = [publicProvider(), infuraProvider({ apiKey: env.infuraKey! })];

export const { chains, publicClient, webSocketPublicClient } = env.isDevMode
  ? configureChains([bscTestnet], providers as unknown as ChainProviderFn<typeof bscTestnet>[])
  : configureChains([arbitrum], providers as unknown as ChainProviderFn<typeof arbitrum>[]);
export type TChains = typeof chains;

const projectId = env.projectId!;
const appName = env.projectName!;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
      coinbaseWallet({ appName, chains }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      rainbowWeb3AuthConnector({ chains }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      rainbowWeb3AuthTwitterConnector({ chains })
    ]
  }
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

export function useActiveWeb3React() {
  const { address: account } = useAccount();
  const { error } = useWalletClient();
  const singer = useEthersSigner();
  const provider = useEthersProvider();
  const chainId = useChainId();
  const { connect: activate, isSuccess: active } = useConnect();
  const { disconnect: deactive } = useDisconnect();

  return useMemo(
    () => ({
      account,
      library: singer ?? provider,
      chainId,
      activate,
      active,
      deactive,
      error
    }),
    [account, singer, provider, chainId, activate, active, deactive, error]
  );
}

export type UseActiveWeb3ReactReturn = ReturnType<typeof useActiveWeb3React>;
