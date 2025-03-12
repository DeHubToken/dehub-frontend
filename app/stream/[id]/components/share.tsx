"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Facebook, Link2, Share2, Twitter } from "lucide-react";
import { useCopyToClipboard } from "react-use";
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

import objectToGetParams from "@/libs/utils";

export function FacebookShareButton(props: { url: string }) {
  const { url } = props;
  const fb = "https://www.facebook.com/sharer/sharer.php" + objectToGetParams({ u: url });

  function onClick() {
    window.open(fb, "Facebook Share", "width=600,height=400");
  }

  return (
    <Button size="md" onClick={onClick} className="w-full justify-start gap-1 py-2">
      <Facebook className="size-4" />
      <span className="text-sm text-theme-neutrals-400">Facebook</span>
    </Button>
  );
}

export function TwitterShareButton(props: { url: string }) {
  const { url } = props;
  const twitter = "https://twitter.com/intent/tweet" + objectToGetParams({ url });

  function onClick() {
    window.open(twitter, "Facebook Share", "width=600,height=400");
  }

  return (
    <Button size="md" onClick={onClick} className="w-full justify-start gap-1 py-2">
      <Twitter className="size-4" />
      <span className="text-sm text-theme-neutrals-400">Twitter</span>
    </Button>
  );
}

export function CopyUrl(props: { url: string }) {
  const { url } = props;
  const [state, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (state.value) {
      toast.success("URL copied to clipboard");
    }

    if (state.error) {
      toast.error("Failed to copy URL to clipboard");
    }
  }, [state.error, state.value]);

  return (
    <Button
      size="md"
      className="w-full justify-start gap-1 py-2"
      onClick={() => copyToClipboard(url)}
    >
      <Link2 className="size-4" />
      <span className="text-sm text-theme-neutrals-400">Copy URL</span>
    </Button>
  );
}

export function Share() {
  const path = usePathname();

  const url = "https://dehub.io" + path;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="rounded-full">
          <Share2 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuLabel className="text-theme-neutrals-200">Share</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="flex flex-col items-start justify-start gap-1">
          <DropdownMenuItem asChild>
            <FacebookShareButton url={url} />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TwitterShareButton url={url} />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <CopyUrl url={url} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
