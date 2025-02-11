"use client";

import React, { useState } from "react";
import ProfileTabViewServer from "./TabView"; // Import server component

const tabs = [
  { key: "video", label: "Videos" },
  { key: "feed-images", label: "Feed Images" },
  { key: "feed-simple", label: "Feed Simple" },
  { key: "user-reports", label: "User Reports" },
];

export default function ProfileTabView({ user, isOwner }: { isOwner: boolean; user: any }) {
  const [activeTab, setActiveTab] = useState("video");

  return (
    <div>
      <div className="flex w-full">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            className={`rounded-t-lg border-b-2 px-6 py-2 ${
              activeTab === key ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <ProfileTabViewServer activeTab={activeTab} user={user} isOwner={isOwner} />
    </div>
  );
}
