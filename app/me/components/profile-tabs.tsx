import React, { useEffect } from "react";
import Link from "next/link";

import { Categories } from "@/app/components/categories";

import ProfileTabViewServer from "./tab-view";

const tabs = [
  { key: "video", label: "Videos" },
  { key: "feed-all", label: "Feed" },
  { key: "user-activity", label: "Activity" },
  { key: "user-livestreams", label: "Livestreams" }
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
      <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center lg:gap-0">
        <div className="bg-theme-monochrome-600 flex w-fit overflow-x-auto rounded-full border dark:border-theme-mine-shaft">
          {tabs.map(({ key, label }) => (
            <Link
              key={key}
              scroll={false}
              href={`/${isOwner ? "me" : (user?.username ?? user?.address ?? "")}?tab=${key}`}
              className={` rounded-full px-6 py-2 transition-all hover:bg-theme-neutrals-800  hover:pl-7 hover:pr-7 dark:hover:bg-theme-mine-shaft-dark ${
                activeTab === key
                  ? "rounded-full bg-theme-neutrals-800 pl-7 pr-7 dark:bg-theme-mine-shaft-dark dark:text-white"
                  : "border-transparent text-gray-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="max_wdth w-full lg:max-w-[50vh]">
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
