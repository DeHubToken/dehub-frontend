"use client";

import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";

import {
  FeedBookmarkButton,
  FeedCard,
  FeedCommentButton,
  FeedContent,
  FeedFooter,
  FeedHeader,
  FeedImageGallary,
  FeedLikeButton,
  FeedProfile,
  FeedReplyDialog,
  FeedSettingsButton,
  FeedShareButton
} from "@/components/feed";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getFeedNFTs } from "@/services/feeds";

import { getImageUrlApi, getImageUrlApiSimple } from "@/web3/utils/url";

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
  const [selectedFeed, setSelectedFeed] = useState<{ open: boolean; tokenId: string }>({
    open: false,
    tokenId: ""
  }); 

  const { category, range, type, q } = props;
  const { account, library } = useActiveWeb3React();
  const [feeds, setFeeds] = useState([]);
  const [feed,setFeed]=useState<any>(null);


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


  useEffect(()=>{

  },[selectedFeed])
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
            <FeedSettingsButton />
          </FeedHeader>
          <FeedContent name={feed.name} description={feed.description} />
          <FeedImageGallary
            images={feed.imageUrls.map((i: any) => ({
              url: getImageUrlApiSimple(i),
              alt: feed.name
            }))}
          />
          <FeedFooter>
            <FeedLikeButton>{feed.like}</FeedLikeButton>
            <FeedCommentButton onClick={() => setSelectedFeed({ open: true, tokenId: feed.tokenId })}>
              {feed.comment}
            </FeedCommentButton>
            <FeedBookmarkButton />
            <FeedShareButton />
          </FeedFooter>
        </FeedCard>
      ))}

      <FeedReplyDialog
        open={selectedFeed.open}
        onOpenChange={(open) => setSelectedFeed({ open: false, tokenId: "" })}
        comments={[]}
        // comments={
        //   feed?.comments.map((c:any) => ({
        //     id: c.id, 
        //     time:new Date(c.createdAt).toString(),
        //     name: c.name,
        //     content: c.content,
        //     avatar: c.avatar
        //   })) || []
        // }
      >
        <FeedCard>
          <FeedHeader>
            <FeedProfile
              name={feed?.mintername || ""}
              avatar={feed?.avatar || ""}
              time={feed?.createdAt.toLocaleDateString() || ""}
            />
            <FeedSettingsButton />
          </FeedHeader>
          <FeedContent name={feed?.name} description={feed?.description}/>
          <FeedImageGallary images={feed?.imageUrls.map((i:string) => ({ url: i, alt: feed?.url })) || []} />
          <FeedFooter>
            <FeedLikeButton>{feed?.like || 0}</FeedLikeButton>
            <FeedCommentButton>{feed?.comment || 0}</FeedCommentButton>
            <FeedBookmarkButton />
            <FeedShareButton />
          </FeedFooter>
        </FeedCard>
      </FeedReplyDialog>
    </div>
  );
}
