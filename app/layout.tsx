import type { Metadata } from "next";

import { Exo_2 } from "next/font/google";
import localFont from "next/font/local";

import "@rainbow-me/rainbowkit/styles.css";
import "react-loading-skeleton/dist/skeleton.css";
import "react-image-crop/dist/ReactCrop.css";
import "jotai-devtools/styles.css";
import "@/styles/global.css";

import { Layout } from "@/components/layout";
import { NoticeModal } from "@/components/modals/notice";
import { ProgressBar } from "@/components/progress";
import Providers, { SwitchChainProvider } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toast } from "@/components/ui/toaster";

import { AvatarWalletProvider } from "@/contexts/avatar-wallet";
import { WebsocketProvider } from "@/contexts/websocket";

import { env } from "@/configs";

import { StreamProvider } from "./components/stream-provider";

/**
 * Next.js font optimization
 * Docs: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts#with-tailwind-css
 **/

/** Exo 2 google font: https://fonts.google.com/specimen/Exo+2?vfquery=exo+2 */
const exo_2 = Exo_2({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-exo2"
});

/** Tanker local font: https://www.fontshare.com/?q=Tanker */
const tanker = localFont({
  src: "../public/fonts/tanker.woff2",
  display: "swap",
  variable: "--font-tanker"
});

const fontVariables = `${exo_2.variable} ${tanker.variable}`;

/* ------------------------------------------------------------------------------------------ */

type Props = { children: React.ReactNode };

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-nunito overflow-x-hidden bg-theme-neutrals-900 text-theme-neutrals-200 dark:bg-theme-neutrals-900 dark:text-theme-neutrals-200">
        <Toaster />
        <Toast />
        <ProgressBar />
        <NoticeModal />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <SwitchChainProvider>
              <AvatarWalletProvider>
                <WebsocketProvider>
                  <StreamProvider>
                    <TailwindIndicator />
                    <Layout>{children}</Layout>
                  </StreamProvider>
                </WebsocketProvider>
              </AvatarWalletProvider>
            </SwitchChainProvider>
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
