import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { Home, Plus, Profile, Stream } from "@/components/icons";
import { Button } from "@/components/ui/button";

import type { JSX } from "react";

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
    icon: <Plus />
  },
  {
    id: 4,
    name: "Messages",
    url: "/messages",
    icon: <MessageSquareText />
  },
  {
    id: 5,
    name: "Profile",
    url: "/me",
    icon: <Profile />
  }
];

export function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 z-10 h-auto w-full border-t-2 py-2">
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
