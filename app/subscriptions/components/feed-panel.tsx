"use client";

import Link from "next/link";
import { feeds } from "@/data";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { BookmarkIcon } from "lucide-react";

import {
  ClaimAsCommentorDropdownItem,
  ClaimAsViewerDropdownItem,
  DropDownItemReport,
  DropDownItemSubscriptionModal,
  DropDownItemTip,
  WithPPVDropdownItem
} from "@/app/components/feed-list";
import { LikeButton } from "@/app/feeds/[id]/components/stream-actions";

import {
  FeedBookmarkButton,
  FeedCard,
  FeedCommentButton,
  FeedContent,
  FeedFooter,
  FeedHeader,
  FeedImageGallary,
  FeedProfile,
  FeedSettingsButton,
  FeedShareButton
} from "@/components/feed";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function FeedsPanel() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-[600px] flex-col gap-3">
        {feeds.map((feed, index) => (
          <FeedCard key={index}>
            <FeedHeader>
              <FeedProfile
                name={feed.mintername}
                avatar={feed?.minterAvatarUrl}
                time={(feed?.createdAt).toString()}
                minter={feed?.minter}
                minterStaked={feed?.minterStaked || 0}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md p-2 hover:bg-gray-700">
                    <FeedSettingsButton />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <WithPPVDropdownItem post={feed} />
                  <ClaimAsViewerDropdownItem post={feed} />
                  <ClaimAsCommentorDropdownItem post={feed} />
                  <DropDownItemTip post={feed} />
                  <DropDownItemSubscriptionModal post={feed} />
                  <DropDownItemReport post={feed} />
                </DropdownMenuContent>
              </DropdownMenu>
            </FeedHeader>
            <Link href={`/feeds/${feed?.tokenId}`}>
              <FeedContent name={feed.name} description={feed.description} feed={feed} />
              <FeedImageGallary
                images={[{ url: "https://placehold.co/160x90", alt: "placeholder" }]}
              />
            </Link>
            <FeedFooter className="text-neutral-500">
              <LikeButton
                className="gap-1 rounded-full text-sm"
                vote
                tokenId={feed?.tokenId}
                votes={feed.totalVotes?.for || 0}
                size="sm"
              >
                <HeartFilledIcon className="size-3 fill-red-400" />
              </LikeButton>
              <FeedCommentButton>{0}</FeedCommentButton>

              <FeedBookmarkButton>
                <BookmarkIcon className={`size-4 ${feed.isSaved ? "fill-white" : "#8a8b8d"}`} />
              </FeedBookmarkButton>
              <FeedShareButton tokenId={feed?.tokenId} />
            </FeedFooter>
          </FeedCard>
        ))}
      </div>
    </div>
  );
}
