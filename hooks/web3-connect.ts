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
  goerli,
  sepolia
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

import { env, isDevMode } from "@/configs";

import { useEthersProvider, useEthersSigner } from "./wagmi-ethers";

const providers = [publicProvider(), infuraProvider({ apiKey: env.NEXT_PUBLIC_INFURA_KEY })] as any;
export const { chains, publicClient, webSocketPublicClient } = isDevMode
  ? configureChains([bscTestnet, goerli], providers)
  : configureChains(
      [
        bsc,
        //  mainnet,
        // polygon,
        base,
        sepolia
      ],
      providers
    );

const appName = env.NEXT_PUBLIC_PROJECT_NAME;
const projectId = env.NEXT_PUBLIC_PROJECT_ID;

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
