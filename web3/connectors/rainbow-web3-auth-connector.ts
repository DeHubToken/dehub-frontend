import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter, OpenloginAdapterOptions } from "@web3auth/openlogin-adapter";

const name = "Google";
const iconUrl = "/assets/icons/google.svg";

const getChainConfig = (chains:any) => {
  return {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url, //[0],
  };
};

const createWeb3AuthNoModal = (chainConfig:any) => {
  return new Web3AuthNoModal({
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    chainConfig,
    web3AuthNetwork: "cyan",
    enableLogging: true,
  });
};

const adapterSettings: OpenloginAdapterOptions["adapterSettings"] = {
  network: "cyan",
  uxMode: "popup",
  whiteLabel: {
    appName: "Dehub",
    defaultLanguage: "en",
    mode: "dark",
  },
};

export const rainbowWeb3AuthConnector = ({ chains }:any) => {
  const chainConfig = getChainConfig(chains);
  const web3AuthInstance = createWeb3AuthNoModal(chainConfig);
  const privateKeyProvider: any = new EthereumPrivateKeyProvider({ config: { chainConfig } });
  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings,
    privateKeyProvider,
  });

  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const connector = new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: "google",
      },
    },
  });

  return {
    id: "web3auth",
    name,
    iconUrl,
    iconBackground: "#fff",
    createConnector: () => {
      return { connector };
    },
  };
};

export const rainbowWeb3AuthTwitterConnector = ({ chains }:any) => {
  // Create Web3Auth Instance
  const chainConfig = getChainConfig(chains);
  const web3AuthInstance = createWeb3AuthNoModal(chainConfig);

  // Add openlogin adapter for customizations
  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });
  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings,
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);
  const connector = new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider: "twitter",
      },
    },
  });

  return {
    id: "web3auth-twitter",
    name: "Twitter",
    iconUrl: "/assets/icons/x.png",
    iconBackground: "#ffffff00",
    createConnector: () => {
      return { connector };
    },
  };
};