// import { CHAIN_NAMESPACES } from "@web3auth/base";
// import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, Web3AuthNoModal } from "@web3auth/no-modal";
import { Web3Auth } from "@web3auth/modal";
// import { OpenloginAdapter, OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Connector } from "wagmi";
import type { Wallet } from "@rainbow-me/rainbowkit";

import { env, isDevMode } from "@/configs";

const name = "Google";
const iconUrl = "/icons/google.svg";

const getChainConfig = (chains: any[], chainId: number) => {
  const index = chains.findIndex((c) => c.id == chainId);
  console.log(chains, chains[index], index, chainId);
  return {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[index]?.id.toString(16),
    rpcTarget: chains[index]?.rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[index]?.name,
    tickerName: chains[index]?.nativeCurrency?.name,
    ticker: chains[index]?.nativeCurrency?.symbol,
    blockExplorer: chains[index]?.blockExplorers?.default.url //[0],
  };
};

const createWeb3AuthNoModal = () => {
  return new Web3AuthNoModal({
    clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: true
  });
};

// const adapterSettings: OpenloginAdapterOptions["adapterSettings"] = {
//   network: web3AuthNetwork,
//   uxMode: "popup",
//   whiteLabel: {
//     appName: env.NEXT_PUBLIC_PROJECT_NAME,
//     defaultLanguage: "en",
//     mode: "dark"
//   }
// };

export const web3AuthConnector = ({ chains, provider = "google" }: any): Wallet => {
  const web3AuthInstance = new Web3AuthNoModal({
    clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    web3AuthNetwork: isDevMode
      ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
      : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: true
  });

  const wagmiConnector  = new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance,
      // clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
      // web3AuthNetwork: isDevMode
      //   ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET
      //   : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
      loginParams: { loginProvider: provider }
    }
  });

  return {
    id: provider === "twitter" ? "web3auth-twitter" : "web3auth",
    name: provider === "twitter" ? "Twitter" : name,
    iconUrl: provider === "twitter" ? "/icons/x.png" : iconUrl,
    iconBackground: provider === "twitter" ? "#ffffff00" : "#fff",
    createConnector: () => wagmiConnector 
  };
};

export const rainbowWeb3AuthConnector = () => {
  // const chainConfig = getChainConfig(chains, chainId); // Default to the first chain
  // const web3AuthInstance = createWeb3AuthNoModal();
  // const privateKeyProvider: any = new EthereumPrivateKeyProvider({ config: { chainConfig } });
  // const openloginAdapterInstance = new OpenloginAdapter({
  //   adapterSettings,
  //   privateKeyProvider
  // });
  // web3AuthInstance.configureAdapter(openloginAdapterInstance);
  // const connector = new Web3AuthConnector({
  //   chains: chains,
  //   options: {
  //     web3AuthInstance,
  //     loginParams: {
  //       loginProvider: "google"
  //     }
  //   }
  // });
  // return {
  //   id: "web3auth",
  //   name,
  //   iconUrl,
  //   iconBackground: "#fff",
  //   createConnector: () => {
  //     return { connector: web3AuthInstance };
  //   }
  // };
};

// export const rainbowWeb3AuthTwitterConnector = ({ chains, chainId }: any) => {
//   // Create Web3Auth Instance
//   const chainConfig = getChainConfig(chains, chainId); // Default to the first chain
//   console.log("chainConfig", chainConfig, chainId);
//   const web3AuthInstance = createWeb3AuthNoModal(chainConfig);

//   // Add openlogin adapter for customizations
//   const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
//   const openloginAdapterInstance = new OpenloginAdapter({
//     privateKeyProvider,
//     adapterSettings
//   });
//   web3AuthInstance.configureAdapter(openloginAdapterInstance);
//   const connector = new Web3AuthConnector({
//     chains: chains,
//     options: {
//       web3AuthInstance,
//       loginParams: {
//         loginProvider: "twitter"
//       }
//     }
//   });

//   return {
//     id: "web3auth-twitter",
//     name: "Twitter",
//     iconUrl: "/icons/x.png",
//     iconBackground: "#ffffff00",
//     createConnector: () => {
//       return { connector };
//     }
//   };
// };
