import { env } from "./env";

export { env } from "./env";

export const isDevMode = env.NEXT_PUBLIC_DEV === "ON";

export enum ChainId {
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
  POLYGON_MAINNET = 137,
  BASE_MAINNET = 8453
}

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
    value: "dhb",
    label: "DHB",
    symbol: "DHB",
    customAbbreviation: "dhb",
    chainId: 97,
    isSubscriptionSupported: true,
    address: "0xeb6ACdcfe1F13187126A504d56f7970bf6f3C5E1",
    iconUrl: "/icons/DHB.png", // Update to relevant image URL if needed
    decimals: 18
  },
  {
    value: "dhb",
    label: "DHB",
    symbol: "DHB",
    customAbbreviation: "dhb",
    chainId: 5,
    address: "0x0F0fBE6FB65AaCE87D84f599924f6524b4F8d858",
    iconUrl: "/icons/DHB.png", // Update to relevant image URL if needed
    decimals: 18
  },
  {
    value: "busd",
    label: "BUSD",
    symbol: "BUSD",
    customAbbreviation: "busd",
    chainId: 97,
    address: "0x53D4A05DF7caAf3302184B774855EcBe2a50bD3E",
    iconUrl: "https://cryptologos.cc/logos/binance-usd-busd-logo.png?v=024",
    decimals: 18
  },
  {
    value: "usdc",
    label: "USDC",
    symbol: "USDC",
    customAbbreviation: "usdc",
    chainId: 97,
    isSubscriptionSupported: true,
    address: "0x4131fd3F1206d48A89410EE610BF1949934e0a72",
    iconUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024",
    decimals: 18
  },
  {
    value: "eth",
    label: "ETH",
    symbol: "ETH",
    customAbbreviation: "eth",
    chainId: 56,
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // Update to relevant address if needed
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",
    decimals: 18
  },
  {
    value: "bnb",
    label: "BNB",
    symbol: "BNB",
    customAbbreviation: "bnb",
    chainId: 56,
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // Update to relevant address if needed
    iconUrl: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=024",
    decimals: 18
  }
];

