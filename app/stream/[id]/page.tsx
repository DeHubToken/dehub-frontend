import { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Error } from "@/components/error";
import { ErrorBoundary } from "@/components/error-boundry";

import { safeParseCookie } from "@/libs/cookies";

import { getNFT } from "@/services/nfts";

import { getAvatarUrl, getImageUrl } from "@/web3/utils/url";

import { RecentStreams } from "./components/recent";
import { Stream } from "./components/stream";

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

  const title = response.data.result.name || `Dehub Stream #${_id}`;
  const description =
    response.data.result.description || `Watch the stream of NFT #${_id} on Dehub.`;
  const minterAvatarUrl = getAvatarUrl(
    response.data.result.minterAvatarUrl || "/images/default-avatar.png"
  );
  const streamPoster = getImageUrl(response.data.result.imageUrl);

  return {
    title: response.data.result.name || `Dehub Stream #${_id}`,
    description: response.data.result.description || `Watch the stream of NFT #${_id} on Dehub.`,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [streamPoster || minterAvatarUrl]
    },
    openGraph: {
      title,
      description,
      url: `https://dehub.io/stream/${id}`,
      siteName: "Dehub",
      images: [
        {
          url: streamPoster || minterAvatarUrl,
          width: 800,
          height: 600,
          alt: title || `Dehub Stream #${_id}`
        }
      ],
      locale: "en_US",
      type: "video.other"
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
    <div className="mx-auto flex h-auto min-h-screen flex-col items-start justify-start sm:container xl:flex-row xl:justify-between">
      <ErrorBoundary FallbackComponent={Error}>
        <Suspense fallback={<div>Loading...</div>}>
          <Stream tokenId={_id} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={Error}>
        <Suspense fallback={<div>Loading...</div>}>
          <RecentStreams />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
