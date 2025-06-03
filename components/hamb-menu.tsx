"use client";

import type { LeaderboradResponse } from "@/services/nfts/leaderborad";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Menu,
  MessageSquareText,
  Newspaper,
  NotepadText,
  ThumbsUp
} from "lucide-react";

import { LeaderBoardModal } from "@/app/components/leaderboard-modal";

import {
  Bounty,
  Contact,
  Documents,
  Exclusive,
  Explore,
  Game,
  LeaderBoard as LeaderBoardIcon,
  New,
  Notification as NotificationIcon,
  PPV,
  Profile,
  Treading,
  Upload,
  BuyCrypto,
  SwapCrypto,
  SellCrypto
} from "@/components/icons";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";

import { getLeaderborard } from "@/services/nfts/leaderborad";

import { Broadcast } from "./_icons";
import { NotificationMobileModal } from "./modals/notification-modal";

type LinkBase = {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string | ((q: string) => string);
  external?: boolean;
};

type LinkWithoutComponent = LinkBase & { isLink: true };
type LinkWithComponent = LinkBase & { isLink: false; component: React.ReactNode };
type Link = LinkWithoutComponent | LinkWithComponent;

const links = [
  {
    id: "profile",
    name: "Profile",
    icon: <Profile className="size-4" />,
    url: "/me",
    isLink: true
  },
  {
    id: "notifications",
    name: "Notifications"
    // icon: <NotificationIcon />
  },
  {
    id: "messages",
    name: "Messages",
    icon: <MessageSquareText className="size-4" />,
    url: () => "/messages",
    isLink: true
  },
  {
    id: "plans",
    name: "My Plans",
    icon: <NotepadText className="size-4" />,
    url: () => "/plans",
    isLink: true
  },
  {
    id: "feed",
    name: "Feed",
    icon: <Newspaper className="size-4" />,
    url: () => "/?type=feed",
    isLink: true
  },
  {
    id: "ppv",
    name: "PPV",
    icon: <PPV className="size-4" />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "ppv");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    isLink: true
  },
  {
    id: "watch2earn",
    name: "Watch2Earn",
    icon: <Bounty className="size-4" />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "bounty");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    isLink: true
  },
  {
    id: "exclusive",
    name: "Exclusive",
    icon: <Exclusive className="size-4" />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "locked");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    isLink: true
  },
  {
    id: "new",
    name: "New",
    icon: <New className="size-4" />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "new");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    isLink: true
  },
  {
    id: "trending",
    name: "Most Viewed",
    icon: <Treading className="size-4" />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "trends");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    isLink: true
  },
  {
    id: "likedvideos",
    name: "Liked Videos",
    icon: <Game className="size-4" />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "liked");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    isLink: true
  },
  {
    id: "live",
    name: "Livestreams",
    icon: <Broadcast className="size-4" />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "live");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    isLink: true
  },
  {
    id: "leaderboard",
    name: "Leaderboard",
    icon: <LeaderBoardIcon className="size-4" />,
    url: null,
    isLink: false,
    component: <Leaderboard />
  },
  {
    id: 7,
    name: "Upload",
    icon: <Upload className="size-4" />,
    url: "/upload",
    isLink: true
  },
  {
    id: 11,
    name: "Go Live",
    icon: <Broadcast className="size-4" />,
    url: "/live",
    isLink: true
  },
  {
    id: "explore",
    name: "Explore",
    icon: <Explore className="size-4" />,
    url: "/",
    isLink: true
  },
  {
    id: "documents",
    name: "Documents",
    icon: <Documents className="size-4" />,
    url: "https://dehub.gitbook.io",
    isLink: true
  },
  {
    id: "contact",
    name: "Contact",
    icon: <Contact className="size-4" />,
    url: "https://t.me/dehub",
    isLink: true
  },
  {
    id: "buyCrypto",
    name: "Buy Crypto",
    icon: <BuyCrypto />,
    url: () => "/buy-crypto",
    isLink: true
  },
  {
    id: "sellCrypto",
    name: "Sell Crypto",
    icon: <SellCrypto />,
    url: () => "/sell-crypto",
    isLink: true
  },
  {
    id: "swap",
    name: "Swap Crypto",
    icon: <SwapCrypto />,
    url: () => "/swap-crypto",
  }
] as Link[];

export function HambMenu() {
  const isSmallScreen = useMediaQuery("(max-width: 1160px)");
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!isSmallScreen) return null;

  return (
    <div className="flex size-auto items-center justify-center">
      <Button
        size="icon_sm"
        onClick={toggleMenu}
        variant="ghost"
        className="rounded-full hover:bg-theme-neutrals-800"
      >
        <Menu className="text-gray-400 text-theme-neutrals-200" />
      </Button>

      <div
        className={
          "fixed left-0 top-0 z-30 flex size-full items-start justify-end transition-all duration-500 ease-in-out " +
          (isOpen
            ? "visible bg-theme-mine-shaft/90 opacity-100 dark:bg-theme-background/70"
            : " invisible opacity-0")
        }
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            toggleMenu();
          }
        }}
      >
        <div
          className={
            "relative h-screen w-full max-w-[70%] overflow-hidden transition-all duration-500 ease-in-out " +
            (isOpen ? "translate-x-0 bg-theme-neutrals-900" : "translate-x-full")
          }
        >
          <div className="side_menu mr-2 h-screen w-full overflow-y-auto py-10">
            <div className="flex size-full flex-col items-start justify-start">
              {links.map((link, key) => {
                if (link.id === "notifications") {
                  return (
                    <NotificationMobileModal
                      key={key}
                      className="w-full justify-start gap-4 rounded-none border-b border-theme-neutrals-800 p-8"
                    />
                  );
                }

                if (!link.isLink) return link.component;

                return (
                  <Button
                    asChild
                    key={key}
                    variant="ghost"
                    className="w-full justify-start gap-4 rounded-none border-b border-theme-neutrals-800 p-8 text-theme-neutrals-200 hover:bg-theme-neutrals-600 dark:hover:bg-theme-neutrals-800"
                    onClick={toggleMenu}
                  >
                    <Link
                      href={
                        typeof link.url === "string" ? link.url : link.url(searchParams.toString())
                      }
                      key={key}
                      className="gap-1"
                    >
                      <span>{link.icon}</span>
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
            <div className="py-28" />
          </div>

          <div
            className="fixed bottom-6 left-0 z-10 grid h-auto w-full place-items-center py-8 backdrop-blur-sm"
            onClick={toggleMenu}
          >
            <Button variant="ghost" className="size-20 rounded-full hover:bg-theme-neutrals-800">
              <ArrowRight className="size-10 text-theme-neutrals-200" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Leaderboard() {
  const [data, setData] = useState<LeaderboradResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    setStatus("loading");
    getLeaderborard().then((res) => {
      if (res.success) {
        setData(res.data);
        setStatus("success");
        return;
      } else {
        setStatus("error");
      }
    });
  }, []);

  if (!data) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start gap-4 rounded-none border-b border-theme-neutrals-800 p-8 text-theme-neutrals-200 hover:bg-theme-neutrals-600 dark:hover:bg-theme-neutrals-800"
      >
        {status === "loading" ? "Leaderboard" : "Error"}
      </Button>
    );
  }

  return (
    <LeaderBoardModal
      data={data}
      trigger={
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 rounded-none border-b border-theme-neutrals-800 p-8 text-theme-neutrals-200 hover:bg-theme-neutrals-600 dark:hover:bg-theme-neutrals-800"
        >
          <LeaderBoardIcon className="size-4" />
          <span className="text-sm">Leaderboard</span>
        </Button>
      }
    />
  );
}
