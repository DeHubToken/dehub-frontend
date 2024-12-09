"use client";

import type { User } from "@/stores";

import Link from "next/link";
import { Facebook, Instagram, Link2, Share2, Twitter, Youtube } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { getSocialLink } from "@/web3/utils/format";

type Props = {
  user: User;
};

export function SocialLinks(props: Props) {
  const { user } = props;
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://dehub.io/profile/${user?.username}`);
    toast.success("Copied URL");
  };

  const handleShare = (platform: string) => {
    let shareUrl = "";

    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}`;
    } else if (platform === "copy") {
      copyUrl();
      return;
    }

    window.open(shareUrl, "_blank");
  };

  return (
    <div className="flex h-auto w-full items-center justify-end py-6 sm:px-4">
      {user?.facebookLink && (
        <Link href={getSocialLink(user.facebookLink, "facebook.com")}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Facebook className="size-4" />
          </Button>
        </Link>
      )}

      {user?.instagramLink && (
        <Link href={getSocialLink(user.instagramLink, "instagram.com")}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Instagram className="size-4" />
          </Button>{" "}
        </Link>
      )}

      {user?.twitterLink && (
        <Link href={getSocialLink(user.twitterLink, "twitter.com")}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Twitter className="size-4" />
          </Button>{" "}
        </Link>
      )}

      {user?.youtubeLink && (
        <Link href={getSocialLink(user.youtubeLink, "youtube.com")}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Youtube className="size-4" />
          </Button>{" "}
        </Link>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Share2 className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-32">
          <DropdownMenuLabel>Share</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="flex flex-col items-start justify-start gap-1">
            <DropdownMenuItem asChild>
              <Button
                size="md"
                className="w-full justify-start py-2"
                onClick={() => handleShare("facebook")}
              >
                <Facebook className="size-4" /> Facebook
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                size="md"
                className="w-full justify-start gap-1 py-2"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="size-4" /> Twitter
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                size="md"
                className="w-full justify-start gap-1 py-2"
                onClick={() => handleShare("copy")}
              >
                <Link2 className="size-4" /> Url
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
