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
  base,
  // mainnet,
  //  polygon,
  bsc,
  bscTestnet,
  goerli
} from "@wagmi/chains";
import {
  configureChains,
  createConfig,
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useWalletClient
} from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import {
  rainbowWeb3AuthConnector,
  rainbowWeb3AuthTwitterConnector
} from "@/web3/connectors/rainbow-web3-auth-connector";

import { env } from "@/configs";

import { useEthersProvider, useEthersSigner } from "./wagmi-ethers";

const providers = [
  publicProvider(),
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY as string })
] as any;
export const { chains, publicClient, webSocketPublicClient } = env.isDevMode
  ? configureChains([bscTestnet, goerli], providers)
  : configureChains(
      [
        bsc,
        //  mainnet,
        // polygon,
        base
      ],
      providers
    );
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "YOUR_PROJECT_ID";
const appName = process.env.NEXT_PUBLIC_PROJECT_NAME || "YOUR_PROJECT_NAME";

const connectors = (chainId: number) => {
  console.log('chainId:++',chainId,chains)
  return connectorsForWallets([
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet({ projectId, chains }),
        walletConnectWallet({ projectId, chains }),
        trustWallet({ projectId, chains }),
        rainbowWallet({ projectId, chains }),
        coinbaseWallet({ appName, chains }),
        rainbowWeb3AuthConnector({ chains, chainId: chainId ?? chains[0].id }) as any,
        rainbowWeb3AuthTwitterConnector({ chains, chainId: chainId ?? chains[0].id })
      ]
    }
  ]);
};

export const wagmiConfig = (chainId: number) => {
  console.log("wagmiConfig",{chainId})
  return createConfig({
    autoConnect: true,
    connectors: connectors(chainId),
    publicClient,
    webSocketPublicClient
  });
};
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
      error: error as any
    };
  }, [account, activate, active, chainId, deactivate, error, provider, signer]);
}
