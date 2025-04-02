"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { useAtomValue } from "jotai";
import { BookmarkIcon } from "lucide-react";
import { toast } from "sonner";

import {
  FeedBookmarkButton,
  FeedCard,
  FeedCommentButton,
  FeedContent,
  FeedFooter,
  FeedHeader,
  FeedImageGallary,
  FeedProfile,
  FeedReplyDialog,
  FeedReportCountButton,
  FeedSettingsButton,
  FeedShareButton
} from "@/components/feed";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getFeedNFTs } from "@/services/feeds";
import { getNFT, NFT } from "@/services/nfts";
import { savePost } from "@/services/nfts/savePost";

import { getImageUrlApiSimple } from "@/web3/utils/url";
import { getStreamStatus } from "@/web3/utils/validators";
import { getSignInfo } from "@/web3/utils/web3-actions";

import { userAtom } from "@/stores";

import { SubscriptionModal } from "../(user)/[username]/components/subscription-modal";
import { PPVModal } from "../feeds/[id]/components/ppv-modal";
import { LikeButton } from "../feeds/[id]/components/stream-actions";
import TipModal from "../feeds/[id]/components/tip-modal";
import { ClaimAsCommentor, ClaimAsViewer } from "../stream/[id]/components/claims";
import { useClaimBounty } from "../stream/[id]/hooks/use-claim-bounty";
import { FeedReportDialog } from "./feed-report-modal";
import { ReportListModal } from "./report-list-modal";

type FeedProps = {
  title?: string;
  category?: string;
  range?: string;
  type?: string;
  q?: string;
  minter?: string;
  postType?: string;
};

const tabs = [
  { name: "For you", value: "for-you" },
  { name: "Subscribed", value: "subscribed" },
  { name: "Followed", value: "followed" },
  { name: "Liked", value: "liked" },
  { name: "Saved", value: "saved" }
];

