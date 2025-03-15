/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLeaderboard } from "@/services/user";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircleMore, ThumbsDown, ThumbsUp, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { getNotifications, requestMarkAsRead } from "@/services/user";

import { formatNotificationDate } from "@/web3/utils/format";

import { Notification } from "../_icons";
import { NotificationCount } from "../notification-count";
import { Button } from "../ui/button";

const icons: any = {
  like: <ThumbsUp className="text-gray-500" />,
  dislike: <ThumbsDown className="text-gray-500" />,
  follow: <Bell className="text-gray-500" />,
  comment: <MessageCircleMore className="text-gray-500" />,
  default: <Bell className="text-gray-500" />
};

const NotificationModal = (props: { className?: string }) => {
  const { className } = props;
  const [notifications, setNotifications] = useState<TLeaderboard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { account, library } = useActiveWeb3React();

  const getUrl = (type: any, tokenId?: number | string | undefined) => {
    if (type === "like" || type === "dislike" || type === "comment") {
      return `/stream/${tokenId}`;
    } else if (type === "tip" || type === "following") {
      return "/me";
    } else {
      return "#";
    }
  };

  const markAsRead = async (id: number | string) => {
    await requestMarkAsRead({ account, library, id });
    const payload = notifications.filter((e: any) => e?._id !== id);
    setNotifications(payload);
  };

  useEffect(() => {
    async function fetchNotifications() {
      const notificationsResponse = await getNotifications({ account, library });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data.result);
      } else {
        setError(notificationsResponse.error);
      }
    }

    if (!account) return;
    fetchNotifications();
  }, [account, library]);

  if (!account) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative w-auto cursor-pointer justify-start gap-2 p-2 lg:w-full lg:px-0.5 xl:px-2 2xl:px-4",
            className
          )}
        >
          <Notification className="size-6" />
          {notifications?.length > 0 && (
            <span className="bg-theme-orange-500 absolute -right-2 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full p-1 text-xs font-bold text-white xl:right-0 xl:size-6">
              {notifications?.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-auto 2xl:max-w-auto h-[calc(100vh-200px)]">
        <DialogHeader className="gap-2">
          <DialogTitle className="font-tanker text-4xl tracking-wide">Notifications</DialogTitle>
          <Separator className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark" />
        </DialogHeader>
        {error && (
          <div className="text-center font-tanker text-4xl tracking-wide">
            Error Fetching Notifications
          </div>
        )}
        {notifications && (
          <div className="flex flex-col items-start justify-start gap-6 rounded-lg p-4 shadow-lg">
            {!notifications || notifications?.length === 0 ? (
              <div className="w-full text-center text-gray-500">No notifications found</div>
            ) : (
              notifications?.map((e: any, i: number) => (
                <div className="mb-2 flex w-full flex-col border-b border-gray-200 p-2" key={i}>
                  <div className="flex items-center justify-between">
                    <Link href={getUrl(e?.type, e?.tokenId)}>
                      <div
                        className="flex cursor-pointer items-center"
                        onClick={() => markAsRead(e._id)}
                      >
                        <div className="mr-2">{icons[e.type] || icons.default}</div>
                        <div className="">
                          <div className="text-sm font-medium">{e.content}</div>
                        </div>
                      </div>
                    </Link>
                    <div
                      className="cursor-pointer text-gray-400 hover:text-red-600"
                      onClick={() => markAsRead(e._id)}
                    >
                      <X className="size-4" />
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {formatNotificationDate(e.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;

export const NotificationMobileModal = (props: { className?: string }) => {
  const { className } = props;
  const [notifications, setNotifications] = useState<TLeaderboard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { account, library } = useActiveWeb3React();

  const getUrl = (type: any, tokenId?: number | string | undefined) => {
    if (type === "like" || type === "dislike" || type === "comment") {
      return `/stream/${tokenId}`;
    } else if (type === "tip" || type === "following") {
      return "/me";
    } else {
      return "#";
    }
  };

  const markAsRead = async (id: number | string) => {
    await requestMarkAsRead({ account, library, id });
    const payload = notifications.filter((e: any) => e?._id !== id);
    setNotifications(payload);
  };

  useEffect(() => {
    async function fetchNotifications() {
      const notificationsResponse = await getNotifications({ account, library });
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data.result);
      } else {
        setError(notificationsResponse.error);
      }
    }

    if (!account) return;
    fetchNotifications();
  }, [account, library]);

  if (!account) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative w-auto cursor-pointer justify-start gap-2 p-2 lg:w-full lg:px-0.5 xl:px-2 2xl:px-4",
            className
          )}
        >
          <Notification className="size-4" />
          Notifications
          {notifications.length > 0 && (
            <span className="bg-theme-orange-500 absolute right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full p-1 text-xs font-bold text-white">
              {notifications.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-auto 2xl:max-w-auto h-[calc(100vh-200px)]">
        <DialogHeader className="gap-2">
          <DialogTitle className="font-tanker text-4xl tracking-wide">Notifications</DialogTitle>
          <Separator className="bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark" />
        </DialogHeader>
        {error && (
          <div className="text-center font-tanker text-4xl tracking-wide">
            Error Fetching Notifications
          </div>
        )}
        {notifications && (
          <div className="flex flex-col items-start justify-start gap-6 rounded-lg p-4 shadow-lg">
            {!notifications || notifications.length === 0 ? (
              <div className="w-full text-center text-gray-500">No notifications found</div>
            ) : (
              notifications.map((e: any, i: number) => (
                <div className="mb-2 flex w-full flex-col border-b border-gray-200 p-2" key={i}>
                  <div className="flex items-center justify-between">
                    <Link href={getUrl(e?.type, e?.tokenId)}>
                      <div
                        className="flex cursor-pointer items-center"
                        onClick={() => markAsRead(e._id)}
                      >
                        <div className="mr-2">{icons[e.type] || icons.default}</div>
                        <div className="">
                          <div className="text-sm font-medium">{e.content}</div>
                        </div>
                      </div>
                    </Link>
                    <div
                      className="cursor-pointer text-gray-400 hover:text-red-600"
                      onClick={() => markAsRead(e._id)}
                    >
                      <X className="size-4" />
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {formatNotificationDate(e.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
