import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { RecentStreams } from "@/app/stream/[id]/components/recent";

import { Error } from "@/components/error";
import { ErrorBoundary } from "@/components/error-boundry";

import { safeParseCookie } from "@/libs/cookies";

import { getNFT } from "@/services/nfts";

import { Feed } from "./components/feed";

type Props = {
  params: { id: string };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = props.params;
  const _id = Number(id);

  if (isNaN(_id)) {
    return redirect("/");
  }

  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  const response = await getNFT(_id, user?.address as string);

  if (!response.success) {
    return redirect("/");
  }

  const title = response.data.result.name || `Dehub Feed #${_id}`;
  const description =
    response.data.result.description || `Explore the feed of NFT #${_id} on Dehub.`;
  const images: string[] = [];
  response.data.result.imageUrls?.forEach((image) => {
    if (image) images.push(image);
  });

  if (images.length === 0) {
    images.push("/images/default-avatar.png");
  }

  return {
    title,
    description,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images
    },
    openGraph: {
      title,
      description,
      url: `https://dehub.io/feeds/${_id}`,
      siteName: "Dehub",
      images: images.map((image) => ({
        width: 800,
        height: 600,
        alt: title || `Dehub Feed #${_id}`,
        url: image
      })),
      locale: "en_US",
      type: "website"
    }
  };
}

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
