import React, { useEffect } from "react";
import Link from "next/link";

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
  const activeTab=searchParams?.tab??"video"
  return (
    <div>
      <div className="flex w-full">
        {tabs.map(({ key, label }) => (
          <Link
            key={key}
            href={`/${isOwner?"me":user?.username??user?.address??""}?tab=${key}`}
            className={`rounded-t-lg border-b-2 px-6 py-2 ${
              activeTab === key
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500"
            }`}
          >
            {label}
          </Link>
        ))}
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
