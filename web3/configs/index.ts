import { ChainId, env } from "@/configs";


// Will be sent soon(Useless by the way)
export const VAULT_CONTRACT_ADDRESSES = {
  [ChainId.ARBITRUM_MAINNET]: "0x067CAFf787075D666f38512DE0E35AC7B49b7266",
  [ChainId.BSC_TESTNET]: "0xc90f5CbB3bb3e9a181b8Fed7d8a4835B291b7c9F"
};

export const STREAM_CONTROLLER_CONTRACT_ADDRESSES: {
  [ChainId.ARBITRUM_MAINNET]: string;
  [ChainId.BSC_TESTNET]: string;
} = {
  [ChainId.ARBITRUM_MAINNET]: "0x8b9DC7FCcfB181d97141A7d386c7678e234e0a39",
  [ChainId.BSC_TESTNET]: "0x6e19ba22da239c46941582530c0ef61400b0e3e6"
};

// Will be sent soon(Useless for BJ, for now at least)
export const STAKING_CONTRACT_ADDRESSES = {
  [ChainId.ARBITRUM_MAINNET]: "",
  [ChainId.BSC_TESTNET]: ""
};

export const STREAM_COLLECTION_CONTRACT_ADDRESSES = {
  [ChainId.ARBITRUM_MAINNET]: "0x9f8012074d27F8596C0E5038477ACB52057BC934",
  [ChainId.BSC_TESTNET]: "0xfdFe40A30416e0aEcF4814d1d140e027253c00c7"
};

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;

export const NETWORK_URLS: {
  [chainId: number]: string;
} = {
  [ChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [ChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [ChainId.GORLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
  [ChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
  [ChainId.BSC_MAINNET]: "https://binance.nodereal.io",
  [ChainId.BSC_TESTNET]: `https://data-seed-prebsc-1-s2.binance.org:8545`,
  [ChainId.POLYGON_MAINNET]: "https://polygon-rpc.co",
  [ChainId.ARBITRUM_MAINNET]: "https://arb1.arbitrum.io/rpc"
};

const testNetworks = [
  {
    id: ChainId.BSC_TESTNET,
    chainId: ChainId.BSC_TESTNET,
    ticker: "BNB",
    name: "BNB Testnet",
    shortName: "BSC Testnet",
    rpcUrl: NETWORK_URLS[ChainId.BSC_TESTNET],
    explorerUrl: "https://testnet.bscscan.com/",
    value: "BNB Testnet",
    label: "BNB Testnet",
    customAbbreviation: "bsc_test"
  }
];

const mainNetworks = [
  {
    chainId: ChainId.ARBITRUM_MAINNET,
    id: ChainId.ARBITRUM_MAINNET,
    shortName: `arb`,
    name: "Arbitrum",
    ticker: "ETH",
    rpcUrl: NETWORK_URLS[ChainId.ARBITRUM_MAINNET],
    explorerUrl: "https://arbiscan.io/",
    value: "Arbitrum",
    label: "Arbitrum",
    customAbbreviation: "arbitrum"
  }
];

export const supportedNetworks = env.isDevMode ? testNetworks : mainNetworks;

const TEST_NETWORKS = {
  [ChainId.BSC_TESTNET]: {
    chainId: "0x61",
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "Binance",
      symbol: "BNB",
      decimals: 18
    },
    rpcUrls: [NETWORK_URLS[ChainId.BSC_TESTNET]],
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  }
};

const MAIN_NETWORKS = {
  [ChainId.ARBITRUM_MAINNET]: {
    chainId: "0xa4b1",
    chainName: "Arbitrum",
    nativeCurrency: {
      name: "Arbitrum",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: [`https://arb1.arbitrum.io/rpc`],
    blockExplorerUrls: ["https://arbiscan.io/"]
  }
};
export const SUPPORTED_NETWORKS = env.isDevMode ? TEST_NETWORKS : MAIN_NETWORKS;
export const extraRpcUrls = (chainId: number) =>
  chainId === ChainId.BSC_MAINNET ? process.env.REACT_APP_BSC_NODE : undefined;
