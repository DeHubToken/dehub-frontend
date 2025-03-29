"use client";

import Link from "next/link";
import { feeds } from "@/data";
import { ListFilter } from "lucide-react";

import {
  FeedCard,
  FeedContent,
  FeedHeader,
  FeedImageGallary,
  FeedProfile
} from "@/components/feed";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="w-full px-6">
      <div className="flex items-center px-2 py-6">
        <h1 className="justify-start text-3xl font-normal leading-loose text-theme-neutrals-100">
          Collections
        </h1>
      </div>
      <Tabs defaultValue="saved-posts" className="w-full">
        <div className="flex w-full items-center justify-between">
          <TabsList className="justify-start">
            <TabsTrigger value="saved-posts">Saved posts</TabsTrigger>
            <TabsTrigger value="liked-posts">Liked posts</TabsTrigger>
          </TabsList>
          <Button className="gap-2 rounded-full">
            Filter
            <ListFilter className="size-3 text-zinc-400" />
          </Button>
        </div>
        <TabsContent value="saved-posts" className="mt-4">
          <SavedPosts />
        </TabsContent>
        <TabsContent value="liked-posts" className="mt-4">
          <LikedPosts />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SavedPosts() {
  const data = feeds;
  return (
    <div className="grid grid-cols-3 gap-3">
      {data.map((feed, index) => (
        <FeedCard key={index}>
          <FeedHeader>
            <FeedProfile
              name={feed?.mintername}
              avatar={feed?.minterAvatarUrl}
              time={feed?.createdAt?.toString()}
              minter={feed?.minter}
              minterStaked={feed?.minterStaked || 0}
            />
          </FeedHeader>
          <Link href={`/feeds/${feed?.tokenId}`}>
            <FeedContent name={feed.name} description={feed.description} feed={feed} />
            <FeedImageGallary images={[{ alt: "", url: "https://placehold.co/160x90" }]} />
          </Link>
        </FeedCard>
      ))}
    </div>
  );
}

function LikedPosts() {
  const data = feeds;
  return (
    <div className="grid grid-cols-3 gap-3">
      {data.map((feed, index) => (
        <FeedCard key={index}>
          <FeedHeader>
            <FeedProfile
              name={feed?.mintername}
              avatar={feed?.minterAvatarUrl}
              time={feed?.createdAt?.toString()}
              minter={feed?.minter}
              minterStaked={feed?.minterStaked || 0}
            />
          </FeedHeader>
          <Link href={`/feeds/${feed?.tokenId}`}>
            <FeedContent name={feed.name} description={feed.description} feed={feed} />
            <FeedImageGallary images={[{ alt: "", url: "https://placehold.co/160x90" }]} />
          </Link>
        </FeedCard>
      ))}
    </div>
  );
}
