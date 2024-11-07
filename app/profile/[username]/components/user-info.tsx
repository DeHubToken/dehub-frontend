import "server-only";

import type { User } from "@/stores";

import { Badge } from "@/components/ui/badge";

import { formatToUsDate } from "@/libs/date-time";

type Props = {
  user: User;
};

export function UserFollowingInfo(props: Props) {
  const { user } = props;
  return (
    <div className="flex size-auto max-w-screen-xs flex-wrap items-start justify-start gap-4">
      <Badge variant="secondary" className="px-4 text-[11px]">
        <span>Followers</span> <span>{user.followers?.length || 0}</span>
      </Badge>
      <Badge variant="secondary" className="px-4 text-[11px]">
        <span>Following</span> <span>{user.followings?.length || 0}</span>
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
  );
}

export function UserDescription(props: Props) {
  const { user } = props;
  return (
    <div className="size-auto space-y-4">
      <p className="max-w-screen-xs text-sm">{user.aboutMe || "No description"}</p>

      {user.createdAt ? (
        <p className="text-sm">Joined at {formatToUsDate(user.createdAt)}</p>
      ) : (
        "No joined yet"
      )}
    </div>
  );
}
