import "server-only";

import type { User } from "@/stores";

import { UserUploads } from "@/app/components/user-uploads";
import { SocialLinks } from "@/app/me/components/social-links";

import { getNFTs } from "@/services/nfts/trending";

import { ProfileAction } from "./profile-action";
import { Banner, UserAvater } from "./profile-images";
import { UserDescription, UserFollowingInfo, UsernameBox } from "./user-info";

type Props = {
  username: string;
  user: User;
};

export async function Profile(props: Props) {
  const { username, user } = props;

  const res = await getNFTs({
    minter: user.address,
    unit: 40,
    address: user.address
  });

  return (
    <main className="flex h-auto min-h-screen w-full items-start justify-between overflow-hidden px-8 py-28">
      <div className="h-auto w-full">
        <Banner user={user} />
        <SocialLinks user={user} />
        <UserAvater user={user} />

        <div className="mt-10 flex h-auto w-full items-start justify-between">
          <div className="flex size-auto flex-col items-start justify-start gap-10">
            <UsernameBox user={user} />
            <ProfileAction user={user} username={username} />
            <UserFollowingInfo user={user} />
            <UserDescription user={user} />
          </div>
        </div>
        <UserUploads nfts={res.success ? res.data.result : []} />
      </div>
    </main>
  );
}
