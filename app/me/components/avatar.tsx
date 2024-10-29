"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Camera } from "lucide-react";

import { Avatar as _Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { createAvatarName } from "@/libs/utils";

import { getAvatarUrl } from "@/web3/utils/url";

import {
  croppedAvatarAtom,
  initiateCroppingAvatarAtom,
  profileModeAtom
} from "@/stores/atoms/profile";

type Props = { url?: string; name: string };

function AvatarPicker() {
  const initiateCroppingAvatar = useSetAtom(initiateCroppingAvatarAtom);

  return (
    <div className="absolute left-0 top-0 grid size-full place-items-center bg-black/50">
      <Camera className="size-10" />
      <input
        type="file"
        name="avatar-image"
        id="avatar-image"
        className="absolute left-0 top-0 z-10 size-full cursor-pointer opacity-0"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          initiateCroppingAvatar({ pickedAvatar: file });
        }}
      />
    </div>
  );
}

export function Avatar(props: Props) {
  const { url, name } = props;

  const croppedAvatar = useAtomValue(croppedAvatarAtom);
  const profileMode = useAtomValue(profileModeAtom);

  const imageSrc = croppedAvatar || getAvatarUrl(url || "");

  return (
    <_Avatar className="relative z-[2] -mt-36 ml-8 size-32 sm:-mt-44 sm:ml-12 sm:size-44">
      <ImageWithLoader url={imageSrc} alt={name} />
      <AvatarFallback>{createAvatarName(name || "Me")}</AvatarFallback>
      {profileMode === "edit" && <AvatarPicker />}
    </_Avatar>
  );
}

function ImageWithLoader(props: { url: string; alt: string }) {
  const { url, alt } = props;
  const [loading, setLoading] = useState(true);
  return (
    <>
      <AvatarImage
        src={url}
        alt={alt}
        className="rounded-full object-cover"
        onLoad={() => setLoading(false)}
      />
      {loading && (
        <div className="absolute inset-0 size-full bg-gray-300 dark:bg-theme-mine-shaft-dark">
          <div className="shimmer size-full" />
        </div>
      )}
    </>
  );
}
