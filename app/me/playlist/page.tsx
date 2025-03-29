"use client";

import Image from "next/image";
import Pl1 from "@/assets/pl-1.jpeg";
import Pl2 from "@/assets/pl-2.jpeg";
import Pl3 from "@/assets/pl-3.jpeg";
import Pl4 from "@/assets/pl-4.jpeg";
import { MoreVertical, Pin } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useScreenSize } from "@/hooks/use-screen-size";

import { cn } from "@/libs/utils";

const fakeData = [
  { id: 1, thumbnail: Pl1, title: "Liked videos", videosCount: 10, isPrivate: false },
  { id: 2, thumbnail: Pl2, title: "My favorite songs", videosCount: 20, isPrivate: true },
  { id: 3, thumbnail: Pl3, title: "Chill music", videosCount: 15, isPrivate: false },
  { id: 4, thumbnail: Pl4, title: "Workout playlist", videosCount: 25, isPrivate: true },
  { id: 5, thumbnail: Pl1, title: "Liked videos", videosCount: 10, isPrivate: false },
  { id: 6, thumbnail: Pl2, title: "My favorite songs", videosCount: 20, isPrivate: true },
  { id: 7, thumbnail: Pl3, title: "Chill music", videosCount: 15, isPrivate: false },
  { id: 8, thumbnail: Pl4, title: "Workout playlist", videosCount: 25, isPrivate: true }
];

export default function Page() {
  return (
    <div className="w-full px-6">
      <div className="flex flex-1 flex-col items-start justify-start gap-2.5 self-stretch p-2.5">
        <div className="flex items-center justify-between self-stretch px-2 py-6">
          <h1 className="justify-start text-3xl font-normal leading-loose text-theme-neutrals-100">
            My playlist
          </h1>
          <Button className="rounded-full">Recently added</Button>
        </div>

        <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
          {fakeData.map((playlist) => (
            <PlayListCard
              key={playlist.id}
              thumbnail={playlist.thumbnail.src}
              title={playlist.title}
              videosCount={playlist.videosCount}
              isPrivate={playlist.isPrivate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type PlayListCardProps = {
  thumbnail: string;
  title: string;
  description?: string;
  videosCount?: number;
  isPrivate?: boolean;
};

function PlayListCard(props: PlayListCardProps) {
  const { thumbnail, title, videosCount, isPrivate } = props;
  return (
    <div className="relative inline-flex w-full flex-col items-center justify-start gap-3 rounded-[10px] pb-3 shadow-[0px_0px_32px_0px_rgba(6,7,8,0.32)]">
      <div className="absolute left-1/2 top-[-14px] h-28 w-[calc(100%-40px)] -translate-x-1/2 rounded-[10px] bg-theme-neutrals-800" />
      <div className="absolute left-1/2 top-[-7px] h-32 w-[calc(100%-20px)] -translate-x-1/2 rounded-[10px] bg-theme-neutrals-700" />
      <div className="flex w-full flex-col items-center justify-center">
        <div className="relative h-44 w-full overflow-hidden rounded-[10px] lg:h-36">
          <button className="absolute right-2 top-[8px] z-[1] inline-flex size-6 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-neutral-400 bg-opacity-20 bg-blend-difference backdrop-blur-lg">
            <Pin className="text-color-neutrals-200 size-3" />
          </button>
          <Image src={thumbnail} alt={title} fill className="size-full object-cover" />
          <div className="absolute bottom-0 right-0 inline-flex h-8 items-center justify-end self-stretch px-2">
            <div className="flex items-center justify-start gap-2.5 overflow-hidden rounded-full bg-neutral-400 bg-opacity-20 px-2 py-1 bg-blend-difference backdrop-blur-lg">
              <div className="justify-start text-xs font-normal leading-none text-zinc-200">
                {videosCount || 0} Videos
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-end justify-start self-stretch">
        <div className="inline-flex items-center justify-between self-stretch px-2">
          <div className="flex items-center justify-start gap-3">
            <div className="inline-flex flex-col items-start justify-start gap-1">
              <div className="justify-start text-base font-semibold leading-tight text-theme-neutrals-200">
                Liked videos
              </div>
              <div className="justify-start text-xs font-normal leading-none text-theme-neutrals-400">
                {isPrivate ? "Private" : "Public"}
              </div>
            </div>
          </div>
          <button className="flex items-center justify-start gap-6">
            <MoreVertical />
          </button>
        </div>
      </div>
    </div>
  );
}

function useRows<T>(items: T[], itemWidth: number = 256) {
  const screenSize = useScreenSize();
  const rows = [];
  let rowSize = 4;

  const windowWidth = screenSize.width || 0;
  const totalItemsCountPerRow = Math.floor(windowWidth / itemWidth);
  if (totalItemsCountPerRow > 0) {
    rowSize = totalItemsCountPerRow;
  }

  for (let i = 0; i < items.length; i += rowSize) {
    rows.push(items.slice(i, i + rowSize));
  }

  return rows;
}
