/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageSquareText, Newspaper, NotepadText, ThumbsUp } from "lucide-react";

import { leaderboardColumns } from "@/app/components/leaderboard-modal";

import { DataTable } from "@/components/data-grid/data-table";
import {
  Bounty,
  Contact,
  Documents,
  Exclusive,
  Explore,
  Game,
  LeaderBoard,
  New,
  Notification,
  PPV,
  Profile,
  Treading,
  Upload
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { getLeaderborard } from "@/services/nfts/leaderborad";

import { Feed } from "./icons/feed";
import NotificationModal from "./modals/notification-modal";

type Props = React.HTMLAttributes<HTMLDivElement>;

type Link = {
  id: string;
  name: string;
  icon: React.ReactNode;
  url?: (q: string) => string;
  external?: boolean;
  component?: React.ReactNode;
};

const links = [
  {
    id: "profile",
    name: "Profile",
    icon: <Profile />,
    url: () => "/me",
    external: false
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: <Notification />,
    component: <NotificationModal key="_notification_modal_cf1gy" />
  },
  {
    id: "messages",
    name: "Messages",
    icon: <MessageSquareText className="size-4" />,
    url: () => "/messages"
  },
  {
    id: "plans",
    name: "My Plans",
    icon: <NotepadText className="size-4" />,
    url: () => "/plans"
  },
  {
    id: "feed",
    name: "Feed",
    icon: <Newspaper className="size-4" />,
    url: () => "/?type=feed",
    external: false
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
    external: false
  },
  {
    id: "bounty",
    name: "Watch2Earn",
    icon: <Bounty />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "bounty");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    external: false
  },
  {
    id: "locked",
    name: "Exclusive",
    icon: <Exclusive />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "locked");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    external: false
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
    external: false
  },
  {
    id: "trends",
    name: "Most Viewed",
    icon: <Treading />,
    url: () => {
      const query = new URLSearchParams();
      query.set("type", "trends");
      query.delete("q");
      const qs = query.toString();
      return `/?${qs}`;
    },
    external: false
  },
  {
    id: "likedvideos",
    name: "Liked Videos",
    icon: <Game />,
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
    id: "upload",
    name: "Upload",
    icon: <Upload />,
    url: () => "/upload"
  },
  {
    id: "upload-feed",
    name: "Upload Feed",
    icon: <Upload />,
    url: () => "/upload-feed"
  },
  {
    id: "explore",
    name: "Explore",
    icon: <Explore />,
    url: () => "/"
  },
  {
    id: "leaderboard",
    name: "Leaderboard",
    icon: <LeaderBoard />
  },
  {
    id: "documents",
    name: "Documents",
    icon: <Documents />,
    url: () => "https://dehub.gitbook.io",
    external: true
  },
  {
    id: "contact",
    name: "Contact",
    icon: <Contact />,
    url: () => "https://t.me/dehub",
    external: true
  }
] as Link[];

export function Sidebar(props: Props) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { account, library } = useActiveWeb3React();
  const [leaderBoard, setLeaderBoard] = useState<any>([]);
  const [openLeaderBoard, setOpenLeaderBoard] = useState(false);

  function handleClick(link: Link) {
    if (link.name === "Leaderboard") setOpenLeaderBoard(true);
  }

  useEffect(() => {
    const setup = async () => {
      const leaderboardResponse = await getLeaderborard();
      setLeaderBoard(leaderboardResponse);
    };
    setup();
  }, [account, library]);

  return (
    <div
      {...props}
      className={cn(
        "sticky left-0 top-0  h-screen w-full pl-6 pt-20 sm:pr-2 xl:pr-6",
        props.className
      )}
    >
      <div className="flex size-full flex-col items-start justify-start gap-1">
        {links.map((link) => {
          const isActive = type?.toLowerCase() === link.id.toLowerCase();

          if (link.component) return link.component;

          if (link.url) {
            // profile
            if (
              link.id === "profile" ||
              link.id === "messages" ||
              link.id === "plans" ||
              link.id === "likedvideos"
            ) {
              if (!account) return null;
              return (
                <SidebarLinkButton
                  key={link.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleClick(link)}
                >
                  <Link
                    href={link.url(searchParams.toString())}
                    target={link.external ? "_blank" : "_self"}
                    className="relative"
                  >
                    {link.icon}
                    <span className="relative hidden lg:block">{link.name}</span>
                  </Link>
                </SidebarLinkButton>
              );
            }

            return (
              <SidebarLinkButton
                key={link.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => handleClick(link)}
              >
                <Link
                  href={link.url(searchParams.toString())}
                  target={link.external ? "_blank" : "_self"}
                  className="relative"
                >
                  {link.icon}
                  <span className="relative hidden lg:block">{link.name}</span>
                </Link>
              </SidebarLinkButton>
            );
          }

          return (
            <SidebarLinkButton
              asChild={false}
              key={link.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => handleClick(link)}
            >
              {link.icon}
              <span className="hidden lg:block">{link.name}</span>
            </SidebarLinkButton>
          );
        })}
      </div>

      {/* LeaderBoard Modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <Dialog open={openLeaderBoard} onOpenChange={setOpenLeaderBoard}>
          <DialogContent className="h-[calc(100vh-200px)] sm:max-w-[425px] 2xl:max-w-[800px]">
            <DialogHeader className="gap-2">
              <DialogTitle className="font-tanker text-4xl tracking-wide">Leaderboard</DialogTitle>
              <Separator className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft" />
            </DialogHeader>
            {!leaderBoard.success && (
              <div className="font-tanker text-center text-4xl tracking-wide">
                Error Fetching Leaderboard
              </div>
            )}
            {leaderBoard.success && leaderBoard.data && (
              <div className="size-full overflow-y-scroll">
                <div className="h-auto min-h-screen w-full">
                  <DataTable
                    columns={leaderboardColumns}
                    data={leaderBoard.data.result.byWalletBalance}
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Suspense>
    </div>
  );
}

function SidebarLinkButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      asChild
      {...props}
      className={cn(
        "w-auto cursor-pointer justify-start gap-2 p-2 lg:w-full lg:px-0.5 xl:px-2 2xl:px-4",
        props.className
      )}
    />
  );
}
