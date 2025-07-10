import type { Web3AuthContextConfig } from "@web3auth/modal/react";
import { useMemo } from "react";
import { base, bsc, bscTestnet, goerli, mainnet, sepolia } from "@wagmi/chains";
import {
  useWeb3Auth,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  Web3AuthProvider
} from "@web3auth/modal/react";
import {
  createConfig,
  useAccount
} from "wagmi";
import { metaMask } from "wagmi/connectors";

import { env, isDevMode } from "@/configs";
import {
  useWeb3AuthSigner,
  useWeb3AuthChainId
} from "./wagmi-ethers";
import { WEB3AUTH_NETWORK } from "@web3auth/modal";

// Define chains based on environment
export const chains = isDevMode ? ([bscTestnet, goerli] as const) : ([bsc, base] as const);

export const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    web3AuthNetwork:  WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    ssr: true
  }
};

export function useActiveWeb3React() {
  // Web3Auth connectors
  const {
    connect: activate,
    isConnected: authConnected,
    loading: authConnecting,
    error: authConnectError
  } = useWeb3AuthConnect();

  const {
    disconnect: deactivate,
    loading: disconnectLoading,
    error: authDisconnectError
  } = useWeb3AuthDisconnect();

  const { userInfo } = useWeb3AuthUser();
  const { web3Auth, provider, isInitializing, initError } = useWeb3Auth();

  // Wagmi account
  const { address: account, connector, isConnected: wagmiConnected } = useAccount();

  // Ethers signer & chain
  const signer = useWeb3AuthSigner();
  const chainId = useWeb3AuthChainId();

  // aggregate state
  const active = wagmiConnected || authConnected;
  const connectLoading = isInitializing || authConnecting;
  const error = initError || authConnectError || authDisconnectError;

  return useMemo(
    () => ({
      account,
      library: signer ?? provider,
      chainId,
      activate,
      active,
      deactivate,
      error,
      // Extras
      userInfo,
      connector,
      web3Auth,
      isInitializing,
      connectLoading,
      disconnectLoading
    }),
    [
      account,
      signer,
      provider,
      chainId,
      activate,
      active,
      deactivate,
      error,
      userInfo,
      connector,
      web3Auth,
      isInitializing,
      connectLoading,
      disconnectLoading
    ]
  );
}