export function FeedList(props: FeedProps) {
  const [selectedFeed, setSelectedFeed] = useState<{ open: boolean; tokenId?: number }>({
    open: false
  });

  const { category, range, type, q, minter, postType } = props;
  const [feeds, setFeeds] = useState<any>([]);
  const [feed, setFeed] = useState<any>(null);
  const searchParams = useSearchParams();
  const [signData, setSignData] = useState<{ sig: string; timestamp: string }>({
    timestamp: "",
    sig: ""
  });
  const { account, library, chainId }: any = useActiveWeb3React();
  useEffect(() => {
    const storedAccount = sessionStorage.getItem("storedAccount");
    // If no stored account, this is the first time, so just store the account and do nothing else
    if (!storedAccount && account) {
      sessionStorage.setItem("storedAccount", account);
    } else if (account && account !== storedAccount) {
      sessionStorage.setItem("storedAccount", account);
      window.location.reload();
      return;
    }
    if (storedAccount !== account || !signData?.sig || !signData?.timestamp) {
      syncSigData(setSignData, account, library);
    }
  }, [account]);

  const handleSavePost = async (id: number) => {
    if (!account) {
      toast.error("Please connect your wallet to like this upload");
      return;
    }
    const signData = await getSignInfo(library, account);
    const data = await savePost(id, account, signData?.sig, signData?.timestamp);
    if (data.success) {
      //@ts-ignore
      toast.success(data.data.message);
      // Update the feed's `isSaved` status after saving
      setFeeds((prevFeeds: any) =>
        prevFeeds.map((item: any) =>
          item.tokenId === id ? { ...item, isSaved: !item.isSaved } : item
        )
      );

      if (feed) {
        setFeed({ ...feed, isSaved: !feed.isSaved });
      }
    }
  };

  const hasSaved = searchParams.has("saved");
  useEffect(() => {
    (async () => {
      const res: any = await getFeedNFTs({
        sortMode: type,
        unit: q ? 50 : 20,
        category: category === "All" ? null : category,
        range,
        search: q,
        address: account,
        minter: minter ?? "",
        postType: postType ?? "feed-all"
      });
      if (res.success) {
        if (hasSaved) {
          setFeeds((prevFeeds: any) => prevFeeds.filter((item: any) => item?.isSaved === true));
        } else {
          setFeeds(res.data?.result);
        }
      }
    })();
  }, [account, library, hasSaved]);
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
    <div className="flex w-full justify-between">
      <div className="flex-[0_0_250px]" />
      <div className="mx-auto min-w-[calc((600/16)*1rem)] max-w-[calc((600/16)*1rem)]">
        <Tabs defaultValue="for-you" className="w-full">
          <div className="mb-6 flex w-full items-center justify-between">
            <TabsList className="w-fit">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button className="rounded-full">Most Viewed</Button>
          </div>

          <TabsContent value="for-you">
            <div className="flex w-full flex-col items-center gap-3">
              {feeds && feeds.length > 0 ? (
                feeds.map((feed: any, key: number) => {
                  return (
                    <FeedCard key={key}>
                      <FeedHeader>
                        <FeedProfile
                          name={feed.mintername}
                          avatar={feed?.minterAvatarUrl}
                          time={(feed?.createdAt).toString()}
                          minter={feed?.minter}
                          minterStaked={feed?.minterStaked}
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
                          images={feed.imageUrls.map((i: any) => ({
                            url: `${getImageUrlApiSimple(i)}?address=${account ?? ""}&sig=${signData?.sig ?? ""}&timestamp=${signData?.timestamp ?? ""}`,
                            alt: feed.name
                          }))}
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
                        <FeedCommentButton
                          onClick={() => setSelectedFeed({ open: true, tokenId: feed.tokenId })}
                        >
                          {feed.comment || 0}
                        </FeedCommentButton>

                        <FeedBookmarkButton
                          onClick={(e) => {
                            handleSavePost(feed.tokenId);
                          }}
                        >
                          <BookmarkIcon
                            className={`size-4 ${feed.isSaved ? "fill-white" : "#8a8b8d"}`}
                          />
                        </FeedBookmarkButton>
                        {feed?.reportCount > 0 && (
                          <FeedReportCountButton count={feed?.reportCount ?? 0}>
                            <ReportListModal tokenId={feed?.tokenId ?? null} />
                          </FeedReportCountButton>
                        )}
                        <FeedShareButton tokenId={feed?.tokenId} />
                      </FeedFooter>
                    </FeedCard>
                  );
                })
              ) : (
                <div className="mt-5">No Feed Saved Yet.</div>
              )}

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
                    imageUrl: c.imageUrl,
                    avatar: c.avatar
                  })) || []
                }
              >
                <FeedCard className=" max-h-[80vh]">
                  <FeedHeader>
                    <FeedProfile
                      name={feed?.mintername || ""}
                      avatar={feed?.minterAvatarUrl || ""}
                      time={feed?.createdAt?.toString()}
                      minter={feed?.minter}
                      minterStaked={feed?.minterStaked}
                    />
                    <FeedSettingsButton />
                  </FeedHeader>

                  <FeedContent name={feed?.name} description={feed?.description} feed={feed} />
                  <FeedImageGallary
                    images={
                      feed?.imageUrls.map((i: string) => ({
                        url: `${getImageUrlApiSimple(i)}?address=${account ?? ""}&sig=${signData?.sig ?? ""}&timestamp=${signData?.timestamp ?? ""}`,
                        alt: feed?.url
                      })) || []
                    }
                  />
                  <FeedFooter>
                    <LikeButton
                      className="gap-1 rounded-full bg-black/5 text-[11px] dark:bg-theme-mine-shaft"
                      vote
                      tokenId={feed?.tokenId}
                      votes={feed?.totalVotes?.for || 0}
                      size="sm"
                    >
                      <HeartFilledIcon className="size-3 fill-red-400" />
                    </LikeButton>
                    <FeedCommentButton>{feed?.comment || 0}</FeedCommentButton>
                    <FeedBookmarkButton>
                      <BookmarkIcon
                        onClick={(e) => {
                          handleSavePost(feed.tokenId);
                        }}
                        className={`size-4 ${feed?.isSaved ? "fill-white" : "#8a8b8d"}`}
                      />
                    </FeedBookmarkButton>
                    <FeedShareButton tokenId={feed?.tokenId} />
                  </FeedFooter>
                </FeedCard>
              </FeedReplyDialog>
            </div>
          </TabsContent>
          <TabsContent value="subscribed">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const syncSigData = async (setSignData: any, account: `0x${string}`, library: string) => {
  if (!account) {
    setSignData({ sig: "", timestamp: "" });
    return;
  }
  const result = await getSignInfo(library, account);
  console.log("signData result", result);
  if (result && result.sig && result.timestamp) {
    console.log("signData seting sig data");
    setSignData({ sig: result.sig, timestamp: result.timestamp });
  } else {
    setSignData({ sig: "", timestamp: "" });
  }
};

