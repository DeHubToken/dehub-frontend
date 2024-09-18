import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createAvatarName(name: string, spliter = " ") {
  if (!name) return "";
  return name
    .split(spliter)
    .map((n) => n[0])
    .join("");
}

function isEmpty(value: unknown) {
  return value === undefined || value === null || value === "";
}

/**
 * Convert an object to a query string
 *
 * @param object The object to convert
 * @returns The query string
 */
export default function objectToGetParams(object: {
  [key: string]: string | number | undefined | null;
}) {
  const params = Object.entries(object)
    .filter(([, value]) => !isEmpty(value))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join("&")}` : "";
}

export function removeUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T;
}
