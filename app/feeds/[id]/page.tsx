import { Suspense } from "react";
import { redirect } from "next/navigation";

import { Error } from "@/components/error";
import { ErrorBoundary } from "@/components/error-boundry";

import { Feed } from "./components/feed"; 
import { RecentStreams } from "@/app/stream/[id]/components/recent";

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
    <div className="relative h-auto w-full">
      <div className="flex h-auto min-h-screen w-full flex-col items-start justify-start xl:flex-row xl:justify-between">
        <ErrorBoundary FallbackComponent={Error}>
          <Suspense fallback={<div>Loading...</div>}>
            <Feed tokenId={_id} />
          </Suspense>
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={Error}>
          <Suspense fallback={<div>Loading...</div>}>
            <RecentStreams />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
