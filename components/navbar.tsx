import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { SearchModal } from "@/app/components/search-box";

import { HambMenu } from "@/components/hamb-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { ThemeSwitcher } from "./theme-switcher";

/* ----------------------------------------------------------------------------------------------- */

const ConnectButton = dynamic(() => import("./connect-button"), {
  ssr: false,
  loading: () => (
    <div className="flex size-auto items-center justify-center">
      <Skeleton className="h-12 w-[162px] rounded-full bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft" />
    </div>
  )
});

export function Navbar() {
  return (
    <nav className="fixed left-0 top-0 z-20 h-auto w-full bg-theme-background shadow-custom dark:bg-theme-background">
      <div className="container flex max-w-[90%] items-center justify-between py-5 md:max-w-[95%] md:py-4">
        <Link href="/" className="w-32">
          <Logo />
        </Link>

        <div className="flex size-auto items-center justify-end gap-2 md:gap-6">
          <SearchModal />
          <ConnectButton label="Connect" />
          <HambMenu />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
