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

export const getExplorerUrl = (chainId: number, hash: string) => {
  const explorers: Record<number, string> = {
    56: "https://bscscan.com/tx/",
    97: "https://testnet.bscscan.com/tx/",
    1: "https://etherscan.io/tx/",
    5: "https://goerli.etherscan.io/tx/",
    137: "https://polygonscan.com/tx/",
    80001: "https://mumbai.polygonscan.com/tx/",
    // Add more as needed
  };

  const baseUrl = explorers[chainId] || "https://explorer.unknown/tx/";
  return `${baseUrl}${hash}`;
};