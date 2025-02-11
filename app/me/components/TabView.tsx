import { FeedList } from "@/app/components/feed-list";
import { StreamItem } from "@/app/components/stream-item";  
import { getNFTs } from "@/services/nfts/trending"; 
interface Props {
  user?: { address?: string };
  isOwner: boolean;
  activeTab: string;
}

async function TabVideoUploads({ isOwner, user }: Props) {
  if (!user?.address) {
    return <div>No Uploads</div>;
  }

  const res = await getNFTs({
    minter: user.address,
    unit: 40,
    address: user.address,
    postType: "video"
  });

  const data = res.success ? res.data.result : [];

  return (
    <div className="relative grid h-auto w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-5">
      {data.length > 0 ? (
        data.map((nft, index) => (
          <StreamItem  nft={nft} key={nft.tokenId + "--" + index} isOwner={isOwner} />
        ))
      ) : (
        <div className="flex h-[300px] w-full flex-col items-center justify-center lg:h-[650px]">
          <p>No Uploads</p>
        </div>
      )}
    </div>
  );
}
async function TabFeedsImagesUploads({ isOwner, user }: Props) {
  if (!user?.address) {
    return <div>No Uploads</div>;
  }

  return (
    <div className="relative grid h-auto">
      <FeedList minter={user?.address?.toLowerCase()} postType={"feed-images"} />
    </div>
  );
}
async function TabFeedSimpleUploads({ isOwner, user }: Props) {
  if (!user?.address) {
    return <div>No Uploads</div>;
  }

  return (
    <div className="relative grid h-auto">
      <FeedList minter={user?.address?.toLowerCase()} postType={"feed-simple"} />
    </div>
  );
}

const TabUserReports = () => <div>No User Reports</div>;

// Mapping Tabs
const tabComponents: Record<string, React.FC<Props>> = {
  video: TabVideoUploads,
  "feed-images": TabFeedsImagesUploads,
  "feed-simple": TabFeedSimpleUploads,
  "user-reports": TabUserReports
};

export default async function ProfileTabViewServer({ activeTab, isOwner, user }: Props) {
  const TabComponent = tabComponents[activeTab] || (() => <div>Invalid Tab</div>);

  return (
    <div className="mt-12 flex h-auto w-full flex-col items-start justify-start gap-14 pb-14">
      <div className="h-auto w-full">
        <TabComponent user={user} isOwner={isOwner} activeTab={activeTab} />
      </div>
    </div>
  );
}