const productionTokens = [
  {
    value: "dhb",
    label: "DHB",
    symbol: "DHB",
    customAbbreviation: "dhb",
    chainId: 8453,
    address: "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c",
    iconUrl: "/icons/DHB.png", // Update to relevant image URL if needed
    mintBlockNumber: 16428469,
    decimals: 18,
    isSubscriptionSupported: true
  },
  {
    value: "dhb",
    label: "DHB",
    symbol: "DHB",
    customAbbreviation: "dhb",
    chainId: 1,
    address: "0x99BB69Ee1BbFC7706C3ebb79b21C5B698fe58EC0",
    iconUrl: "/icons/DHB.png", // Update to relevant image URL if needed
    mintBlockNumber: 16428469,
    decimals: 18
  },
  {
    value: "dhb",
    label: "DHB",
    symbol: "DHB",
    customAbbreviation: "dhb",
    chainId: 56,
    address: "0x680D3113caf77B61b510f332D5Ef4cf5b41A761D",
    iconUrl: "/icons/DHB.png", // Update to relevant image URL if needed
    mintBlockNumber: 24867920,
    decimals: 18,
    isSubscriptionSupported: true
  },
  {
    value: "dhb",
    label: "DHB",
    symbol: "DHB",
    customAbbreviation: "dhb",
    chainId: 137,
    address: "0x6051e59eb50BB568415B6C476Fbd394EEF83834D",
    iconUrl: "/icons/DHB.png", // Update to relevant image URL if needed
    mintBlockNumber: 38197541,
    decimals: 18
  },
  {
    value: "usdc",
    label: "USDC",
    symbol: "USDC",
    customAbbreviation: "usdc",
    chainId: 8453,
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    iconUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024",
    decimals: 6,
    isSubscriptionSupported: true
  },
  {
    value: "weth",
    label: "WETH",
    symbol: "WETH",
    customAbbreviation: "weth",
    chainId: 8453,
    address: "0x4200000000000000000000000000000000000006",
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002",
    decimals: 18
  },

  {
    value: "weth",
    label: "WETH",
    symbol: "WETH",
    customAbbreviation: "weth",
    chainId: 137,
    address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=002",
    decimals: 18
  },
  {
    value: "usdt",
    label: "USDT",
    symbol: "USDT",
    customAbbreviation: "usdt",
    chainId: 8453,
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    iconUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=002",
    decimals: 6,
    isSubscriptionSupported: true
  },
  {
    value: "usdc",
    label: "USDC",
    symbol: "USDC",
    customAbbreviation: "usdc",
    chainId: 1,
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    iconUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024",
    decimals: 6
  },
  {
    value: "usdc",
    label: "USDC",
    symbol: "USDC",
    customAbbreviation: "usdc",
    chainId: 56,
    address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
    iconUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024",
    decimals: 18,
    isSubscriptionSupported: true
  },
  {
    value: "usdc",
    label: "USDC",
    symbol: "USDC",
    customAbbreviation: "usdc",
    chainId: 137,
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    iconUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=024",
    decimals: 6
  },
  {
    value: "usdt",
    label: "USDT",
    symbol: "USDT",
    customAbbreviation: "usdt",
    chainId: 1,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    iconUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=024",
    decimals: 18
  },
  {
    value: "usdt",
    label: "USDT",
    symbol: "USDT",
    customAbbreviation: "usdt",
    chainId: 56,
    address: "0x55d398326f99059ff775485246999027b3197955",
    iconUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=024",
    decimals: 18,
    isSubscriptionSupported: true
  },
  {
    value: "usdt",
    label: "USDT",
    symbol: "USDT",
    customAbbreviation: "usdt",
    chainId: 137,
    address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    iconUrl: "https://cryptologos.cc/logos/tether-usdt-logo.png?v=024",
    decimals: 18
  },
  {
    value: "doge",
    label: "DOGE",
    symbol: "DOGE",
    customAbbreviation: "doge",
    chainId: 56,
    address: "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
    iconUrl: "https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=024",
    decimals: 8,
    isSubscriptionSupported: true
  },
  {
    value: "floki",
    label: "FLOKI",
    symbol: "FLOKI",
    customAbbreviation: "floki",
    chainId: 1,
    address: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
    iconUrl: "https://cryptologos.cc/logos/floki-inu-floki-logo.png?v=024",
    decimals: 9
  },
  {
    value: "floki",
    label: "FLOKI",
    symbol: "FLOKI",
    customAbbreviation: "floki",
    chainId: 56,
    address: "0xfb5b838b6cfeedc2873ab27866079ac55363d37e",
    iconUrl: "https://cryptologos.cc/logos/floki-inu-floki-logo.png?v=024",
    decimals: 9,
    isSubscriptionSupported: true
  },

  {
    value: "eth",
    label: "ETH",
    symbol: "ETH",
    customAbbreviation: "eth",
    chainId: 56,
    address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // Update to relevant address if needed
    iconUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=024",
    decimals: 18
  },
  {
    value: "bnb",
    label: "BNB",
    symbol: "BNB",
    customAbbreviation: "bnb",
    chainId: 56,
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // Update to relevant address if needed
    iconUrl: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=024",
    decimals: 18
  }
];

export const supportedTokens = isDevMode ? devTokens : productionTokens;

export const supportedTokensForLockContent = supportedTokens.filter((e) => e.symbol === "DHB");
export const supportedTokensForPPV = supportedTokens;
export const supportedTokensForAddBounty = supportedTokens;

export const supportedChainIdsForMinting = [ChainId.BSC_MAINNET, ChainId.BASE_MAINNET];
export const supportedChainIds = isDevMode
  ? [ChainId.BSC_TESTNET, ChainId.GORLI]
  : [ChainId.MAINNET, ChainId.BSC_MAINNET, ChainId.POLYGON_MAINNET, ChainId.BASE_MAINNET];
