import { FeedItem, FeedList } from "@/app/components/feed-list";
import { StreamItem } from "@/app/components/stream-item";

import { getNFTs } from "@/services/nfts/trending";
import { getUserActivity } from "@/services/user";

import { ActivityActionType } from "@/configs";

import { ActivityCard } from "./activity-card";

interface Props {
  user?: { address?: string; username?: string };
  isOwner: boolean;
  activeTab?: string;
  searchParams?: any;
}

async function TabVideoUploads({ isOwner, user, searchParams }: Props) {
  if (!user?.address) {
    return <div>No Uploads</div>;
  }
  const parms = {
    minter: user.address,
    unit: 40,
    address: user.address,
    postType: "video",
    sortMode: searchParams?.type,
    sort: searchParams?.sort,
    category: searchParams?.category === "All" ? null : searchParams?.category,
    range: searchParams?.range,
    search: searchParams?.q
  };
  console.log("getNFTs_parms", parms);
  const res = await getNFTs(parms);

  const data = res.success ? res.data.result : [];
  console.log("data[0]", data[0]);
  return (
    <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-5">
      {data.length > 0 ? (
        data.map((nft, index) => (
          <StreamItem nft={nft} key={nft.tokenId + "--" + index} isOwner={isOwner} />
        ))
      ) : (
        <div className="flex h-[300px] w-full flex-col items-center justify-center lg:h-[650px]">
          <p>No Uploads</p>
        </div>
      )}
    </div>
  );
}
async function TabFeedsImagesUploads({ isOwner, user, searchParams }: Props) {
  if (!user?.address) {
    return <div>No Uploads</div>;
  }

  return (
    <div className="relative grid h-auto">
      <FeedList
        postType={"feed-images"}
        minter={user?.address?.toLowerCase()}
        category={searchParams?.category}
        range={searchParams?.range}
        sort={searchParams?.sort}
        type={searchParams?.type}
        q={searchParams?.q}
      />
    </div>
  );
}
async function TabFeedSimpleUploads({ isOwner, user, searchParams }: Props) {
  if (!user?.address) {
    return <div>No Uploads</div>;
  }

  return (
    <div className="relative grid h-auto">
      <FeedList
        postType={"feed-simple"}
        minter={user?.address?.toLowerCase()}
        category={searchParams?.category}
        range={searchParams?.range}
        type={searchParams?.type}
        q={searchParams?.q}
      />
    </div>
  );
}
async function TabFeedAllUploads({ isOwner, user, searchParams }: Props) {
  if (!user?.address) {
    return <div>No Uploads</div>;
  }

  return (
    <div className="relative grid h-auto">
      <FeedList
        postType={"feed-all"}
        minter={user?.address?.toLowerCase()}
        category={searchParams?.category}
        range={searchParams?.range}
        type={searchParams?.type}
        q={searchParams?.q}
      />
    </div>
  );
}

async function TabUserActivity({ isOwner, user }: Props) {
  if (!user?.address) {
    return <div>No Activity</div>;
  }
  const res: any = await getUserActivity(user?.address);
  return (
    <div className="mx-auto min-w-[calc((600/16)*1rem)] max-w-[calc((600/16)*1rem)]">
      <div className="flex   flex-col justify-center gap-3">
        {res?.data?.map((data: any, key: number) => {
          const postType = data.nft[0]?.postType ?? "video";
          const isVideo = data.nft.length > 0 && postType === "video";
          const isFeed =
            (data.nft.length > 0 && postType === "feed-simple") || postType === "feed-images";
          return (
            <ActivityCard key={key} data={data} type={data.type} isOwner={isOwner}>
              {isVideo && <StreamItem nft={data.nft[0]} isOwner={isOwner} />}
              {isFeed && <FeedItem feed={data.nft[0]} />}
            </ActivityCard>
          );
        })}
      </div>
    </div>
  );
}
// Mapping Tabs
const tabComponents: Record<string, React.FC<Props>> = {
  video: TabVideoUploads,
  "feed-images": TabFeedsImagesUploads,
  "feed-all": TabFeedAllUploads,
  "feed-simple": TabFeedSimpleUploads,
  "user-activity": TabUserActivity
};

export default async function ProfileTabViewServer(props: any) {
  // Extract query parameters from request headers
  const activeTab = props.activeTab ?? "video"; // Default to "video"
  const TabComponent = tabComponents[activeTab] || (() => <div>Invalid Tab</div>);
  return (
    <div className="mt-12 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
      <div className="w- h-auto">
        <TabComponent
          user={props.user}
          isOwner={props.isOwner}
          activeTab={activeTab}
          searchParams={props.searchParams}
        />
      </div>
    </div>
  );
}
