import Link from "next/link";

import { Game, Home, Profile, Shop, Stream } from "@/components/icons";
import { Button } from "@/components/ui/button";

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
    name: "Game",
    url: "/soon",
    icon: <Game />
  },
  {
    id: 4,
    name: "Shop",
    url: "/soon",
    icon: <Shop />
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
