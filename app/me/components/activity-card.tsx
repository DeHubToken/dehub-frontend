"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AtSign,
  CircleCheck,
  CirclePlus,
  DollarSign,
  FilePlus,
  GalleryHorizontal,
  Heart,
  HeartOff,
  MessageSquare,
  Play,
  Rss,
  UserCheck
} from "lucide-react";

import { FeedCard } from "@/components/feed/feed-card";
import { FeedHeader } from "@/components/feed/feed-header";

import dayjs from "@/libs/dayjs";

import { ActivityActionType } from "@/configs";

interface ActivityCardProps {
  data: any;
  children: React.ReactNode;
  type: keyof typeof ActivityActionType;
  isOwner: boolean;
}

export const ActivityCard = ({ data, type, children }: ActivityCardProps) => (
  <FeedCard className="dark:bg-theme-monochrome-600">
    <FeedHeader>
      <ActivityHeader data={data} type={type} />
    </FeedHeader>
    {children}
  </FeedCard>
);


const ActivityHeader = ({ data, type }: { data: any; type: keyof typeof ActivityActionType }) => {
  const { user, createdAt, followingUser } = data;
  const username = user?.username;
  const timeAgo = dayjs(createdAt).fromNow();

  const activityMap = useMemo(
    () =>
      ({
        [ActivityActionType.UPLOAD_FEED_SIMPLE]: {
          icon: <Rss className="w-[30px]" />,
          text: "Dropped a new post! 🚀"
        },
        [ActivityActionType.CREATE_LIVE]: {
          icon: <Rss className="w-[30px]" />,
          text: "Dropped a new live! 🚀"
        },
        [ActivityActionType.UPLOAD_FEED_IMAGES]: {
          icon: <GalleryHorizontal className="w-[30px]" />,
          text: "Shared some amazing visuals! 📸"
        },
        [ActivityActionType.UPLOAD_VIDEO]: {
          icon: <Play className="w-[30px]" />,
          text: "Posted an epic video! 🎬"
        },
        [ActivityActionType.FOLLOW]: {
          icon: <UserCheck className="w-[30px]" />,
          text: (
            <span>
              Started following{" "}
              {followingUser?.username ? (
                <Link href={`/${followingUser?.username}`}>
                  @{followingUser?.username}
                </Link>
              ) : (
                "someone"
              )}
              ! 👀
            </span>
          )
        },
        [ActivityActionType.PURCHASE_PLAN]: {
          icon: <CircleCheck className="w-[30px]" />,
          text: <span>Unlocked a premium plan! 💳</span>
        },
        [ActivityActionType.PLAN_PUBLISHED]: {
          icon: <CirclePlus className="w-[30px]" />,
          text: <span>Launched an exclusive new plan! 🚀</span>
        },
        [ActivityActionType.LIKE]: {
          icon: <Heart className="w-[30px]" />,
          text: <span>Liked a post! ❤️</span>
        },
        [ActivityActionType.DIS_LIKE]: {
          icon: <HeartOff className="w-[30px]" />,
          text: <span>Wasn’t feeling this post. 😬</span>
        },
        [ActivityActionType.REPLY_ON_POST]: {
          icon: <AtSign className="w-[30px]" />,
          text: <span>Dropped a reply! 💬</span>
        },
        [ActivityActionType.COMMENT_ON_POST]: {
          icon: <MessageSquare className="w-[30px]" />,
          text: <span>Left a comment! 📝</span>
        },
        [ActivityActionType.TIP_ON_POST]: {
          icon: <DollarSign className="w-[30px]" />,
          text: <span>Gave a tip on a post! 💸</span>
        },
        [ActivityActionType.TIP_ON_CHAT]: {
          icon: <DollarSign className="w-[30px]" />,
          text: <span>Sent a chat tip! ✨</span>
        },
        [ActivityActionType.CREATE_PLAN]: {
          icon: <FilePlus className="w-[30px]" />,
          text: <span>Designed an exciting new plan! 🔥</span>
        }
      }) as const,
    [followingUser]
  );

  const activity = activityMap[type];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="w-[30px]">{activity?.icon}</div>
        <h5>
          <Link href={`/${username}`} className="font-bold hover:underline">
            @{username}
          </Link>{" "}
          <span>{activity?.text}</span>
        </h5>
      </div>
      <span className="ml-[35px] text-sm font-normal text-[#8B8D90]">{timeAgo}</span>
    </div>
  );
};
