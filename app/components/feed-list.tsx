"use client";

import { useState } from "react";
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

export function FeedList() {
  const [selectedFeed, setSelectedFeed] = useState<{ open: boolean; id: string }>({
    open: false,
    id: ""
  });
  const feed = fakeData.find((data) => data.id === selectedFeed.id);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {fakeData.map((data) => (
        <FeedCard key={data.id}>
          <FeedHeader>
            <FeedProfile
              name={data.name}
              avatar={data.avatar}
              time={data.createdAt.toLocaleDateString()}
            />
            <FeedSettingsButton />
          </FeedHeader>
          <FeedContent />
          <FeedImageGallary images={data.images.map((i) => ({ url: i, alt: data.name }))} />
          <FeedFooter>
            <FeedLikeButton>{data.like}</FeedLikeButton>
            <FeedCommentButton onClick={() => setSelectedFeed({ open: true, id: data.id })}>
              {data.comment}
            </FeedCommentButton>
            <FeedBookmarkButton />
            <FeedShareButton />
          </FeedFooter>
        </FeedCard>
      ))}

      <FeedReplyDialog
        open={selectedFeed.open}
        onOpenChange={(open) => setSelectedFeed({ open: false, id: "" })}
        comments={
          feed?.comments.map((c) => ({
            id: c.id,
            time: c.createdAt.toLocaleDateString(),
            name: c.name,
            content: c.content,
            avatar: c.avatar
          })) || []
        }
      >
        <FeedCard>
          <FeedHeader>
            <FeedProfile
              name={feed?.name || ""}
              avatar={feed?.avatar || ""}
              time={feed?.createdAt.toLocaleDateString() || ""}
            />
            <FeedSettingsButton />
          </FeedHeader>
          <FeedContent />
          <FeedImageGallary images={feed?.images.map((i) => ({ url: i, alt: feed?.name })) || []} />
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
