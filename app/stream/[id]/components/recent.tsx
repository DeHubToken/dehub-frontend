import Link from "next/link";

import { LazyImage } from "@/components/image";

import { truncate } from "@/libs/strings";

import { getNFTs } from "@/services/nfts/trending";

import { getImageUrl } from "@/web3/utils/url";
import { safeParseCookie } from "@/libs/cookies";
import { cookies } from "next/headers";

/* ================================================================================================= */

export async function RecentPanel() {
  const cookie = cookies();
  const userCookie = cookie.get("user_information");
  const user = safeParseCookie<{ address: string }>(userCookie?.value);
  const response = await getNFTs({ sortMode: "new", address: user?.address });

  if (!response.success) {
    return (
      <div className="flex size-full h-screen flex-col items-center justify-center p-4">
        <div className="space-y-4">
          <p className="text-sm">{response.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 h-auto w-full px-4 pb-10 xl:h-screen xl:max-w-[25%] xl:flex-[0_0_25%] xl:overflow-y-scroll xl:py-20">
      <div className="flex h-auto w-full flex-col items-start justify-start gap-4">
        {response.data.result.length === 0 && (
          <div className="flex h-[calc(100vh-72px)] w-full items-center justify-center p-4">
            No recent NFTs
          </div>
        )}

        {response.data.result.length > 0 &&
          response.data.result.map((item, i) => (
            <Link
              key={i}
              href={`/stream/${item.tokenId}`}
              className="flex h-auto w-full items-center justify-between overflow-hidden rounded-2xl bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark"
            >
              <figure className="h-32 w-full max-w-[40%] flex-[0_0_40%] overflow-hidden rounded-2xl sm:h-40 xl:h-28">
                <LazyImage
                  src={getImageUrl(item.imageUrl, 256, 256)}
                  alt={item.name || "Upload"}
                  className="size-full object-cover"
                />
              </figure>

              <div className="flex h-auto w-full flex-col items-start justify-center gap-1 p-4">
                <h1 className="text-md font-semibold">{truncate(item.name, 26)}</h1>
                {item.views && item.views > 0 && <p className="text-sm">{item.views} viewers</p>}
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
