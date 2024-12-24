import { Suspense } from "react";

import { Leaderboard, LeaderboardSkeleton } from "../components/leaderborad";
import { StakingForm } from "./components/staking-form";

export default async function Page() {
  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between">
      <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start gap-6 px-6 py-28 sm:gap-10 md:max-w-[75%] md:flex-[0_0_75%]">
        <h1 className="text-4xl font-medium">Staking</h1>

        <StakingForm />
      </div>

      <Suspense fallback={<LeaderboardSkeleton />}>
        <Leaderboard />
      </Suspense>
    </main>
  );
}
