import { useMemo } from "react";
import { connectorsForWallets, getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
} from "@rainbow-me/rainbowkit/wallets";
import { base, bsc, bscTestnet, goerli, mainnet, sepolia } from "@wagmi/chains";
import { createPublicClient, http } from "viem";
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useWalletClient
} from "wagmi";

import { env, isDevMode } from "@/configs";

import { useEthersProvider, useEthersSigner } from "./wagmi-ethers";

// Define chains based on environment
export const chains = isDevMode ? ([bscTestnet, goerli] as const) : ([bsc, base] as const);

// Create public client
export const publicClient = createPublicClient({
  chain: chains[0],
  transport: http()
});

const projectId = env.NEXT_PUBLIC_PROJECT_ID;
const appName = env.NEXT_PUBLIC_PROJECT_NAME;

const connectors = connectorsForWallets(
    [
      {
        groupName: "Recommended",
        wallets: [
          metaMaskWallet,
          walletConnectWallet,
          trustWallet,
          rainbowWallet,
          coinbaseWallet,
        ]
      }
    ],
    { appName, projectId }
  );

export const wagmiConfig = () => {
  return getDefaultConfig({
    appName: "Dehub.io",
    projectId,
    chains,
    connectors
  });
};

export function useActiveWeb3React() {
  const { address: account } = useAccount();
  const { error } = useWalletClient();
  const signer = useEthersSigner();
  const chainId = useChainId();
  const provider = useEthersProvider({chainId});

  const { connect: activate, isSuccess: active } = useConnect();
  const { disconnect: deactivate } = useDisconnect();

  return useMemo(() => {
    return {
      account,
      library: signer ?? provider,
      chainId,
      activate,
      active,
      deactivate,
      error: error as any
    };
  }, [account, activate, active, chainId, deactivate, error, provider, signer]);
}
