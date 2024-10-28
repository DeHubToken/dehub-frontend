import { useAccount, useChainId, useConnect, useDisconnect, useWalletClient } from "wagmi";

import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  trustWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, bsc, bscTestnet, goerli } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { useMemo } from "react";
import { useEthersProvider, useEthersSigner } from "./wagmi-ethers";
import { env } from "@/configs";
import { rainbowWeb3AuthConnector, rainbowWeb3AuthTwitterConnector } from "@/web3/connectors/rainbow-web3-auth-connector";

const providers = [publicProvider(), infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY })] as any;
export const { chains, publicClient, webSocketPublicClient } = env.isDevMode
  ? configureChains([bscTestnet, goerli], providers)
  : configureChains([bsc, mainnet, polygon], providers);
const projectId = process.env.REACT_APP_PROJECT_ID || "YOUR_PROJECT_ID";
const appName = process.env.REACT_APP_PROJECT_NAME || "YOUR_PROJECT_NAME";

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      rainbowWallet({ projectId, chains }),
      coinbaseWallet({ appName, chains }),
      rainbowWeb3AuthConnector({ chains }),
      rainbowWeb3AuthTwitterConnector({ chains }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function useActiveWeb3React() {
  const { address: account } = useAccount();
  const { error } = useWalletClient();
  const signer = useEthersSigner();
  const provider = useEthersProvider();

  const chainId = useChainId();
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
      error: error as any,
    };
  }, [account, activate, active, chainId, deactivate, error, provider, signer]);
}