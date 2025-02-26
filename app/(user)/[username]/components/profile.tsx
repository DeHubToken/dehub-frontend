import "server-only";

import type { User } from "@/stores";

import { UserUploads } from "@/app/components/user-uploads";
import ProfileTabView from "@/app/me/components/profile-tabs";
import { SocialLinks } from "@/app/me/components/social-links";

import { getNFTs } from "@/services/nfts/trending";

import { ProfileAction } from "./profile-action";
import { Banner, UserAvater } from "./profile-images";
import { UserDescription, UserFollowingInfo } from "./user-info";
import { UsernameBox } from "./username-box";

type Props = {
  username: string;
  user: User;
  searchParams: any;
};

export async function Profile(props: Props) {
  const { username, user, searchParams } = props; 
  const res = await getNFTs({
    minter: user.address,
    unit: 40,
    address: user.address,
    postType: "video"
  });

  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between overflow-hidden px-4 py-20 sm:px-8 sm:py-28">
      <div className="h-auto w-full">
        <Banner user={user} />
        <SocialLinks user={user} />
        <UserAvater user={user} />

        <div className="mt-5 flex h-auto w-full items-start justify-between sm:mt-10">
          <div className="flex w-full flex-col items-start justify-start gap-6 sm:gap-10">
            <UsernameBox user={user} />
            <ProfileAction user={user} username={username} aboutMe={user?.aboutMe} />
            <UserFollowingInfo user={user} />
            <UserDescription user={user} />
          </div>
        </div> 
        <ProfileTabView  searchParams={searchParams} user={user} isOwner={false}  />
      </div>
    </main>
  );
}
