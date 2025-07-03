"use client";

// import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3AuthProvider } from "@web3auth/modal/react";
import { WagmiProvider } from "@web3auth/modal/react/wagmi";
import { domAnimation, LazyMotion } from "framer-motion";
import { useAccount } from "wagmi";

import { web3AuthContextConfig } from "@/hooks/web3-connect";

import { supportedNetworks } from "@/web3/configs";
import { IWeb3AuthState } from "@web3auth/no-modal";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// const DevTools = dynamic(() => import("jotai-devtools").then((m) => m.DevTools), { ssr: false });

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

const queryClient = new QueryClient();

export default function Providers({ children, web3authInitialState }: { children: React.ReactNode; web3authInitialState: IWeb3AuthState | undefined }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  // have a suspense boundary between this and the code that may
  // suspend because React will throw away the client on the initial
  // render if it suspends and there is no boundary
  // const queryClient = getQueryClient();

  return (
    <>
      <Web3AuthProvider config={web3AuthContextConfig} initialState={web3authInitialState}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider>
            <LazyMotion features={domAnimation}>{children}</LazyMotion>
          </WagmiProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </Web3AuthProvider>
      {/* <DevTools /> */}
    </>
  );
}