"use client";

import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { env, supportedChainIds } from "@/configs";

const infuraKey = env.NEXT_PUBLIC_INFURA_KEY;

/** @deprecated please use NETWORK_URLS from configs/index.ts */
export const networkConnector = new NetworkConnector({
  urls: {
    1: `https://mainnet.infura.io/v3/${infuraKey}`,
    3: `https://ropsten.infura.io/v3/${infuraKey}`,
    4: `https://rinkeby.infura.io/v3/${infuraKey}`,
    5: `https://goerli.infura.io/v3/${infuraKey}`,
    42: `https://kovan.infura.io/v3/${infuraKey}`,
    250: "https://rpc.ftm.tools",
    137: "https://rpc-mainnet.maticvigil.com",
    56: "https://bscrpc.com",
    97: "https://data-seed-prebsc-1-s2.binance.org:8545",
    42161: "https://arb1.arbitrum.io/rpc"
  },
  defaultChainId: env.NEXT_PUBLIC_NETWORK_ID
});

export const injectedConnector = new InjectedConnector({
  supportedChainIds
});

/** @deprecated please use NETWORK_URLS from configs/index.ts */
export const walletConnector = new WalletConnectConnector({
  rpc: {
    1: `https://mainnet.infura.io/v3/${infuraKey}`,
    3: `https://ropsten.infura.io/v3/${infuraKey}`,
    4: `https://rinkeby.infura.io/v3/${infuraKey}`,
    5: `https://georli.infura.io/v3/${infuraKey}`,
    42: `https://kovan.infura.io/v3/${infuraKey}`,
    250: "https://rpc.ftm.tools",
    137: "https://rpc-mainnet.maticvigil.com",
    56: "https://bscrpc.com",
    42161: "https://arb1.arbitrum.io/rpc"
  },
  chainId: env.NEXT_PUBLIC_NETWORK_ID,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});