export const defaultChainId = isDevMode ? ChainId.GORLI : ChainId.BSC_MAINNET;
export const defaultTokenSymbol = "DHB";
export const defaultWatchTimeForPPV = 2 * 60 * 60; // second unit
export const devFee = 0.1;
export const publicChatChannelId = "public_chn_prod_1";
export const limitTip = 1_000_000_000;
export const expireSignTime = env.NEXT_PUBLIC_DEV ? 60 * 60 * 2 : 60 * 60 * 24; // 2 hours

export const ErrMsgEn = {
  lockContent: {},
  ppvContent: {},
  bountyContent: {},
  wallet: {
    connect_to_stream: "Connect wallet to stream",
    connect_to_wallet_to_deposit: "Connect wallet to deposit"
  }
};

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

export const MULTICALL2_ADDRESSES: { [chainId: number]: string } = {
  [ChainId.MAINNET]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.ROPSTEN]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.RINKEBY]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.GORLI]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.KOVAN]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.BSC_MAINNET]: "0x41B90b73a88804f2aed1C4672b3dbA74eb9A92ce",
  [ChainId.BSC_TESTNET]: "0x80d0d36d9E3Cb0Bd4561beB1d9d1cC8e1a33F5b1",
  [ChainId.FANTOM_MAINNET]: "0xbb804a896E1A6962837c0813a5F89fDb771d808f",
  [ChainId.AVALANCHE_MAINNET]: "0x84514BeaaF8f9a4cbe25A9C5a7EBdd16B4FE7154",
  [ChainId.OKEX_MAINNET]: "0xdf4CDd4b8F1790f62a91Bcc4cb793159c641B1bd",
  [ChainId.POLYGON_MAINNET]: "0x275617327c958bD06b5D6b871E7f491D76113dd8",
  [ChainId.BASE_MAINNET]: "0x944afB839712DfF2cCf83D2DaAf34A04B029B2B7"
};

export const DHB_ADDRESSESS: { [chainId: number]: string } = {
  [ChainId.MAINNET]: "0x99BB69Ee1BbFC7706C3ebb79b21C5B698fe58EC0",
  [ChainId.ROPSTEN]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.RINKEBY]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.GORLI]: "0x0F0fBE6FB65AaCE87D84f599924f6524b4F8d858",
  [ChainId.KOVAN]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [ChainId.BSC_MAINNET]: "0x680D3113caf77B61b510f332D5Ef4cf5b41A761D",
  [ChainId.BSC_TESTNET]: "0x06EdA7889330031a8417f46e4C771C628c0b6418",
  [ChainId.FANTOM_MAINNET]: "0xbb804a896E1A6962837c0813a5F89fDb771d808f",
  [ChainId.AVALANCHE_MAINNET]: "0x84514BeaaF8f9a4cbe25A9C5a7EBdd16B4FE7154",
  [ChainId.OKEX_MAINNET]: "0xdf4CDd4b8F1790f62a91Bcc4cb793159c641B1bd",
  [ChainId.POLYGON_MAINNET]: "0x6051e59eb50BB568415B6C476Fbd394EEF83834D",
  [ChainId.BASE_MAINNET]: "0xD20ab1015f6a2De4a6FdDEbAB270113F689c2F7c"
};
export const SB_ADDRESS: { [chainId: number]: string } = {
  [ChainId.BSC_TESTNET]: "0xEbCea2213AE6c69c74F6f648fcFF6A27842c78F1", //'0x3A76858fb35520c3CA20E826901c7cB73F715251',
  [ChainId.BSC_MAINNET]: "0x64eD1cEf5ba5655DAe565Ee592b6eb229e8CB05C",
  [ChainId.BASE_MAINNET]: "0x91Cb5e924285484Ec666fF969D3941414fcE15d1"
};

export const durations = [
  { title: "1 month", value: 1, tier: 1 },
  { title: "3 months", value: 3, tier: 2 },
  { title: "6 months", value: 6, tier: 3 },
  { title: "1 year", value: 12, tier: 4 },
  { title: "lifetime", value: 999, tier: 5 }
];
