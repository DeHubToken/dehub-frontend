"use client";

import Link from "next/link";
import { MessageSquareText, Plus } from "lucide-react";

import { Home, Profile, Stream } from "@/components/icons";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";

const links: {
  id: number;
  name: string;
  url: string;
  icon: JSX.Element;
  external?: boolean;
}[] = [
  {
    id: 1,
    name: "Home",
    url: "/",
    icon: <Home />
  },
  {
    id: 2,
    name: "Stream",
    url: "/",
    icon: <Stream />
  },
  {
    id: 3,
    name: "Upload",
    url: "/upload",
    icon: <Plus className="size-4" />
  },
  {
    id: 4,
    name: "Messages",
    url: "/messages",
    icon: <MessageSquareText className="size-4" />
  },
  {
    id: 5,
    name: "Profile",
    url: "/me",
    icon: <Profile />
  }
];

export function MobileOnlyBottomBar() {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  if (!isSmallScreen) return null;
  return (
    <div className="fixed bottom-0 left-0 z-[100] h-auto w-full border-t-2 bg-theme-background py-2 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <div className="flex h-auto w-full items-center justify-around">
        {links.map((link) => (
          <Button key={link.id} className="h-max flex-col gap-0.5 py-1" asChild variant="ghost">
            <Link
              href={link.url}
              target={link.external ? "_blank" : "_self"}
              rel={link.external ? "noopener noreferrer" : ""}
            >
              <span className="scale-105">{link.icon}</span>
              <span className="text-[10px]">{link.name}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function DesktopSidebar() {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  if (isSmallScreen) return null;
  return <Sidebar className="md:max-w-[7%] md:flex-[0_0_7%] lg:max-w-[13%] lg:flex-[0_0_13%]" />;
}
