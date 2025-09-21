import { Suspense } from "react";

import { Navbar } from "@/components/navbar";

import { cn } from "@/libs/utils";

import { DesktopSidebar, MobileOnlyBottomBar } from "./desktop-sidebar";
import SidebarSkeleton from "./sidebar-skeleton";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Layout(props: Props) {
  return (
    <div {...props} className={cn("size-full", props.className)}>
      <Navbar />
      <div className="mt-[var(--navbar-height)] flex min-h-screen w-full">
        <Suspense fallback={<SidebarSkeleton className="lg:max-w-[13%] lg:flex-[0_0_13%]" />}>
          <DesktopSidebar />
        </Suspense>
        <MobileOnlyBottomBar />
        <main className="h-auto w-full max-w-full pt-2 sm:pt-6 lg:ml-[88px] lg:max-w-[calc(100vw-var(--sidebar-width))]">
          {props.children}
        </main>
      </div>
    </div>
  );
}
