"use client";

import type { TChains } from "@/hooks/web3-connect";
import type { OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";

import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

import { env } from "@/configs";

/* ================================================================================================= */

const name = "Google";
const iconUrl = "/icons/google.svg";

const getChainConfig = (chains: TChains) => ({
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x" + chains[0].id.toString(16),
  // This is the public RPC we have added, please pass on your own endpoint while creating an app
  rpcTarget: chains[0].rpcUrls.default.http[0],
  displayName: chains[0].name,
  tickerName: chains[0].nativeCurrency?.name,
  ticker: chains[0].nativeCurrency?.symbol,
  blockExplorer: chains[0].blockExplorers?.default.url
});

type ChainConfig = ReturnType<typeof getChainConfig>;

const createWeb3AuthNoModal = (chainConfig: ChainConfig) =>
  new Web3AuthNoModal({
    clientId: env.clientId!,
    chainConfig,
    web3AuthNetwork: "sapphire_mainnet",
    enableLogging: true
  });

const adapterSettings: OpenloginAdapterOptions["adapterSettings"] = {
  network: "sapphire_mainnet",
  uxMode: "popup",
  whiteLabel: {
    appName: "DeHub",
    defaultLanguage: "en",
    mode: "dark"
  }
};

export const rainbowWeb3AuthConnector = ({ chains }: { chains: TChains }) => {
  const chainConfig = getChainConfig(chains);
  const web3AuthInstance = createWeb3AuthNoModal(chainConfig);
  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings,
    privateKeyProvider
  });

  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const connector = new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: "google"
      }
    }
  });

  return {
    id: "web3auth",
    name,
    iconUrl,
    iconBackground: "#fff",
    createConnector: () => ({ connector })
  };
};

export const rainbowWeb3AuthTwitterConnector = ({ chains }: { chains: TChains }) => {
  // Create Web3Auth Instance
  const chainConfig = getChainConfig(chains);
  const web3AuthInstance = createWeb3AuthNoModal(chainConfig);

  // Add openlogin adapter for customizations
  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings
  });

  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const connector = new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: "twitter"
      }
    }
  });

  return {
    id: "web3auth-twitter",
    name: "Twitter",
    iconUrl: "/icons/x.png",
    iconBackground: "#ffffff00",
    createConnector: () => ({ connector })
  };
};
