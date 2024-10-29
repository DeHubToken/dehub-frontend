"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { LazyImage } from "@/components/image";
import { Button } from "@/components/ui/button";

import { getCoverUrl, getImageUrl } from "@/web3/utils/url";

import { croppedBannerAtom, initiateCroppingBannerAtom } from "@/stores/atoms/profile";

import { ProfileModeSwitcher } from "./profile-mode-switcher";

/* ================================================================================================= */

type Props = { url?: string };

function Figure(props: { url: string }) {
  const { url } = props;
  const [loading, setLoading] = useState(true);

  return (
    <figure className="max-h-auto relative h-auto min-h-[125px] w-full overflow-hidden rounded-3xl bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark sm:max-h-[300px] sm:min-h-[300px]">
      {url && (
        <LazyImage
          src={url}
          alt="Banner Picture"
          className="max-h-auto size-full min-h-[125px] object-cover sm:max-h-[300px] sm:min-h-[300px]"
          onLoad={() => setLoading(false)}
        />
      )}
      {loading && (
        <div className="absolute top-0 z-[1] size-full bg-gray-300 dark:bg-theme-mine-shaft-dark">
          <div className="shimmer size-full" />
        </div>
      )}
    </figure>
  );
}

function FigureWithBackdrop(props: { url: string; children: React.ReactNode }) {
  const { url, children } = props;
  return (
    <figure className="max-h-auto relative flex h-auto min-h-[125px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl sm:max-h-[300px] sm:min-h-[300px]">
      {children}
      {url && (
        <>
          <div className="absolute inset-0 size-full bg-black/30" />
          <LazyImage
            src={url}
            alt="Banner Picture"
            className="max-h-auto size-full min-h-[125px] object-cover sm:max-h-[300px] sm:min-h-[300px]"
          />
        </>
      )}
    </figure>
  );
}

function UploadBanner() {
  const initiateCroppingBanner = useSetAtom(initiateCroppingBannerAtom);

  return (
    <>
      <input
        id="banner-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          initiateCroppingBanner({ pickedBanner: file });
        }}
      />
      <Button
        asChild
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 translate-y-1/2 cursor-pointer"
      >
        <label htmlFor="banner-upload">Upload banner</label>
      </Button>
    </>
  );
}

export function Banner(props: Props) {
  const { url } = props;
  const fullUrl = url ? getCoverUrl(url) : "";

  const croppedBanner = useAtomValue(croppedBannerAtom);

  const imageSrc = croppedBanner || fullUrl;

  return (
    <ProfileModeSwitcher
      view={<Figure url={fullUrl} />}
      edit={
        <FigureWithBackdrop url={imageSrc}>
          <UploadBanner />
        </FigureWithBackdrop>
      }
    />
  );
}
