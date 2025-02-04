import { atom } from "jotai";

import { env } from "@/configs";

export const profileModeAtom = atom<"view" | "edit">("view");
export const showCropperAtom = atom<boolean>(false);
export const croppingForAtom = atom<"avatar" | "banner">("avatar");

// Avatar picker
export const pickedAvatarAtom = atom<string | null>(null);
export const croppedAvatarAtom = atom<string | null>(null);
export const croppedAvatarFileAtom = atom<File | null>(null);
export const initiateCroppingAvatarAtom = atom(null, (get, set, update: { pickedAvatar: File }) => {
  const { pickedAvatar } = update;
  const blob = new Blob([pickedAvatar as BlobPart], { type: pickedAvatar.type });
  const url = URL.createObjectURL(blob);
  set(croppingForAtom, "avatar");
  set(pickedAvatarAtom, url);
  set(croppedAvatarFileAtom, pickedAvatar);
  set(showCropperAtom, true);
});

// Banner picker
export const pickedBannerAtom = atom<string | null>(null);
export const croppedBannerAtom = atom<string | null>(null);
export const croppedBannerFileAtom = atom<File | null>(null);
export const initiateCroppingBannerAtom = atom(null, (get, set, update: { pickedBanner: File }) => {
  const { pickedBanner } = update;
  const blob = new Blob([pickedBanner as BlobPart], { type: pickedBanner.type });
  const url = URL.createObjectURL(blob);
  set(croppingForAtom, "banner");
  set(pickedBannerAtom, url);
  set(croppedBannerFileAtom, pickedBanner);
  set(showCropperAtom, true);
});

export const getCroppedImageAtom = atom((get) => {
  const croppingFor = get(croppingForAtom);
  const avatar = get(pickedAvatarAtom);
  const banner = get(pickedBannerAtom);
  if (croppingFor === "avatar") return avatar;
  return banner;
});

export const saveCroppedImageAtom = atom(null, (get, set, update: { preview: string }) => {
  const { preview } = update;
  const croppingFor = get(croppingForAtom);
  if (croppingFor === "avatar") {
    set(croppedAvatarAtom, preview);
  } else {
    set(croppedBannerAtom, preview);
  }
  set(showCropperAtom, false);
});

export const changeProfileModeAtom = atom(null, (get, set) => {
  const mode = get(profileModeAtom);
  set(profileModeAtom, mode === "view" ? "edit" : "view");
  set(showCropperAtom, false);
  set(pickedAvatarAtom, null);
  set(croppedAvatarAtom, null);
  set(pickedBannerAtom, null);
  set(croppedBannerAtom, null);
});

export const getFilesAtom = atom((get) => {
  const avatarFile = get(croppedAvatarFileAtom);
  const bannerFile = get(croppedBannerFileAtom);
  return { avatarFile, bannerFile };
});

if (env.NODE_ENV !== "production") {
  profileModeAtom.debugLabel = "profileModeAtom";
  showCropperAtom.debugLabel = "showCropperAtom";
  pickedAvatarAtom.debugLabel = "pickedAvatarAtom";
  croppedAvatarAtom.debugLabel = "croppedAvatarAtom";
  pickedBannerAtom.debugLabel = "pickedBannerAtom";
  croppedBannerAtom.debugLabel = "croppedBannerAtom";
  croppingForAtom.debugLabel = "croppingForAtom";
  initiateCroppingAvatarAtom.debugLabel = "initiateCroppingAvatarAtom";
}
