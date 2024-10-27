import { EllipsisVertical } from "lucide-react";

import { Bookmark } from "@/components/icons/bookmark";
import { Comment } from "@/components/icons/comment";
import { Heart } from "@/components/icons/heart";
import { Share } from "@/components/icons/share";

import { cn } from "@/libs/utils";

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
  return <FeedButton {...props} icon={<Heart className="size-5" />} />;
}

export function FeedCommentButton(props: FeedButtonProps) {
  return <FeedButton {...props} icon={<Comment className="size-5" />} />;
}

export function FeedBookmarkButton(props: FeedButtonProps) {
  return <FeedButton {...props} icon={<Bookmark className="size-5" />} />;
}

export function FeedShareButton(props: FeedButtonProps) {
  return <FeedButton {...props} icon={<Share className="size-5" />} />;
}

export function FeedSettingsButton(props: React.ComponentProps<"button">) {
  return (
    <button {...props}>
      <EllipsisVertical className="size-5" />
    </button>
  );
}
