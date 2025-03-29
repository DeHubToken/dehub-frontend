import Image from "next/image";
import { HandCoins, Heart, MessageCircle, Share2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data = [
  {
    id: 1,
    name: "Username",
    description: "Description text here. It can hold up to two line and #hashtags t...more",
    imageUrl: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913",
    avatarUrl: "https://plus.unsplash.com/premium_photo-1689551671541-31a345ce6ae0",
    likes: 3700,
    comments: 789,
    gifts: 38
  },
  {
    id: 2,
    name: "Username",
    description: "Description text here. It can hold up to two line and #hashtags t...more",
    imageUrl: "https://images.unsplash.com/photo-1563832528262-15e2bca87584",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
    likes: 3700,
    comments: 789,
    gifts: 38
  }
];

export function SnippetsPanel() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="relative flex max-h-[calc((600/16)*1rem)] min-h-[calc((600/16)*1rem)] w-full max-w-[400px] items-end justify-start gap-4"
          >
            <div className="relative flex h-full w-80 flex-col items-start justify-start gap-2.5 overflow-hidden rounded-3xl p-4">
              <div className="absolute bottom-4 left-0 z-[1] flex w-full items-start justify-start gap-2.5 self-stretch">
                <div className="flex w-[calc(100%-40px)] flex-col items-start justify-start gap-2.5 overflow-hidden p-4 sm:w-full">
                  <span className="justify-start self-stretch text-base font-semibold leading-tight text-theme-neutrals-200">
                    {item.name}
                  </span>
                  <span className="text-sm font-normal leading-tight text-theme-neutrals-300 sm:text-base">
                    {item.description}
                  </span>
                </div>
              </div>
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="absolute inset-0 size-full rounded-3xl object-cover"
              />
            </div>
            <div className="absolute bottom-4 right-4 z-[2] flex flex-col items-center justify-center gap-6 py-6 sm:relative sm:bottom-[unset] sm:right-[unset]">
              <Avatar className="size-12">
                <AvatarFallback>UR</AvatarFallback>
                <AvatarImage src={item.avatarUrl} alt="avatar" className="object-cover" />
              </Avatar>
              <button className="flex flex-col items-center justify-center gap-2.5 px-[3px] py-1 text-xs font-semibold text-theme-neutrals-200">
                <Heart className="text-theme-neutrals-200" />
                {item.likes}
              </button>
              <button className="flex flex-col items-center justify-center gap-2.5 px-[3px] py-1 text-xs font-semibold text-theme-neutrals-200">
                <MessageCircle className="text-theme-neutrals-200" />
                {item.comments}
              </button>
              <button className="flex flex-col items-center justify-center gap-2.5 px-[3px] py-1 text-xs font-semibold text-theme-neutrals-200">
                <HandCoins className="text-theme-neutrals-200" />
                {item.gifts}
              </button>
              <button className="flex flex-col items-center justify-center gap-2.5 px-[3px] py-1 text-xs font-semibold text-theme-neutrals-200">
                <Share2 className="text-theme-neutrals-200" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
