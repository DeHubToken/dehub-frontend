import React, { useEffect } from "react";
import Link from "next/link";

import { Categories } from "@/app/components/categories";

import ProfileTabViewServer from "./tab-view";

const tabs = [
  { key: "video", label: "Videos" },
  { key: "feed-all", label: "Feed" },
  { key: "user-activity", label: "Activity" }
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
    <div className="mt-5">
      <div className="flex flex-wrap justify-between align-middle">
        <div className="bg-theme-monochrome-600 flex flex-wrap rounded-full border dark:border-theme-mine-shaft">
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              scroll={false} 
              href={`/${isOwner ? "me" : (user?.username ?? user?.address ?? "")}?tab=${key}`}
              className={` px-6 py-2 rounded-full hover:bg-theme-mine-shaft-dark  hover:pl-7 hover:pr-7 transition-all ${
                activeTab === key
                  ? "rounded-full bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft pl-7 pr-7"
                  : "border-transparent text-gray-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className=" max-w-[50vh] mt-3">
          {["video", "feed-images", "feed-all", "feed-simple"].some((a) => a === activeTab) && (
            <Categories
              base={`/${isOwner ? "me" : (user?.username ?? user?.address ?? "")}`}
              tab={activeTab}
              title={searchParams?.type?.toUpperCase() ?? ""} // Removed quotes to use actual variable
              category={searchParams?.category} // Removed quotes to pass variable
              range={searchParams?.range}
              type={searchParams?.type}
              q={searchParams?.q}
              sort={searchParams?.sort}
            />
          )}
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
