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
        <div className="absolute inset-0 size-full bg-theme-neutrals-800 dark:bg-theme-mine-shaft-dark">
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
      <Avatar className="relative h-0 w-full overflow-hidden rounded-3xl pt-[56.25%] sm:h-[400px] sm:pt-0">
        <AvatarImageWithLoader
          src={getCoverUrl(user.coverImageUrl || "") || ""}
          alt={user?.username}
          className="absolute left-0 top-0 size-full object-cover"
        />
        <AvatarFallback className="absolute left-0 top-0 size-full rounded-none bg-theme-neutrals-700 text-3xl capitalize dark:bg-gradient-to-br dark:from-slate-900 dark:to-zinc-700">
          {createAvatarName(user?.username || user.displayName || "").toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export function UserAvater(props: Props) {
  const { user } = props;
  return (
    <Avatar className="relative z-[2] -mt-36 ml-6 size-32 sm:-mt-44 sm:ml-12 sm:size-44">
      <AvatarImageWithLoader
        src={getAvatarUrl(user.avatarImageUrl || "") || ""}
        alt={user?.username}
      />
      <AvatarFallback className="border border-gray-200 bg-theme-mine-shaft-dark capitalize dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
        {createAvatarName(user?.username || user.displayName || "")}
      </AvatarFallback>
    </Avatar>
  );
}