export const FeedItem = ({ feed }: any) => {
  const { account, library, chainId }: any = useActiveWeb3React();
  const [signData, setSignData] = useState<{ sig: string; timestamp: string }>({
    timestamp: "",
    sig: ""
  });
  useEffect(() => {
    syncSigData(setSignData, account, library);
  }, [account]);

  return (
    <FeedCard>
      <FeedHeader>
        <FeedProfile
          name={feed?.mintername}
          avatar={feed?.minterAvatarUrl}
          time={feed?.createdAt?.toString()}
          minter={feed?.minter}
          minterStaked={feed?.minterStaked}
        />
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
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
        </DropdownMenu> */}
      </FeedHeader>
      <Link href={`/feeds/${feed?.tokenId}`}>
        <FeedContent name={feed?.name} description={feed?.description} feed={feed} />
        <FeedImageGallary
          images={
            feed?.imageUrls?.map((i: any) => ({
              url: `${getImageUrlApiSimple(i)}?address=${account ?? ""}&sig=${signData?.sig ?? ""}&timestamp=${signData?.timestamp ?? ""}`,
              alt: feed.name
            })) ?? []
          }
        />
      </Link>
      <FeedFooter>
        <LikeButton
          className="gap-1 rounded-full bg-black/5 text-[11px] dark:bg-theme-mine-shaft"
          vote
          tokenId={feed?.tokenId}
          votes={feed?.totalVotes?.for || 0}
          size="sm"
        >
          <HeartFilledIcon className="size-3 fill-red-400" />
        </LikeButton>
        <FeedShareButton tokenId={feed?.tokenId} />
      </FeedFooter>
    </FeedCard>
  );
};

export const ClaimAsCommentorDropdownItem = ({ post }: { post: NFT }) => {
  const { claim } = useClaimBounty(post, post.tokenId, 1);
  if (!claim) return null;
  if (claim && !claim?.commentor) return null;
  return (
    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
      <ClaimAsCommentor nft={post} tokenId={post.tokenId} />
    </DropdownMenuItem>
  );
};

export const ClaimAsViewerDropdownItem = ({ post }: { post: NFT }) => {
  const { claim } = useClaimBounty(post, post.tokenId, 0);

  if (!claim) return null;
  if (claim && !claim.viewer) return null;

  return (
    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
      <ClaimAsViewer nft={post} tokenId={post.tokenId} />
    </DropdownMenuItem>
  );
};
export const WithPPVDropdownItem = ({ post }: { post: NFT }) => {
  const user = useAtomValue(userAtom);
  const { chainId } = useActiveWeb3React();
  const streamStatus = getStreamStatus(post, user, chainId);
  if (!streamStatus?.streamStatus?.isLockedWithPPV) {
    return null;
  }
  return (
    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
      <PPVModal nft={post} />
    </DropdownMenuItem>
  );
};

export const DropDownItemTip = ({ post }: { post: NFT }) => {
  return (
    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
      <TipModal tokenId={post.tokenId} to={post?.minter} />
    </DropdownMenuItem>
  );
};
export const DropDownItemReport = ({ post }: { post: NFT }) => {
  return (
    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
      <FeedReportDialog post={post} />
    </DropdownMenuItem>
  );
};

export const DropDownItemSubscriptionModal = ({ post }: { post: NFT }) => {
  return (
    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
      <SubscriptionModal
        plans={post?.plansDetails}
        avatarImageUrl={post?.minterAvatarUrl}
        aboutMe={post?.minterAboutMe}
        displayName={post.mintername || post.minter}
      />
    </DropdownMenuItem>
  );
};
