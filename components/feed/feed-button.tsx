import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical, Share2 } from "lucide-react";

import {
  CopyUrl,
  FacebookShareButton,
  TwitterShareButton
} from "@/app/stream/[id]/components/share";

import { Bookmark } from "@/components/icons/bookmark";
import { Comment } from "@/components/icons/comment";
import { Heart } from "@/components/icons/heart";
import { Share } from "@/components/icons/share";

import { cn } from "@/libs/utils";

import { Button } from "../ui/button";

export function FeedButton(props: React.ComponentProps<"button"> & { icon: React.ReactNode }) {
  const { icon, children, ...rest } = props;
  return (
    <button {...rest} className={cn("flex items-center gap-2", rest.className)}>
      {icon}
      <span className="text-theme-monochrome-300 text-xs">{children}</span>
    </button>
  );
}

type FeedButtonProps = Omit<React.ComponentProps<typeof FeedButton>, "icon">;

export function FeedLikeButton(props: FeedButtonProps) {
  return <FeedButton {...props} icon={<Heart className="size-5" fill="#9B9C9E" />} />;
}
export function FeedLikedButton(props: FeedButtonProps) {
  console.log("liked");
  return <FeedButton {...props} icon={<Heart className="size-5" fill="#FF0000" />} />;
}

export function FeedCommentButton(props: FeedButtonProps) {
  return <FeedButton {...props} icon={<Comment className="size-5" />} />;
}

export function FeedBookmarkButton(props: FeedButtonProps) {
  return <FeedButton {...props} icon={<Bookmark className="size-5" />} />;
}

export function FeedShareButton(props: FeedButtonProps & { tokenId: number }) {
  const { tokenId } = props;
  const url = process.env.NEXT_PUBLIC_URL + `/feeds/${tokenId}`;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="rounded-full">
          <Share2 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuLabel>Share</DropdownMenuLabel>
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

export function FeedSettingsButton(props: React.ComponentProps<"button">) {
  return (
    <button {...props}>
      <EllipsisVertical className="size-5" />
    </button>
  );
}
