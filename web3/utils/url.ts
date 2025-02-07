import { useActiveWeb3React } from "@/hooks/web3-connect";

import objectToGetParams from "@/libs/utils";

import { env } from "@/configs";

export function getImageUrl(url: string, width?: number, height?: number) {
  if (!url) return "";

  // Extract the filename from the URL
  const fileName = url.split("/").pop(); // Get the last segment of the URL
  const protocol = url.split(":")[0];
  const q = width && height ? `?w=${width}&h=${height}` : "";

  if (protocol === "http") {
    return url + q;
  }

  try {
    return env.NEXT_PUBLIC_CDN_BASE_URL + "images/" + fileName + q; // Use the extracted filename
  } catch (err) {
    return url + q; // Fallback to the original URL
  }
}
export function getImageUrlApi(
  tokenId: string | number,
  address?: string,
  width?: number,
  height?: number
) {
  const q = width && height ? `&w=${width}&h=${height}` : "";
  return env.NEXT_PUBLIC_API_BASE_URL + "/nfts/images/" + +tokenId + "?address" + address + q;
}
export function getImageUrlApiSimple(url: string) {
  return env.NEXT_PUBLIC_API_BASE_URL + "/" + url;
}

export function getAvatarUrl(url: string) {
  if (!url) return "/images/default-avatar.png";

  const fileName = url.split("/").pop();

  return `${env.NEXT_PUBLIC_CDN_BASE_URL}/avatars/${fileName}`;
}

export function getGroupAvatarUrl(url: string) {
  if (!url) return "/icons/team.png";

  const fileName = url.split("/").pop();

  return `${env.NEXT_PUBLIC_CDN_BASE_URL}/avatars/${fileName}`;
}

export function getCoverUrl(url: string) {
  if (!url) return "/images/default-banner.png";
  const fileName = url.split("/").pop();

  return `${env.NEXT_PUBLIC_CDN_BASE_URL}/covers/${fileName}`;
}
export function dmMediaUrl(url: string, h?: number, w?: number) {
  const queryParams = new URLSearchParams();
  if (h) queryParams.append("h", h.toString());
  if (w) queryParams.append("w", w.toString());

  return queryParams.toString()
    ? `${env.NEXT_PUBLIC_CDN_BASE_URL}${url}?${queryParams.toString()}`
    : `${env.NEXT_PUBLIC_CDN_BASE_URL}${url}`;
}

export function commentImageUrl(url: string) {
  return `${env.NEXT_PUBLIC_CDN_BASE_URL}${url}`;
}
