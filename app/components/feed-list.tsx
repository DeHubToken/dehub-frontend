import Image from "next/image";
import ImagePlacehoder from "@/assets/image-placeholder.png";
import { EllipsisVertical } from "lucide-react";

import { Bookmark } from "@/components/icons/bookmark";
import { Comment } from "@/components/icons/comment";
import { Heart } from "@/components/icons/heart";
import { Share } from "@/components/icons/share";

import { cn } from "@/libs/utils";

export function FeedList() {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <FeedCard key={index}>
          <FeedHeader>
            <Profile />
            <button>
              <EllipsisVertical className="size-5" />
            </button>
          </FeedHeader>
          <FeedContent />
          <FeedFooter>
            <FeedButton icon={<Heart className="size-5" />}>000</FeedButton>
            <FeedButton icon={<Comment className="size-5" />}>000</FeedButton>
            <FeedButton icon={<Bookmark className="size-5" />} />
            <FeedButton icon={<Share className="size-5" />} />
          </FeedFooter>
        </FeedCard>
      ))}
    </div>
  );
}

function FeedCard(props: React.ComponentProps<"div">) {
  const { children, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "w-full min-w-[calc((520/16)*16px)] max-w-[calc((700/16)*16px)]",
        "flex flex-col gap-5 rounded-lg border p-5 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark",
        rest.className
      )}
    >
      {children}
    </div>
  );
}

function FeedHeader(props: React.ComponentProps<"div">) {
  const { children, ...rest } = props;
  return (
    <div {...rest} className={cn("flex items-center justify-between", rest.className)}>
      {children}
    </div>
  );
}

function Profile() {
  return (
    <div className="flex gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=1856&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Avatar"
        className="size-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-[15px]">Nolan</span>
        <span className="text-theme-monochrome-300 text-[10px]">2 mins</span>
      </div>
    </div>
  );
}

function FeedContent() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-theme-monochrome-300 text-base">
        Post Description here, text will be shown here, this is just a dummy description that is
        being used here to show scale ability.{" "}
      </p>
      <Image
        src={ImagePlacehoder}
        alt="Image placeholder"
        className="size-full max-w-full object-cover"
      />
    </div>
  );
}

function FeedFooter(props: React.ComponentProps<"div">) {
  const { children, ...rest } = props;
  return (
    <div {...rest} className={cn("flex items-center justify-between", rest.className)}>
      {children}
    </div>
  );
}

function FeedButton(props: React.ComponentProps<"button"> & { icon: React.ReactNode }) {
  const { icon, children, ...rest } = props;
  return (
    <button {...rest} className={cn("flex items-center gap-2", rest.className)}>
      {icon}
      <span className="text-theme-monochrome-300 text-xs">{children}</span>
    </button>
  );
}
