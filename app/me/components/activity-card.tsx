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
  <FeedCard>
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
        [ActivityActionType.UPLOAD_FEED_SIMPLE]: { icon: <Rss />, text: "dropped a post! 🚀" },
        [ActivityActionType.UPLOAD_FEED_IMAGES]: {
          icon: <GalleryHorizontal />,
          text: "shared some cool visuals! 📸"
        },
        [ActivityActionType.UPLOAD_VIDEO]: { icon: <Play />, text: "posted an epic video! 🎬" },
        [ActivityActionType.FOLLOW]: {
          icon: <UserCheck />,
          text: (
            <div>
              start follow  $
              {followingUser?.username?
                <Link href={`/${followingUser?.username}`}>
                  @{followingUser?.username}
                </Link>:"someone"
              }
              ! 👀
            </div>
          )
        },
        [ActivityActionType.PURCHASE_PLAN]: {
          icon: <CircleCheck />,
          text: "secured a premium plan! 💳"
        },
        [ActivityActionType.PLAN_PUBLISHED]: {
          icon: <CirclePlus />,
          text: "launched a brand new plan! 🚀"
        },
        [ActivityActionType.LIKE]: { icon: <Heart />, text: "showed some love to a post! ❤️" },
        [ActivityActionType.DIS_LIKE]: { icon: <HeartOff />, text: "wasn’t feeling a post. 😬" },
        [ActivityActionType.REPLY_ON_POST]: { icon: <AtSign />, text: "dropped a reply! 💬" },
        [ActivityActionType.COMMENT_ON_POST]: {
          icon: <MessageSquare />,
          text: "left a comment! 📝"
        },
        [ActivityActionType.TIP_ON_POST]: { icon: <DollarSign />, text: "tipped on a post! 💸" },
        [ActivityActionType.TIP_ON_CHAT]: { icon: <DollarSign />, text: "sent a chat tip! ✨" },
        [ActivityActionType.CREATE_PLAN]: {
          icon: <FilePlus />,
          text: "designed a killer new plan! 🔥"
        }
      }) as const,
    [followingUser]
  );

  const activity = activityMap[type];

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {activity.icon}
        <h5>
          <Link href={`/${username}`} className="font-bold hover:underline">
            @{username}
          </Link>
        </h5>
        <span>{activity.text}</span>
      </div>
      <span>{timeAgo}</span>
    </div>
  );
};
