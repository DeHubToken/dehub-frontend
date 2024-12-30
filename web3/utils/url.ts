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
    return env.cdnBaseUrl + "images/" + fileName + q; // Use the extracted filename
  } catch (err) {
    return url + q; // Fallback to the original URL
  }
}

export function getAvatarUrl(url: string) {
  if (!url) return "/images/default-avatar.png";

  const fileName = url.split("/").pop();

  return `${env.cdnBaseUrl}avatars/${fileName}`;
}

export function getCoverUrl(url: string) {
  if (!url) return "/images/default-banner.png";

  const fileName = url.split("/").pop();

  return `${env.cdnBaseUrl}covers/${fileName}`;
}
