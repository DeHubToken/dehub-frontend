export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  cdnBaseUrl: process.env.NEXT_PUBLIC_CDN_BASE_URL || "https://blocjerkcdn.nyc3.digitaloceanspaces.com/",
  currentNetwork: process.env.NEXT_PUBLIC_NETWORK_ID,
  isDevMode: process.env.NEXT_PUBLIC_DEV === "ON",
  infuraKey: process.env.NEXT_PUBLIC_INFURA_KEY,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  projectName: process.env.NEXT_PUBLIC_PROJECT_NAME,
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
  pinataKey: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  pinataSecretApiKey: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
  nodes: {
    1: process.env.NEXT_PUBLIC_NODE_1,
    2: process.env.NEXT_PUBLIC_NODE_2,
    3: process.env.NEXT_PUBLIC_NODE_3
  },
  bscNode: process.env.NEXT_PUBLIC_BSC_NODE,
  pubNubKey: process.env.NEXT_PUBLIC_PUBNUB_KEY,
  pubNubSubKey: process.env.NEXT_PUBLIC_PUBNUB_SUB_KEY
};

export const streamInfoKeys = {
  isLockContent: "isLockContent",
  lockContentContractAddress: "lockContentContractAddress",
  lockContentTokenSymbol: "lockContentTokenSymbol",
  lockContentAmount: "lockContentAmount",
  lockContentChainIds: "lockContentChainIds",
  isPayPerView: "isPayPerView",
  payPerViewContractAddress: "payPerViewContractAddress",
  payPerViewTokenSymbol: "payPerViewTokenSymbol",
  payPerViewAmount: "payPerViewAmount",
  payPerViewChainIds: "payPerViewChainIds",
  isAddBounty: "isAddBounty",
  addBountyTokenSymbol: "addBountyTokenSymbol",
  addBountyFirstXViewers: "addBountyFirstXViewers",
  addBountyFirstXComments: "addBountyFirstXComments",
  addBountyAmount: "addBountyAmount",
  addBountyChainId: "addBountyChainId"
};

export const userProfileKeys = {
  username: "username",
  displayName: "displayName",
  email: "email",
  avatarImageUrl: "avatarImageUrl",
  coverImageUrl: "coverImageUrl",
  aboutMe: "aboutMe",
  facebookLink: "facebookLink",
  twitterLink: "twitterLink",
  discordLink: "discordLink",
  instagramLink: "instagramLink",
  tiktokLink: "tiktokLink",
  youtubeLink: "youtubeLink",
  telegramLink: "telegramLink",
  custom1: "custom1",
  custom2: "custom2",
  custom3: "custom3",
  custom4: "custom4",
  custom5: "custom5"
};

export const defaultTokenId = 2;
export const NetworkContextName = "NETWORK";

const devTokens = [
  {
    value: "bj",
    label: "BJ",
    symbol: "BJ",
    customAbbreviation: "bj",
    chainId: 97,
    address: "0x06EdA7889330031a8417f46e4C771C628c0b6418",
    iconUrl: "/icons/tokens/BJ.png",
    decimals: 18
  },
  {
    value: "busd",
    label: "BUSD",
    symbol: "BUSD",
    customAbbreviation: "busd",
    chainId: 97,
    address: "0x53D4A05DF7caAf3302184B774855EcBe2a50bD3E",
    iconUrl: "/icons/tokens/BUSD.png",
    decimals: 18
  },
  {
    value: "usdc",
    label: "USDC",
    symbol: "USDC",
    customAbbreviation: "usdc",
    chainId: 97,
    address: "0x4131fd3F1206d48A89410EE610BF1949934e0a72",
    iconUrl: "/icons/tokens/USDC.png",
    decimals: 18
  }
];

