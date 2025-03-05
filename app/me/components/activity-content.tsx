 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StreamItem } from "@/app/components/stream-item"; 

import { ActivityActionType } from "@/configs";

export const ActivityContent = ({ data }: any) => {
  return (
    <div>
      {ActivityActionType.UPLOAD_VIDEO == data.type && (
        <StreamItem nft={data?.nft} isOwner={false} />
      )}
    </div>
  );
};
