"use client";

import Link from "next/link";

import { Game, Home, Shop, Stream } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";

import type { JSX } from "react";

/* ----------------------------------------------------------------------------------------------- */

type Link = {
  id: number;
  name: string;
  url: string;
  icon: JSX.Element;
  external?: boolean;
};

const links: Link[] = [
  {
    id: 1,
    name: "Home",
    url: "https://home.dehub.com",
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
  }
];

export function NavLinks() {
  const isSmallScreen = useMediaQuery("(max-width: 960px)");
  if (isSmallScreen) return null;
  return links.map((link) => (
    <Button asChild variant="ghost" key={link.id} className="gap-1">
      <Link href={link.url} target={link.external ? "_blank" : "_self"}>
        {link.icon}
        {link.name}
      </Link>
    </Button>
  ));
}
