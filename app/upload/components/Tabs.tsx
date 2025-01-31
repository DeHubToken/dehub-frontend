import React from "react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
} 
const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center gap-6 w-full   pb-4">
      <button
        className={`px-6 py-2 rounded-t-lg border-b-2 ${
          activeTab === "video" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
        }`}
        onClick={() => setActiveTab("video")}
      >
        Video Upload
      </button>
      <button
        className={`px-6 py-2 rounded-t-lg border-b-2 ${
          activeTab === "Feed" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-500"
        }`}
        onClick={() => setActiveTab("Feed")}
      >
        Upload Feed's
      </button>
    </div>
  );
};

export default Tabs;
