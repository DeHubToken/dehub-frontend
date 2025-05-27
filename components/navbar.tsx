import dynamic from "next/dynamic";
import Link from "next/link";

import { SearchBox, SearchModal } from "@/app/components/search-box";

import { HambMenu } from "@/components/hamb-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { Logo } from "./logo";
import { ThemeSwitcher } from "./theme-switcher";

/* ----------------------------------------------------------------------------------------------- */

export const ConnectButton = dynamic(() => import("./connect-button"), {
  ssr: false,
  loading: () => (
    <div className="flex size-auto items-center justify-center">
      <Skeleton className="h-12 w-[162px] rounded-full bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft" />
    </div>
  )
});

export function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-20 h-[var(--navbar-height)] max-h-[var(--navbar-height)] w-full bg-theme-neutrals-900 shadow-custom dark:bg-theme-neutrals-900">
      <div className="flex items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="w-80 sm:w-32">
          <Logo />
        </Link>

        <div className="w-48 lg:max-w-[calc((500/16)*1rem)]">
          <SearchBox />
        </div>
        <SearchModal />
        <div className="flex items-center justify-start gap-1 sm:gap-4">
          <ConnectButton label="Connect" />
          <HambMenu />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
