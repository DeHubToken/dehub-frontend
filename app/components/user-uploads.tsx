/* eslint-disable @typescript-eslint/no-explicit-any */

import "server-only";

import { FeedItem } from "./feed-item";

type Props = {
  nfts: any;
};

export function UserUploads(props: Props) {
  const { nfts } = props;
  return (
    <div className="mt-12 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
      <div className="h-auto w-full">
        <div className="flex h-auto w-full items-center justify-between">
          <h1 className="text-4xl">Uploads</h1>
        </div>

        <div className="mt-10 h-auto w-full">
          <div className="flex h-auto w-full flex-wrap items-stretch justify-start gap-6">
            {nfts.map((nft: any, index: number) => (
              <FeedItem nft={nft} key={nft.tokenId + "--" + index} />
            ))}

            {nfts.length === 0 && (
              <div className="flex h-[300px] w-full flex-col items-center justify-center lg:h-[650px]">
                <p>No Uploads</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
