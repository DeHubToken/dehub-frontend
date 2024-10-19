import "server-only";

import type { User } from "@/stores";

import { UserUploads } from "@/app/components/user-uploads";

import { getNFTs } from "@/services/nfts/trending";

import { Avatar } from "./avatar";
import { Banner } from "./banner";
import { EditProfileButton } from "./edit-profile";
import { ImageCropperModal } from "./image-cropper-modal";
import { SocialLinks } from "./social-links";
import { UserInfo } from "./user-info";

/* ================================================================================================= */

type Props = { user: User };

export async function Profile(props: Props) {
  const { user } = props;
  const res = await getNFTs({
    minter: user.address,
    unit: 40,
    address: user?.address
  });

  return (
    <div className="h-auto w-full overflow-hidden">
      <div className="relative h-auto w-full">
        <Banner url={user.coverImageUrl} />
        <EditProfileButton />
      </div>

      <SocialLinks user={user} />
      <Avatar name={user.username || user.displayName || ""} url={user.avatarImageUrl} />
      <UserInfo user={user} />
      <ImageCropperModal />
      <UserUploads nfts={res.success ? res.data.result : []} isOwner={true} />
    </div>
  );
}
