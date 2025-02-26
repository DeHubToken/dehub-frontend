"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Book, MessageCircle } from "lucide-react";

import { leaderboardColumns } from "@/app/components/leaderboard-modal";

import { DataTable } from "@/components/data-grid/data-table";
import {
  Contact,
  Documents,
  Exclusive,
  Home,
  LeaderBoard,
  PPV,
  Profile,
  Upload,
  Wallet
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { getLeaderborard } from "@/services/nfts/leaderborad";

import {
  Broadcast,
  Feed,
  Followed,
  Liked,
  Marked,
  MyUploads,
  Notification,
  Playlist,
  Post,
  Scroll,
  Subs,
  W2E,
  XA
} from "./_icons";
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

function SidebarLinkButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      asChild
      {...props}
      className={cn(
        "w-full cursor-pointer justify-center gap-2 px-8 py-6 text-base hover:bg-transparent dark:hover:bg-transparent lg:justify-start",
        props.className
      )}
    />
  );
}

const groups = [
  {
    label: "Explore",
    links: [
      {
        id: "home",
        name: "Home",
        icon: <Home className="size-6" />,
        url: () => "/"
      },
      {
        id: "scroll",
        name: "Scroll",
        icon: <Scroll className="size-6" />,
        url: () => "/"
      },
      {
        id: "feed",
        name: "Feed",
        icon: <Feed className="size-6" />,
        url: () => {
          const query = new URLSearchParams();
          query.set("type", "feed");
          query.delete("q");
          const qs = query.toString();
          return `/?${qs}`;
        }
      },
      {
        id: "subs",
        name: "Subs",
        icon: <Subs className="size-6" />,
        url: () => "/"
      },
      {
        id: "followed",
        name: "Followed",
        icon: <Followed className="size-6" />,
        url: () => "/"
      }
    ] as Link[]
  },
  {
    label: "Watch",
    links: [
      {
        id: "ppv",
        name: "PPV",
        icon: <PPV className="size-6" />,
        url: () => {
          const query = new URLSearchParams();
          query.set("type", "ppv");
          query.delete("q");
          const qs = query.toString();
          return `/?${qs}`;
        }
      },
      {
        id: "w2e",
        name: "W2E",
        icon: <W2E className="size-6" />,
        url: () => {
          const query = new URLSearchParams();
          query.set("type", "bounty");
          query.delete("q");
          const qs = query.toString();
          return `/?${qs}`;
        }
      },
      {
        id: "exclusive",
        name: "Exclusive",
        icon: <Exclusive className="size-6" />,
        url: () => {
          const query = new URLSearchParams();
          query.set("type", "locked");
          query.delete("q");
          const qs = query.toString();
          return `/?${qs}`;
        }
      }
    ] as Link[]
  },
  {
    label: "Create",
    links: [
      {
        id: "upload",
        name: "Upload",
        icon: <Upload className="size-6" />,
        url: () => "/upload"
      },
      {
        id: "broadcast",
        name: "Broadcast",
        icon: <Broadcast className="size-6" />,
        url: () => "/"
      },
      {
        id: "post",
        name: "Post",
        icon: <Post className="size-6" />,
        url: () => "/"
      }
    ] as Link[]
  },
  {
    label: "Me",
    links: [
      {
        id: "profile",
        name: "Profile",
        icon: <Profile className="size-6" />,
        url: () => "/me"
      },
      {
        id: "notifications",
        name: "Notifications",
        icon: <Notification className="size-6" />,
        component: (
          <NotificationModal className="w-full cursor-pointer justify-center gap-2 hover:bg-theme-neutrals-900 dark:hover:bg-theme-neutrals-900" />
        )
      },
      {
        id: "messages",
        name: "Messages",
        icon: <MessageCircle className="size-6" />,
        url: () => "/messages"
      },
      {
        id: "plans",
        name: "Plans",
        icon: <Book className="size-6" />,
        url: () => "/plans"
      },
      {
        id: "wallet",
        name: "Wallet",
        icon: <Wallet className="size-6" />,
        url: () => "/"
      },
      {
        id: "my-uploads",
        name: "My Uploads",
        icon: <MyUploads className="size-6" />,
        url: () => "/"
      },
      {
        id: "my-saved",
        name: "Saved Feeds",
        icon: <MyUploads className="size-6" />,
        url: () => "?type=feed&saved"
      },
      {
        id: "my-playlists",
        name: "My Playlists",
        icon: <Playlist className="size-6" />,
        url: () => "/"
      },
      {
        id: "liked",
        name: "Liked",
        icon: <Liked className="size-6" />,
        url: () => "/"
      },
      {
        id: "marked",
        name: "Marked",
        icon: <Marked className="size-6" />,
        url: () => "/"
      }
    ] as Link[]
  },
  {
    label: "Tools",
    links: [
      {
        id: "xa",
        name: "XA",
        icon: <XA className="size-6" />,
        url: () => "/staking"
      },
      {
        id: "leaderboard",
        name: "Track",
        icon: <LeaderBoard className="size-6" />
      },
      {
        id: "documents",
        name: "Documents",
        icon: <Documents className="size-6" />,
        url: () => "https://dehub.gitbook.io",
        external: true
      },
      {
        id: "contact",
        name: "Contact",
        icon: <Contact className="size-6" />,
        url: () => "https://t.me/dehub",
        external: true
      }
    ] as Link[]
  }
];

export function Sidebar(props: Props) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { account, library } = useActiveWeb3React();
  const [leaderBoard, setLeaderBoard] = useState<any>([]);
  const [openLeaderBoard, setOpenLeaderBoard] = useState(false);

  function handleClick(link: Link) {
    if (link.name === "Track") setOpenLeaderBoard(true);
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
        "sticky left-0 top-[calc(var(--navbar-height)+24px)] h-screen w-full overflow-hidden overflow-y-scroll",
        "min-w-[calc((88/16)*1rem)] max-w-[calc((88/16)*1rem)]",
        "flex flex-col",
        props.className
      )}
    >
      {groups.map((group, index) => (
        <div key={group.label} className={cn(index !== 0 ? "py-5" : "")}>
          {group.links.map((link) => {
            const isActive = type?.toLowerCase() === link.id.toLowerCase();

            if (link.component) return link.component;

            if (link.url) {
              if (link.id === "profile" || link.id === "messages") {
                if (!account) return null;
                return (
                  <SidebarLinkButton
                    key={link.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => handleClick(link)}
                  >
                    <Link
                      key={link.id}
                      href={link.url(searchParams.toString())}
                      target={link.external ? "_blank" : "_self"}
                      className="relative"
                    >
                      {link.icon}
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
                    key={link.id}
                    href={link.url(searchParams.toString())}
                    target={link.external ? "_blank" : "_self"}
                    className="relative"
                  >
                    {link.icon}
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
                className="relative"
              >
                {link.icon}
              </SidebarLinkButton>
            );
          })}
        </div>
      ))}
      <Suspense fallback={<div>Loading...</div>}>
        <Dialog open={openLeaderBoard} onOpenChange={setOpenLeaderBoard}>
          <DialogContent className="h-[calc(100vh-200px)] sm:max-w-[425px] 2xl:max-w-[800px]">
            <DialogHeader className="gap-2">
              <DialogTitle className="font-tanker text-4xl tracking-wide">Leaderboard</DialogTitle>
              <Separator className="bg-theme-monochrome-400/25" />
            </DialogHeader>
            {!leaderBoard.success && (
              <div className="text-center font-tanker text-4xl tracking-wide">
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
