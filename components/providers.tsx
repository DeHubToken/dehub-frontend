"use client";

// import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { wagmiConfig } from "@/hooks/web3-connect";

import { supportedNetworks } from "@/web3/configs";

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

export default function Providers({ children }: { children: React.ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  // have a suspense boundary between this and the code that may
  // suspend because React will throw away the client on the initial
  // render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
      {/* <DevTools /> */}
    </>
  );
}

const SwitchChainProviderContext = createContext<any>({});
export const useSwitchChain = () => useContext(SwitchChainProviderContext);

export const SwitchChainProvider = ({ children }: any) => {
  // Ensure we only access localStorage on the client-side
  const [selectedChain, setSelectedChain] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check localStorage only if it's the client-side
      const storedChain = localStorage.getItem('selectedChain');
      if (storedChain) {
        setSelectedChain(Number(storedChain));
      } else {
        // If no selectedChain in localStorage, use default
        setSelectedChain(supportedNetworks[0].chainId);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedChain !== null && typeof window !== 'undefined') {
      // Update localStorage when selectedChain changes
      localStorage.setItem('selectedChain', String(selectedChain));
    }
  }, [selectedChain]);

  const switchChain = (chainId: number) => {
    setSelectedChain(chainId);
  };

  console.log("selectedChain", selectedChain);

  const contextValue = {
    switchChain,
    setSelectedChain,
    selectedChain,
  };

  return (
    <SwitchChainProviderContext.Provider value={contextValue}>
      {children}
    </SwitchChainProviderContext.Provider>
  );
};