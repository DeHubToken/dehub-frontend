/* eslint-disable @typescript-eslint/no-explicit-any */

import "server-only";

import { StreamItem } from "./stream-item";

type Props = {
  nfts: any;
  isOwner?: Boolean;
};

export function UserUploads(props: Props) {
  const { nfts, isOwner } = props;
  return (
    <div className="mt-12 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
      <div className="h-auto w-full">
        <div className="flex h-auto w-full items-center justify-between">
          <h1 className="text-4xl">Uploads</h1>
        </div>

        <div className="mt-10 h-auto w-full">
          <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-5">
            {nfts.map((nft: any, index: number) => (
              <StreamItem nft={nft} key={nft.tokenId + "--" + index} isOwner={isOwner} />
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
