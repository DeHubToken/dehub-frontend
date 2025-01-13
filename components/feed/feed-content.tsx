import Image from "next/image";
import ImagePlacehoder from "@/assets/image-placeholder.png";
import { useAtomValue } from "jotai";
import { getStreamStatus } from "@/web3/utils/validators";
import { userAtom } from "@/stores";
import { useActiveWeb3React } from "@/hooks/web3-connect";

interface Props {
  description: string;
  name: string;
  feed?: boolean
}
export function FeedContent({ name, description, feed }: Props) {
  const user = useAtomValue(userAtom);
  const { chainId } = useActiveWeb3React();
  const streamStatus = getStreamStatus(feed, user, chainId);
const blur =   streamStatus?.streamStatus?.isLockedWithPPV
  return (
    <div className="flex flex-col gap-3">
      <p>{name}</p>
      <p className={`text-theme-monochrome-300 text-base max-h-40 overflow-scroll ${blur ? 'blur-sm' : null}`}>{description}</p>
    </div>
  );
}
