"use client";

import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { HeartFilledIcon } from "@radix-ui/react-icons";

import {
  FeedBookmarkButton,
  FeedCard,
  FeedCommentButton,
  FeedContent,
  FeedFooter,
  FeedHeader,
  FeedImageGallary,
  FeedLikeButton,
  FeedLikedButton,
  FeedProfile,
  FeedReplyDialog,
  FeedSettingsButton,
  FeedShareButton
} from "@/components/feed";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getFeedNFTs } from "@/services/feeds";
import { getNFT } from "@/services/nfts";

import { getImageUrlApiSimple } from "@/web3/utils/url";

import { LikeButton } from "../feeds/[id]/components/stream-actions";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BugIcon } from "lucide-react";
import TipModal from "../feeds/[id]/components/tip-modal";
import { savePost } from "@/services/nfts/savePost";
import { getSignInfo } from "@/web3/utils/web3-actions";
import { toast } from "sonner";

const fakeData = Array.from({ length: 5 }).map((_, index) => ({
  id: faker.string.uuid() + index,
  name: faker.internet.userName(),
  avatar: faker.image.avatar(),
  content: faker.lorem.sentence(),
  images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }).map(() =>
    faker.image.urlPicsumPhotos()
  ),
  like: faker.number.int({ min: 0, max: 100 }),
  comment: faker.number.int({ min: 0, max: 100 }),
  share: faker.number.int({ min: 0, max: 100 }),
  bookmark: faker.number.int({ min: 0, max: 100 }),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  comments: Array.from({ length: 5 }).map((_, index) => ({
    id: faker.string.uuid() + index,
    name: faker.internet.userName(),
    avatar: faker.image.avatar(),
    content: faker.lorem.sentence(),
    like: faker.number.int({ min: 0, max: 100 }),
    comment: faker.number.int({ min: 0, max: 100 }),
    share: faker.number.int({ min: 0, max: 100 }),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent()
  }))
}));
type FeedProps = {
  title: string;
  category?: string;
  range?: string;
  type: string;
  q?: string;
};

export function FeedList(props: FeedProps) {
  const [selectedFeed, setSelectedFeed] = useState<{ open: boolean; tokenId?: number }>({
    open: false
  });

  const { category, range, type, q } = props;
  const { account, library } = useActiveWeb3React();
  const [feeds, setFeeds] = useState([]);
  const [feed, setFeed] = useState<any>(null);

  const handleSavePost = async (id: number) => {
    if (!account) {
      toast.error("Please connect your wallet to like this upload");
      return;
    }
    const signData = await getSignInfo(library, account);
    const data = await savePost(id, account, signData.sig, signData.timestamp)
    if (data.success) {
      //@ts-ignore
      toast.success(data.data.message)
    }

  }

  useEffect(() => {
    (async () => {
      const res: any = await getFeedNFTs({
        sortMode: type,
        unit: q ? 50 : 20,
        category: category === "All" ? null : category,
        range,
        search: q,
        address: account,
        postType: "feed"
      });
      if (res.success) {
        setFeeds(res.data?.result);
      }
    })();
  }, [account, library]);
  const fetchFeed = async () => {
    if (!selectedFeed.tokenId) {
      return;
    }
    const response: any = await getNFT(selectedFeed?.tokenId, account as string);
    console.log("response", response);
    if (response.data.result) setFeed(response.data.result);
  };
  useEffect(() => {
    fetchFeed();
  }, [selectedFeed]);
  return (
  
      <div className="flex w-full flex-col items-center gap-3">
        {feeds.map((feed: any) => (
          <FeedCard key={feed.id}>
            <FeedHeader>
              <FeedProfile
                name={feed.mintername}
                avatar={feed.avatar}
                time={new Date(feed.createdAt).toString()}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <FeedSettingsButton />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                    <TipModal tokenId={feed.tokenId} to={feed.minter} />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BugIcon className="size-5" />&nbsp;&nbsp;Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </FeedHeader>
            <Link href={`/feeds/${feed?.tokenId}`}>
            <FeedContent name={feed.name} description={feed.description} />
            <FeedImageGallary
              images={feed.imageUrls.map((i: any) => ({
                url: getImageUrlApiSimple(i),
                alt: feed.name
              }))}
            />
             </Link>
            <FeedFooter>
              <LikeButton
                className="gap-1 rounded-full bg-black/5 text-[11px] dark:bg-theme-mine-shaft"
                vote
                tokenId={feed?.tokenId}
                votes={feed.totalVotes?.for || 0}
                size="sm"
              >
                <HeartFilledIcon className="size-3 fill-red-400" />
              </LikeButton>
              {/* <LikeButton vote= tokenId={feed.tokenId} votes={}/> */}
              <FeedCommentButton
                onClick={() => setSelectedFeed({ open: true, tokenId: feed.tokenId })}
              >
                {feed.comment}
              </FeedCommentButton>
              <FeedBookmarkButton onClick={(e) => {
                // e.stopPropagation()
                handleSavePost(feed.tokenId)
              }} />
              <FeedShareButton tokenId={feed?.tokenId} />
            </FeedFooter>
          </FeedCard>
        ))}

        <FeedReplyDialog
          open={selectedFeed.open}
          onOpenChange={(open) => setSelectedFeed({ open: false })}
          tokenId={feed?.tokenId}
          fetchFeed={fetchFeed}
          comments={
            feed?.comments.map((c: any) => ({
              id: c.id,
              time: new Date(c.createdAt).toString(),
              name: c?.writor?.username,
              content: c.content,
              avatar: c.avatar
            })) || []
          }
        >
          <FeedCard>
            <FeedHeader>
              <FeedProfile
                name={feed?.mintername || ""}
                avatar={feed?.avatar || ""}
                time={new Date(feed?.createdAt).toString()}
              />
              <FeedSettingsButton />
            </FeedHeader>
            <FeedContent name={feed?.name} description={feed?.description} />
            <FeedImageGallary
              images={
                feed?.imageUrls.map((i: string) => ({
                  url: getImageUrlApiSimple(i),
                  alt: feed?.url
                })) || []
              }
            />
            <FeedFooter>
              <FeedLikeButton>{feed?.totalVotes?.for || 0}</FeedLikeButton>
              <FeedCommentButton>{feed?.comment || 0}</FeedCommentButton>
              <FeedBookmarkButton />
              <FeedShareButton tokenId={feed?.tokenId} />
            </FeedFooter>
          </FeedCard>
        </FeedReplyDialog>
      </div>
   
  );
}
