"use client";

import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

import { env, supportedChainIds } from "@/configs";

/* ================================================================================================= */

export const networkConnector = new NetworkConnector({
  urls: {
    1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    42: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    250: "https://rpc.ftm.tools",
    137: "https://rpc-mainnet.maticvigil.com",
    56: "https://bscrpc.com",
    97: "https://data-seed-prebsc-1-s2.binance.org:8545"
  },
  defaultChainId: env.currentNetwork
});

export const injectedConnector = new InjectedConnector({
  supportedChainIds
});

export const walletConnector = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    4: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    5: "https://georli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    42: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    250: "https://rpc.ftm.tools",
    137: "https://rpc-mainnet.maticvigil.com",
    56: "https://bscrpc.com"
  },
  chainId: env.currentNetwork,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});
