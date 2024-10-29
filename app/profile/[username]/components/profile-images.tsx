"use client";

import type { User } from "@/stores";

import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl, getCoverUrl } from "@/web3/utils/url";

type Props = {
  user: User;
};

function AvatarImageWithLoader(props: React.ComponentProps<typeof AvatarImage>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!props.src) {
      setLoading(false);
    }
  }, [props.src]);

  return (
    <>
      <AvatarImage {...props} onLoad={() => setLoading(false)} />
      {loading && (
        <div className="absolute inset-0 size-full bg-gray-300 dark:bg-theme-mine-shaft-dark">
          <div className="shimmer size-full" />
        </div>
      )}
    </>
  );
}

export function Banner(props: Props) {
  const { user } = props;

  return (
    <div className="relative h-auto w-full">
      <Avatar className="relative h-auto max-h-[200px] min-h-[200px] w-full overflow-hidden rounded-3xl sm:max-h-[300px] sm:min-h-[300px]">
        <AvatarImageWithLoader
          src={getCoverUrl(user.coverImageUrl || "") || ""}
          alt={user?.username}
          className="size-full max-h-[300px] min-h-[300px] object-cover"
        />
        <AvatarFallback className="size-full max-h-[200px] min-h-[200px] rounded-none bg-gradient-to-br from-slate-900 to-zinc-700 text-3xl sm:max-h-[300px] sm:min-h-[300px]">
          {createAvatarName(user?.username || user.displayName || "").toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export function UserAvater(props: Props) {
  const { user } = props;
  return (
    <Avatar className="relative z-[2] -mt-36 ml-8 size-32 sm:-mt-44 sm:ml-12 sm:size-44">
      <AvatarImageWithLoader
        src={getAvatarUrl(user.avatarImageUrl || "") || ""}
        alt={user?.username}
      />
      <AvatarFallback className="border border-gray-200 bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
        {createAvatarName(user?.username || user.displayName || "")}
      </AvatarFallback>
    </Avatar>
  );
}
