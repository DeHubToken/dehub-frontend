import { env } from "@/configs";

export function getImageUrl(url: string, width?: number, height?: number) {
  if (!url) return "";
  const protocol = url.split(":")[0];
  const q = width && height ? `?w=${width}&h=${height}` : "";
  if (protocol === "http") {
    return url + q;
  }
  try {
    return new URL(env.apiBaseUrl!).origin + "/" + url + q;
  } catch (err) {
    return url + q;
  }
}

export function getAvatarUrl(url: string) {
  if (!url) return "/images/default-avatar.png";
  return new URL(env.apiBaseUrl!).origin + "/" + url;
}
