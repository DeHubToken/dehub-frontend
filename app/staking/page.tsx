import { Suspense } from "react";

import { LeaderboardSkeleton } from "../components/leaderborad";
import { TabPanel } from "../components/tab-panel";
import { StakingForm } from "./components/staking-form";

export default async function Page() {
  return (
    <div className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start gap-6 px-6 pb-28 sm:gap-10">
        <h1 className="text-4xl font-medium">Staking</h1>

        <StakingForm />
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <TabPanel defaultValue="leaderboard" />
      </Suspense>
    </div>
  );
}
