/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// import { MessageSquareText, Newspaper } from "lucide-react";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
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
        "w-full cursor-pointer justify-center gap-2 p-2 text-base lg:justify-start lg:px-0.5 xl:px-2 2xl:px-4",
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
        icon: <Home />,
        url: () => "/"
      },
      {
        id: "scroll",
        name: "Scroll",
        icon: <Scroll />,
        url: () => "/"
      },
      {
        id: "feed",
        name: "Feed",
        icon: <Feed />,
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
        icon: <Subs />,
        url: () => "/"
      },
      {
        id: "followed",
        name: "Followed",
        icon: <Followed />,
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
        icon: <PPV />,
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
        icon: <W2E />,
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
        icon: <Exclusive />,
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
        icon: <Upload />,
        url: () => "/upload"
      },
      {
        id: "broadcast",
        name: "Broadcast",
        icon: <Broadcast />,
        url: () => "/"
      },
      {
        id: "post",
        name: "Post",
        icon: <Post />,
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
        icon: <Profile />,
        url: () => "/me"
      },
      {
        id: "notifications",
        name: "Notifications",
        icon: <Notification />,
        component: <NotificationModal />
      },
      {
        id: "wallet",
        name: "Wallet",
        icon: <Wallet />,
        url: () => "/"
      },
      {
        id: "my-uploads",
        name: "My Uploads",
        icon: <MyUploads />,
        url: () => "/"
      },
      {
        id: "my-playlists",
        name: "My Playlists",
        icon: <Playlist />,
        url: () => "/"
      },
      {
        id: "liked",
        name: "Liked",
        icon: <Liked />,
        url: () => "/"
      },
      {
        id: "marked",
        name: "Marked",
        icon: <Marked />,
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
        icon: <XA />,
        url: () => "/staking"
      },
      {
        id: "leaderboard",
        name: "Track",
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
        "bg-theme-monochrome-700 sticky left-0 top-0 h-screen w-full overflow-hidden overflow-y-scroll py-20",
        props.className
      )}
    >
      <Accordion
        type="multiple"
        className="w-full"
        defaultValue={["Explore", "Me", "Tools", "Create", "Watch"]}
      >
        {groups.map((group) => (
          <AccordionItem value={group.label} key={group.label} className="px-4 lg:px-6 lg:pt-0">
            <AccordionTrigger className="hidden lg:flex">{group.label}</AccordionTrigger>
            <AccordionContent>
              {group.links.map((link) => {
                const isActive = type?.toLowerCase() === link.id.toLowerCase();

                if (link.component) return link.component;

                if (link.url) {
                  // profile
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
                        key={link.id}
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Suspense fallback={<div>Loading...</div>}>
        <Dialog open={openLeaderBoard} onOpenChange={setOpenLeaderBoard}>
          <DialogContent className="h-[calc(100vh-200px)] sm:max-w-[425px] 2xl:max-w-[800px]">
            <DialogHeader className="gap-2">
              <DialogTitle className="font-tanker text-4xl tracking-wide">Leaderboard</DialogTitle>
              <Separator className="bg-theme-monochrome-400/25" />
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
