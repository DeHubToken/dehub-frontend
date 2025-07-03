/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { getCookie, setCookie } from "@/libs/cookie";
import { env, expireSignTime, isDevMode } from "@/configs";
import { performPersonalSign } from "./sign";
import { ethers } from "ethers";

const COOKIE_KEY = isDevMode ? "data_dev" : "data_v2";

interface SignRecord {
  timestamp: number;
  sig: string;
  isActive: boolean;
}

interface CookieData {
  [address: string]: SignRecord;
}

/**
 * Parse JSON cookie data, or return empty object.
 */
export function readSignatureCookie(): CookieData {
  try {
    const raw = getCookie(COOKIE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Write cookie data with 1-day expiry.
 */
function writeCookie(data: CookieData) {
  setCookie(COOKIE_KEY, JSON.stringify(data), 1);
}

/**
 * Check if existing signature record is still valid.
 */
export function isSignatureValid(record: SignRecord, address: string): boolean {
  const { timestamp, sig } = record;
  if (!timestamp || !sig) return false;
  // Reconstruct message
  const displayedDate = new Date(timestamp * 1000).toUTCString();
  const msg =  `Welcome to DeHub!\n\nClick to sign in for authentication.\nSignatures are valid for ${
    expireSignTime / 3600
  } hours.\nYour wallet address is ${address.toLowerCase()}.\nIt is ${displayedDate}.`;
  try {
    const recovered = ethers.utils.verifyMessage(msg, sig).toLowerCase();
    const now = Math.floor(Date.now() / 1000);
    if (recovered !== address.toLowerCase()) return false;
    if (now - timestamp > expireSignTime) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure user has an active, valid signature. Returns {sig,timestamp} or throws.
 */
export async function getSignInfo(library: any, account: string): Promise<{ sig: string; timestamp: number }> {
  const data = readSignatureCookie();
  const existing = data[account];
  if (existing && existing.isActive && isSignatureValid(existing, account)) {
    return { sig: existing.sig, timestamp: existing.timestamp };
  }
  // Need to re-sign
  const timestamp = Math.floor(Date.now() / 1000);
  const displayedDate = new Date(timestamp * 1000).toUTCString();
  const msg =  `Welcome to DeHub!\n\nClick to sign in for authentication.\nSignatures are valid for ${
    expireSignTime / 3600
  } hours.\nYour wallet address is ${account.toLowerCase()}.\nIt is ${displayedDate}.`;
  const sig = await performPersonalSign(library, account, msg);
  // Mark all records inactive
  Object.values(data).forEach((rec) => (rec.isActive = false));
  data[account] = { timestamp, sig, isActive: true };
  writeCookie(data);
  return { sig, timestamp };
}

export const getAuthParams = async (library: any, account: string): Promise<string> => {
  const { sig, timestamp } = await getSignInfo(library, account);
  return `?address=${account.toLowerCase()}&sig=${encodeURIComponent(sig)}&timestamp=${timestamp}`;
};

export const getAuthObject = async (library: any, account: string): Promise<{ address: string; sig: string; timestamp: number }> => {
  const { sig, timestamp } = await getSignInfo(library, account);
  return { address: account.toLowerCase(), sig, timestamp };
};