const productionTokens = [
  {
    value: "bj",
    label: "BJ",
    symbol: "BJ",
    customAbbreviation: "bj",
    chainId: 42161,
    address: "0x9cAAe40DCF950aFEA443119e51E821D6FE2437ca",
    iconUrl: "/icons/tokens/BJ.png",
    mintBlockNumber: 16428469,
    decimals: 18
  },
  {
    value: "usdc",
    label: "USDC",
    symbol: "USDC",
    customAbbreviation: "usdc",
    chainId: 42161,
    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    iconUrl: "/icons/tokens/USDC.png",
    decimals: 6
  },
  {
    value: "usdt",
    label: "USDT",
    symbol: "USDT",
    customAbbreviation: "usdt",
    chainId: 42161,
    address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    iconUrl: "/icons/tokens/USDT.png",
    decimals: 6
  }
];

export enum ChainId {
  ARBITRUM_MAINNET = 42161,
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GORLI = 5,
  KOVAN = 42,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  HECO_MAINNET = 128,
  HECO_TESTNET = 256,
  FANTOM_MAINNET = 250,
  AVALANCHE_MAINNET = 43114,
  OKEX_MAINNET = 66,
  POLYGON_MAINNET = 137
}

export const MULTICALL2_ADDRESSES: { [chainId: number]: string } = {
  [ChainId.ARBITRUM_MAINNET]: "0x4d3Ed23bAc3e92847582B3e1d60dcdAFcF9fA56D",
  [ChainId.BSC_TESTNET]: "0x80d0d36d9E3Cb0Bd4561beB1d9d1cC8e1a33F5b1",
};

export const BJ_ADDRESSESS: { [chainId: number]: string } = {
  [ChainId.ARBITRUM_MAINNET]: "0x9cAAe40DCF950aFEA443119e51E821D6FE2437ca",
  [ChainId.BSC_TESTNET]: "0x06EdA7889330031a8417f46e4C771C628c0b6418"
};

export const supportedTokens = env.isDevMode ? devTokens : productionTokens;
export type TSupportedTokens = typeof supportedTokens;

export const supportedTokensForLockContent = supportedTokens.filter((e) => e.symbol === "BJ");
export const supportedTokensForPPV = supportedTokens;
export const supportedTokensForAddBounty = supportedTokens;

export const supportedChainIdsForMinting = [42161];
export const supportedChainIds = env.isDevMode ? [ChainId.BSC_TESTNET] : [ChainId.ARBITRUM_MAINNET];
export const defaultChainId = env.isDevMode ? ChainId.BSC_TESTNET : ChainId.ARBITRUM_MAINNET;
export const defaultTokenSymbol = "BJ";
export const defaultWatchTimeForPPV = 2 * 60 * 60;
export const devFee = 0.1;
export const publicChatChannelId = "public_chn_prod_1";
export const limitTip = 1_000_000_000;
export const expireSignTime = process.env.NEXT_PUBLIC_DEV ? 60 * 60 * 2 : 60 * 60 * 24; // 2 hours

export const ErrMsgEn = {
  lockContent: {},
  ppvContent: {},
  bountyContent: {},
  wallet: {
    connect_to_stream: "Connect wallet to stream",
    connect_to_wallet_to_deposit: "Connect wallet to deposit"
  }
};

export const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

export const badges = [
  {
    name: "Crab",
    amount: 10_000
  },
  {
    name: "Lobster",
    amount: 25_000
  },
  {
    name: "Piranha",
    amount: 50_000
  },
  {
    name: "Tortoise",
    amount: 100_000
  },
  {
    name: "Cobra",
    amount: 250_000
  },
  {
    name: "Octopus",
    amount: 500_000
  },
  {
    name: "Crocodite",
    amount: 1_000_000
  },
  {
    name: "Dolphin",
    amount: 2_000_000
  },
  {
    name: "Tiger Shark",
    amount: 3_000_000
  },
  {
    name: "Killer Whale",
    amount: 5_000_000
  },
  {
    name: "Great White Shark",
    amount: 10_000_000
  },
  {
    name: "Blue Whale",
    amount: 20_000_000
  },
  {
    name: "Meglodon",
    amount: 50_000_000
  }
];

export const MAX_CATEGORY_COUNT = 3;
