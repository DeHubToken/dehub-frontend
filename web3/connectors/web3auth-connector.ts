// import type { Wallet } from "@rainbow-me/rainbowkit";

// import { Chain } from "@wagmi/chains";
// import { WEB3AUTH_NETWORK, Web3AuthNoModal } from "@web3auth/no-modal";
// // import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, LOGIN_PROVIDER } from "@web3auth/base";
// import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

// import { env, isDevMode } from "@/configs";

// export function web3AuthWallet({
//   chains,
//   provider,
// }: {
//   chains: Chain[];
//   provider: 'google' | 'twitter';
// }): Wallet {
//   const web3AuthInstance = new Web3AuthNoModal({
//     clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
//     web3AuthNetwork: isDevMode ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
//   });

//   const connector = new Web3AuthConnector({
//     chains,
//     options: {
//       web3AuthInstance,
//       loginParams: {
//         loginProvider: provider,
//       },
//     },
//   });

//   return {
//     id: `web3auth-${provider}`,
//     name: provider === 'google' ? 'Google' : 'Twitter',
//     iconUrl: provider === 'google' ? '/icons/google.svg' : '/icons/x.png',
//     iconBackground: '#fff',
//     createConnector: () => ({
//       connector,
//       mobile: null,
//       desktop: null,
//       qrCode: null,
//       extension: null,
//     }),
//   };
// }