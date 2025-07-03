// Depreciated

// import type { Web3AuthContextConfig } from "@web3auth/modal/react";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { base, bsc, bscTestnet, goerli, mainnet, sepolia } from "@wagmi/chains";
// import {
//   useWeb3Auth,
//   useWeb3AuthConnect,
//   useWeb3AuthDisconnect,
//   useWeb3AuthUser,
//   Web3AuthProvider
// } from "@web3auth/modal/react";
// import { CONNECTOR_STATUS, IProvider, WEB3AUTH_NETWORK } from "@web3auth/no-modal";
// // import { base, bsc, bscTestnet, goerli, mainnet, sepolia } from "viem/chains";
// import { createClient, createPublicClient, http } from "viem";
// import {
//   createConfig,
//   useAccount,
//   useChainId,
//   useConnect,
//   useDisconnect,
//   useWalletClient
// } from "wagmi";
// import { metaMask } from "wagmi/connectors";

// import ethersWeb3Provider from "@/libs/evm";

// import { web3AuthWallet } from "@/web3/connectors/web3auth-connector";

// import { env, isDevMode } from "@/configs";

// import {
//   useEthersProvider,
//   useEthersSigner,
//   useWeb3AuthChainId,
//   useWeb3AuthSigner
// } from "./wagmi-ethers";

// // Define chains based on environment
// // export const chains = isDevMode ? ([bscTestnet, goerli] as const) : ([bsc, base] as const);
// export const chains = [bsc, base] as const;

// export const web3AuthContextConfig: Web3AuthContextConfig = {
//   web3AuthOptions: {
//     clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
//     web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
//     ssr: true
//   }
// };

// export function useActiveWeb3React() {
//   const [walletProvider, setWalletProvider] = useState<any | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [account, setAddress] = useState<string | null>(null);
//   const [balance, setBalance] = useState<string | null>(null);
//   const {
//     connect: activate,
//     isConnected: active,
//     loading: connectLoading,
//     error: connectError,
//     connectorName: connector
//   } = useWeb3AuthConnect();

//   const {
//     disconnect: deactivate,
//     loading: disconnectLoading,
//     error: disconnectError
//   } = useWeb3AuthDisconnect();
//   const { userInfo } = useWeb3AuthUser();
//   //  const { address: account, connector } = useAccount();
//   //  const { web3Auth, isConnected, isInitializing, provider, status, initError: error } = useWeb3Auth();
//   const {
//     web3Auth,
//     isConnected,
//     isInitializing,
//     provider,
//     status,
//     initError: error
//   } = useWeb3Auth();
//   const signer = useWeb3AuthSigner();
//   const chainId = useWeb3AuthChainId();

//   const setNewWalletProvider = useCallback(
//     async (web3authProvider: IProvider) => {
//       const walletProviderInstance = ethersWeb3Provider(web3authProvider);
//       setWalletProvider(walletProviderInstance);
//       try {
//         const address = await walletProviderInstance.getAddress();
//         const balance = await walletProviderInstance.getBalance();
//         // const chainId = await walletProviderInstance.getChainId();

//         setAddress(address);
//         setBalance(balance);
//       } catch (error) {
//         console.error("Error setting wallet provider data:", error);
//       }
//     },
//     [chainId, account, balance]
//   );

//   useEffect(() => {
//     if (status === CONNECTOR_STATUS.CONNECTED && provider) {
//       setNewWalletProvider(provider);
//     }
//   }, [status, provider, setNewWalletProvider]);

//   const getPublicKey = async () => {
//     if (!walletProvider) return "";
//     const publicKey = await walletProvider.getPublicKey();
//     console.log(publicKey);
//     return publicKey;
//   };

//   const getAddress = async () => {
//     if (!walletProvider) return "";
//     const updatedAddress = await walletProvider.getAddress();
//     setAddress(updatedAddress);
//     console.log(updatedAddress);
//     return updatedAddress;
//   };

//   return useMemo(() => {
//     return {
//       account,
//       library: signer ?? provider,
//       chainId,
//       activate,
//       active,
//       deactivate,
//       error: error as any,

//       // Extras
//       userInfo,
//       connector,
//       web3Auth,
//       isInitializing,
//       connectLoading,
//       disconnectLoading
//     };
//   }, [
//     account,
//     activate,
//     active,
//     chainId,
//     deactivate,
//     error,
//     provider,
//     signer,
//     userInfo,
//     connector,
//     web3Auth,
//     isInitializing,
//     connectLoading,
//     disconnectLoading
//   ]);
// }
