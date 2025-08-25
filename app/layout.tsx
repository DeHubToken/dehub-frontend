import type { Metadata } from "next";

import "react-loading-skeleton/dist/skeleton.css";
import "react-image-crop/dist/ReactCrop.css";
import "jotai-devtools/styles.css";
import "@/styles/global.css";

import { headers } from "next/headers";
import { cookieToWeb3AuthState } from "@web3auth/modal";

import { Layout } from "@/components/layout";
import { ProgressBar } from "@/components/progress";
import Providers from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toast } from "@/components/ui/toaster";

import { AvatarWalletProvider } from "@/contexts/avatar-wallet";
import { WebsocketProvider } from "@/contexts/websocket";

import { env } from "@/configs";

import { StreamProvider } from "./components/stream-provider";

/* ------------------------------------------------------------------------------------------ */

type Props = { children: React.ReactNode };

export default function RootLayout({ children }: Props) {
  const headersList = headers();
  const web3authInitialState = cookieToWeb3AuthState(headersList.get("cookie"));

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-nunito overflow-x-hidden bg-theme-neutrals-900 text-theme-neutrals-200 dark:bg-theme-neutrals-900 dark:text-theme-neutrals-200">
        <Toaster />
        <Toast />
        <ProgressBar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers web3authInitialState={web3authInitialState}>
            <AvatarWalletProvider>
              <WebsocketProvider>
                <StreamProvider>
                  <TailwindIndicator />
                  <Layout>{children}</Layout>
                </StreamProvider>
              </WebsocketProvider>
            </AvatarWalletProvider>
          </Providers>
        </ThemeProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "DeHub - The Decentralised Entertainment Hub",
  description: "The decentralised entertainment hub, watch, shop &amp; play on-chain today.",
  icons: {
    icon: [
      {
        url: "/favicon-32x32.png",
        rel: "icon",
        sizes: "32x32",
        type: "image/png"
      },
      {
        url: "/favicon-16x16.png",
        rel: "icon",
        sizes: "16x16",
        type: "image/png"
      }
    ],
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.NEXT_PUBLIC_URL,
    title: "DeHub - The Decentralised Entertainment Hub",
    description: "The decentralised entertainment hub, watch, shop &amp; play on-chain today.",
    siteName: "DeHub",
    images: [
      {
        url: "https://images.ctfassets.net/4jicnfvodfm8/1SqWTgh7HdbGfryephE7RZ/b8f43419737eb3d98c7e22e07ad6f900/dehub-logo.png?w=1200"
      }
    ]
  }
};
