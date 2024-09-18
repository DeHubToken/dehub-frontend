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
      <div className="flex size-full min-h-screen items-start justify-between">
        <Suspense
          fallback={
            <SidebarSkeleton className="md:max-w-[7%] md:flex-[0_0_7%] lg:max-w-[13%] lg:flex-[0_0_13%]" />
          }
        >
          <DesktopSidebar />
        </Suspense>
        <MobileOnlyBottomBar />
        <main className="h-auto w-full max-w-full flex-[0_0_100%] md:max-w-[93%] md:flex-[0_0_93%] lg:max-w-[87%] lg:flex-[0_0_87%]">
          {props.children}
        </main>
      </div>
    </div>
  );
}
