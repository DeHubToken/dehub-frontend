"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { MessageSquareText, Plus } from "lucide-react";

import { leaderboardColumns } from "@/app/components/leaderboard-modal";

import { Home, LeaderBoard, Profile } from "@/components/icons";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getLeaderborard } from "@/services/nfts/leaderborad";

import { DataTable } from "./data-grid/data-table";

const links: {
  id: number;
  name: string;
  url: string;
  icon: JSX.Element;
  external?: boolean;
  component?: React.ReactNode;
}[] = [
  {
    id: 1,
    name: "Home",
    url: "/",
    icon: <Home />
  },
  {
    id: 2,
    name: "Track",
    url: "/",
    icon: <LeaderBoard />
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
  const { account, library } = useActiveWeb3React();
  const [leaderBoard, setLeaderBoard] = useState<any>([]);
  const [openLeaderBoard, setOpenLeaderBoard] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 960px)");

  function handleClick(link: {
    id: number;
    name: string;
    url: string;
    icon: JSX.Element;
    external?: boolean;
  }) {
    if (link.name === "Track") setOpenLeaderBoard(true);
  }

  useEffect(() => {
    const setup = async () => {
      const leaderboardResponse = await getLeaderborard();
      setLeaderBoard(leaderboardResponse);
    };
    setup();
  }, [account, library]);

  if (!isSmallScreen) return null;

  return (
    <div className="fixed bottom-0 left-0 z-20 h-auto w-full border-t-2 bg-theme-background py-2 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
      <div className="grid w-full grid-cols-5 items-center">
        {links.map((link) => {
          if (link.name === "Track") {
            return (
              <Button
                key={link.id}
                className="h-max flex-col gap-0.5 py-1"
                variant="ghost"
                onClick={() => handleClick(link)}
              >
                <span className="scale-105">{link.icon}</span>
                <span className="text-[10px]">{link.name}</span>
              </Button>
            );
          }

          return (
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
          );
        })}
      </div>

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

export function DesktopSidebar() {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  if (isSmallScreen) return null;
  return <Sidebar className="md:max-w-[7%] md:flex-[0_0_7%] lg:max-w-[13%] lg:flex-[0_0_13%]" />;
}
