"use client";

import type { LeaderboradResponse } from "@/services/nfts/leaderborad";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Menu, MessageSquareText, NotepadText } from "lucide-react";

import { LeaderBoardModal } from "@/app/components/leaderboard-modal";

import {
  Bounty,
  Contact,
  Documents,
  Exclusive,
  Explore,
  LeaderBoard,
  New,
  Notification,
  PPV,
  Profile,
  Treading,
  Upload
} from "@/components/icons";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";

import { getLeaderborard } from "@/services/nfts/leaderborad";

import { Feed } from "./icons/feed";
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
    icon: <Profile />,
    url: "/me",
    isLink: true
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: <Notification />
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
    icon: <Feed />,
    url: () => "/?type=feed",
    isLink: true
  },
  {
    id: "ppv",
    name: "PPV",
    icon: <PPV />,
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
    icon: <Bounty />,
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
    icon: <Exclusive />,
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
    icon: <New />,
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
    icon: <Treading />,
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
    id: "leaderboard",
    name: "Leaderboard",
    icon: <Notification />,
    url: null,
    isLink: false,
    component: <Leaderboard />
  },
  {
    id: 7,
    name: "Upload",
    icon: <Upload />,
    url: "/upload",
    isLink: true
  },
  {
    id: "explore",
    name: "Explore",
    icon: <Explore />,
    url: "/",
    isLink: true
  },
  {
    id: "documents",
    name: "Documents",
    icon: <Documents />,
    url: "https://dehub.gitbook.io",
    isLink: true
  },
  {
    id: "contact",
    name: "Contact",
    icon: <Contact />,
    url: "https://t.me/dehub",
    isLink: true
  }
] as Link[];

export function HambMenu() {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!isSmallScreen) return null;

  return (
    <div className="size-auto">
      <Button size="icon_sm" onClick={toggleMenu} variant="ghost" className="rounded-full">
        <Menu className="text-gray-400 dark:text-theme-titan-white" />
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
            (isOpen
              ? "translate-x-0 bg-theme-background dark:bg-theme-mine-shaft-dark"
              : "translate-x-full")
          }
        >
          <div className="h-screen w-full overflow-y-scroll py-10">
            <div className="flex size-full flex-col items-start justify-start">
              {links.map((link) => {
                if (link.id === "notifications") {
                  return (
                    <NotificationMobileModal
                      key={link.id}
                      className="w-full justify-start gap-4 rounded-none border-b border-theme-mine-shaft-dark p-8 dark:border-theme-mine-shaft"
                    />
                  );
                }

                if (!link.isLink) return link.component;

                return (
                  <Button
                    asChild
                    key={link.id}
                    variant="ghost"
                    className="w-full justify-start gap-4 rounded-none border-b border-theme-mine-shaft-dark p-8 dark:border-theme-mine-shaft"
                    onClick={toggleMenu}
                  >
                    <Link
                      href={
                        typeof link.url === "string" ? link.url : link.url(searchParams.toString())
                      }
                      key={link.id}
                      className="gap-1"
                    >
                      <span>{link.icon}</span>
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
            <div className="py-28"></div>
          </div>

          <div
            className="fixed bottom-0 left-0 z-10 grid h-auto w-full place-items-center py-8"
            onClick={toggleMenu}
          >
            <Button variant="ghost" className="size-20 rounded-full">
              <ArrowRight className="size-10" />
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
        className="w-full justify-start gap-4 rounded-none border-b border-theme-mine-shaft-dark p-8 dark:border-theme-mine-shaft"
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
          className="w-full justify-start gap-4 rounded-none border-b border-theme-mine-shaft-dark p-8 dark:border-theme-mine-shaft"
        >
          <LeaderBoard />
          <span className="text-sm">Leaderboard</span>
        </Button>
      }
    />
  );
}
