import {
  Contact,
  Documents,
  Explore,
  LeaderBoard,
  New,
  Notification,
  Profile,
  Treading,
  Upload
} from "@/components/icons";
import { Button } from "@/components/ui/button";

import { cn } from "@/libs/utils";

const SidebarSkeleton = ({ className }: { className?: string }) => {
  const links = [
    { id: 4, name: "Profile", icon: <Profile /> },
    { id: 12, name: "Notifications", icon: <Notification /> },
    { id: 1, name: "PPV", icon: <Profile /> },
    { id: 2, name: "Watch2Earn", icon: <Profile /> },
    { id: 3, name: "Exclusive", icon: <Profile /> },
    { id: 5, name: "New", icon: <New /> },
    { id: 6, name: "Most viewd", icon: <Treading /> },
    { id: 7, name: "Upload", icon: <Upload /> },
    { id: 8, name: "Explore", icon: <Explore /> },
    { id: 9, name: "Leaderboard", icon: <LeaderBoard /> },
    { id: 10, name: "Documents", icon: <Documents /> },
    { id: 11, name: "Contact", icon: <Contact /> }
  ];

  return (
    <div
      className={cn(
        "sticky left-0 top-0  h-screen w-full bg-gray-200 pl-6 pt-20 dark:bg-theme-mine-shaft-dark sm:pr-2 xl:pr-6",
        className
      )}
    >
      <div className="flex size-full flex-col items-start justify-start gap-1">
        {links.map((link) => (
          <Button
            key={link.id}
            variant="ghost"
            className="w-auto cursor-pointer justify-start gap-2 p-2 lg:w-full lg:px-0.5 xl:px-2 2xl:px-4"
          >
            {link.icon}
            <span className="hidden lg:block">{link.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SidebarSkeleton;
