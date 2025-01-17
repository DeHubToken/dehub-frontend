"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { getFeedNFTs } from "@/services/feeds";
import { getNFT } from "@/services/nfts";

import { commentImageUrl, getImageUrl, getImageUrlApiSimple } from "@/web3/utils/url";

import { LikeButton } from "../feeds/[id]/components/stream-actions";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BookmarkIcon, BugIcon } from "lucide-react";
import TipModal from "../feeds/[id]/components/tip-modal";
import { savePost } from "@/services/nfts/savePost";
import { getSignInfo } from "@/web3/utils/web3-actions";
import { toast } from "sonner";
import { PPVModal } from "../feeds/[id]/components/ppv-modal";
import { getStreamStatus } from "@/web3/utils/validators";
import { userAtom } from "@/stores";
import { useAtomValue } from "jotai";


type FeedProps = {
  title: string;
  category?: string;
  range?: string;
  type: string;
  q?: string;
};

export function FeedList(props: FeedProps) {

  const [selectedFeed, setSelectedFeed] = useState<{ open: boolean; tokenId?: number }>({ open: false });

  const { category, range, type, q } = props;
  const { account, library ,chainId} = useActiveWeb3React();
  const [feeds, setFeeds] = useState<any>([]);
  const [feed, setFeed] = useState<any>(null);
  const searchParams = useSearchParams();
 


  const handleSavePost = async (id: number) => {
    if (!account) {
      toast.error("Please connect your wallet to like this upload");
      return;
    }
    const signData = await getSignInfo(library, account);
    const data = await savePost(id, account, signData.sig, signData.timestamp)
    if (data.success) {
      //@ts-ignore
      toast.success(data.data.message);
      // Update the feed's `isSaved` status after saving
      setFeeds((prevFeeds: any) => prevFeeds.map((item: any) => item.tokenId === id ? { ...item, isSaved: !item.isSaved } : item));
    }
  }

  const hasSaved = searchParams.has('saved');
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
        if (hasSaved) {
          setFeeds((prevFeeds: any) => prevFeeds.filter((item: any) => item?.isSaved === true));
        } else {
          setFeeds(res.data?.result);
        }
      }
    })();
  }, [account, library,hasSaved]);
  const fetchFeed = async () => {
    if (!selectedFeed.tokenId) {
      return;
    }
    const response: any = await getNFT(selectedFeed?.tokenId, account as string);

    if (response.data.result) setFeed(response.data.result);
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedFeed]);
  return (

    <div className="flex w-full flex-col items-center gap-3">
      {feeds && feeds.length > 0 ? feeds.map((feed: any) => (
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
                <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                   <PPVModal nft={feed} />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BugIcon className="size-5" />&nbsp;&nbsp;Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </FeedHeader>
          <Link href={`/feeds/${feed?.tokenId}`}>
            <FeedContent name={feed.name} description={feed.description} feed={feed}/>
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
            <FeedCommentButton
              onClick={() => setSelectedFeed({ open: true, tokenId: feed.tokenId })}
            >
              {feed.comment}
            </FeedCommentButton>

            <FeedBookmarkButton
              onClick={(e) => { handleSavePost(feed.tokenId) }} >
              <BookmarkIcon className={`size-4 ${feed.isSaved ? 'fill-white' : '#8a8b8d'}`} />
            </FeedBookmarkButton>
            <FeedShareButton tokenId={feed?.tokenId} />
          </FeedFooter>
        </FeedCard>
      )) : 
      <div className="mt-5">
        No Feed Saved Yet.
      </div>
      }

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
            imageUrl:c.imageUrl,
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
          <FeedContent name={feed?.name} description={feed?.description}  feed={feed}/>
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
