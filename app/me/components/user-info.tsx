import "server-only";

import type { User } from "@/stores/atoms/user";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import { formatToUsDate } from "@/libs/date-time";

import { AccountInformationForm } from "./account-information-form";
import { ProfileModeSwitcher } from "./profile-mode-switcher";
import TokensList from "./token-list";

type Props = { user: User };

function InformationPanel(props: Props) {
  const { user } = props;
  return (
    <div className="mt-8 flex h-auto w-full flex-col items-start justify-between gap-6 md:flex-row md:gap-0">
      <div className="flex size-auto flex-col items-start justify-start gap-8">
        <div className="size-auto space-y-2">
          <div className="flex size-auto items-start justify-start gap-4 sm:items-center sm:gap-6">
            <h1 className="w-3/5 text-2xl font-semibold sm:w-auto">
              {user.displayName || user?.username || "No name"}{" "}
              {user.displayName && <span className="text-sm">({user?.username})</span>}
            </h1>
            <Image src="/star.svg" alt="verified" width={20} height={20} className="size-8" />
          </div>
          <p className="text-sm">{user.address}</p>
        </div>

        <div className="flex size-auto max-w-screen-xs flex-wrap items-start justify-start gap-4">
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Followers</span> <span>{user?.followers?.length || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Following</span> <span>{user?.followings?.length || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Likes</span> <span>{user.likes?.length || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Tips earned</span> <span>{user.receivedTips || 0}</span>
          </Badge>
          <Badge variant="secondary" className="px-4 text-[11px]">
            <span>Tips given</span> <span>{user.sentTips || 0}</span>
          </Badge>
        </div>

        <div className="size-auto space-y-4">
          <p className="max-w-screen-xs text-sm">{user.aboutMe || "No description"}</p>

          {user.createdAt ? (
            <p className="text-sm">{formatToUsDate(user.createdAt)}</p>
          ) : (
            "Not joined yet"
          )}
        </div>
      </div>

      <TokensList />
    </div>
  );
}

export function UserInfo(props: Props) {
  const { user } = props;

  return (
    <ProfileModeSwitcher
      view={<InformationPanel user={user} />}
      edit={<AccountInformationForm user={user} />}
    />
  );
}
