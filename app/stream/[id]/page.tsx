import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Error } from "@/components/error";
import { ErrorBoundary } from "@/components/error-boundry";
import { Gift } from "@/components/icons/gift";
import { ThumbsUp } from "@/components/icons/thumbs-up";
import { WavingHand } from "@/components/icons/waving-hand";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RecentStreams } from "./components/recent";
import { Stream } from "./components/stream";

type Props = {
  params: { id: string };
};

export default async function Page(props: Props) {
  const { id } = props.params;
  const _id = Number(id);

  if (isNaN(_id)) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto flex h-auto min-h-screen flex-col items-start justify-start xl:flex-row xl:justify-between">
      <ErrorBoundary FallbackComponent={Error}>
        <Suspense fallback={<div>Loading...</div>}>
          <Stream tokenId={_id} />
        </Suspense>
      </ErrorBoundary>
      <div className="flex w-full flex-[0_0_calc((400/16)*1rem)] flex-col gap-3 pt-6">
        <div className="flex items-center">
          <Button variant="noBg" className="rounded-full p-3">
            Live prediction
          </Button>
          <Button className="rounded-full bg-theme-neutrals-700 p-3 dark:bg-theme-neutrals-700">
            Live chat
          </Button>
          <Button variant="noBg" className="rounded-full p-3">
            Leaderboard
          </Button>
          <Button variant="noBg" className="rounded-full p-3">
            Recommended
          </Button>
        </div>

        <div className="rounded-3xl border border-theme-neutrals-800 px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-theme-neutrals-100">Live chat</span>
            <Button className="h-7 rounded-full">View all</Button>
          </div>

          <div className="mt-3 flex flex-col gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-start">
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                  <AvatarImage src="" />
                </Avatar>
                <div className="flex flex-col gap-2 pl-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-theme-neutrals-200">Username</span>
                    <span className="text-sm font-normal text-theme-neutrals-500">45 mins ago</span>
                  </div>
                  <p className="font-medium text-theme-neutrals-400">Let's Go</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <WavingHand />
              <p className="text-theme-neutrals-400">
                User353 <span className="font-semibold">joined the stream</span>
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Input placeholder="Comment..." className="h-11 flex-1 rounded-full" />
            <Button className="rounded-full" variant="gradientOne">
              <Gift />
            </Button>
            <Button className="rounded-full text-theme-neutrals-400">
              <ThumbsUp className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
