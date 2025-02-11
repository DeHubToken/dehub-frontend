import React, { useEffect } from "react";
import Link from "next/link";

import { Categories } from "@/app/components/categories";

import ProfileTabViewServer from "./TabView";

const tabs = [
  { key: "video", label: "Videos" },
  { key: "feed-all", label: "Feeds" },
  { key: "user-reports", label: "User Reports" }
];

export default function ProfileTabView({
  user,
  searchParams,
  isOwner
}: {
  user: any;
  searchParams: any;
  isOwner: boolean;
}) {
  const activeTab = searchParams?.tab ?? "video";
  return (
    <div>
      <div className="flex flex-wrap justify-between align-middle">
        <div className="flex flex-wrap dark:border-theme-mine-shaft bg-theme-monochrome-600 rounded-full border">
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              href={`/${isOwner ? "me" : (user?.username ?? user?.address ?? "")}?tab=${key}`}
              className={` px-6 py-2 ${
                activeTab === key
                  ? "rounded-full dark:bg-theme-mine-shaft bg-theme-mine-shaft-dark"
                  : "border-transparent text-gray-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className=" max-w-[50vh]">
          <Categories
            title={"type.toUpperCase()"}
            category={"category"}
            range={"range"}
            type={"type"}
            q={"q"}
            sortBy={"sortBy"}
          />
        </div>
      </div>

      <ProfileTabViewServer
        user={user}
        isOwner={isOwner}
        activeTab={activeTab}
        searchParams={searchParams}
      />
    </div>
  );
}
