"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { LazyImage } from "@/components/image";
import { Button } from "@/components/ui/button";

import { getCoverUrl } from "@/web3/utils/url";

import { croppedBannerAtom, initiateCroppingBannerAtom } from "@/stores/atoms/profile";

import { ProfileModeSwitcher } from "./profile-mode-switcher";

/* ================================================================================================= */

type Props = { url?: string };

function Figure(props: { url: string }) {
  const { url } = props;
  const [loading, setLoading] = useState(true);

  return (
    <figure className="relative h-0 w-full overflow-hidden rounded-3xl bg-theme-mine-shaft-dark dark:bg-theme-mine-shaft-dark pt-[56.25%] sm:h-[400px] sm:pt-0">
      {url && (
        <LazyImage
          src={url}
          alt="Banner Picture"
          className="absolute left-0 top-0 size-full object-cover"
          onLoad={() => setLoading(false)}
        />
      )}
      {loading && (
        <div className="absolute top-0 z-[1] size-full   dark:bg-theme-mine-shaft-dark">
          <div className="shimmer size-full" />
        </div>
      )}
    </figure>
  );
}

function FigureWithBackdrop(props: { url: string; children: React.ReactNode }) {
  const { url, children } = props;
  return (
    <figure className="relative h-0 w-full overflow-hidden rounded-3xl bg-theme-cloud-burst dark:bg-theme-mine-shaft-dark pt-[56.25%] sm:h-[400px] sm:pt-0">
      {children}
      {url && (
        <>
          <div className="absolute inset-0 size-full bg-black/30" />
          <LazyImage
            src={url}
            alt="Banner Picture"
            className="absolute left-0 top-0 size-full object-cover"
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
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
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
