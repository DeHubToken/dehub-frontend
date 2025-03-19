import React from "react";

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}
const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex w-full justify-center gap-6   pb-4">
      <button
        className={`rounded-t-lg border-b-2 px-6 py-2 ${
          activeTab === "video"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => setActiveTab("video")}
      >
        Video Upload
      </button>
      <button
        className={`rounded-t-lg border-b-2 px-6 py-2 ${
          activeTab === "Feed"
            ? "border-blue-500 text-blue-500"
            : "border-transparent text-gray-500"
        }`}
        onClick={() => setActiveTab("Feed")}
      >
        Feed Upload
      </button>
    </div>
  );
};

export default Tabs;
