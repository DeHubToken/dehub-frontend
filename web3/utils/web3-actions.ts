// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getCookie, setCookie } from "@/libs/cookie";

import { env, expireSignTime, isDevMode } from "@/configs";

import { performPersonalSign } from "./sign";
import { ethers } from "ethers";

export const getSignInfo = async (library: any, account: string) => {
  const cookieKey = isDevMode ? "data_dev" : "data_v2";
  const curTime = Math.floor(Date.now() / 1000);

  // Helper to safely parse JSON
  const safeParseJSON = (str: string | null) => {
    try {
      return str ? JSON.parse(str) : undefined;
    } catch {
      return undefined;
    }
  };

  // Retrieve and parse existing cookie data
  let data = safeParseJSON(getCookie(cookieKey));
  let timestamp = data?.[account]?.timestamp;
  let sig = data?.[account]?.sig;

  const isValidSignature = (address: string, timestamp: number, sig: string): boolean => {
    if (!sig || !address || !timestamp) {
      return false;
    }
    const displayedDate = new Date(timestamp * 1000).toUTCString();
    const signMessage = `Welcome to DeHub!\n\nClick to sign in for authentication.\nSignatures are valid for ${
        expireSignTime / 3600
      } hours.\nYour wallet address is ${address.toLowerCase()}.\nIt is ${displayedDate}.`;

    try {
      const signedAddress = ethers.utils.verifyMessage(signMessage, sig).toLowerCase();
      const nowTime = Math.floor(Date.now() / 1000);
      if (nowTime - expireSignTime > timestamp || signedAddress !== address.toLowerCase()) {
        return false;
      }
      return true;
    } catch (e) {
      console.error('Error verifying account:', e);
      return false;
    }
  };

  if (!timestamp || timestamp <= curTime - expireSignTime || !isValidSignature(account, timestamp, sig)) {
    try {
      // Update timestamp and create the sign message
      timestamp = curTime;
      const displayedDate = new Date(timestamp * 1000).toUTCString();
      const signMessage = `Welcome to DeHub!\n\nClick to sign in for authentication.\nSignatures are valid for ${
        expireSignTime / 3600
      } hours.\nYour wallet address is ${account.toLowerCase()}.\nIt is ${displayedDate}.`;

      // Perform personal sign
      sig = await performPersonalSign(library, account, signMessage);

      // Ensure data is initialized as an object
      data = data || {};
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          data[key].isActive = false; // Mark all other accounts as inactive
        }
      });

      // Update or create entry for the current account
      data[account] = { timestamp, sig, isActive: true };

      // Store updated data in the cookie
      setCookie(cookieKey, JSON.stringify(data), 1); // Expire in 1 day
    } catch (error) {
      console.error("Error during signing process:", error.message);
      return { error: true, message: error.message };
    }
  }

  return { error: false, sig, timestamp };
};

export const getAuthParams = async (Library: any, account: string) =>{
  const sigData = await getSignInfo(Library, account)
  const { sig, timestamp } = sigData
  return `?address=${account?.toLowerCase()}&sig=${sig}&timestamp=${timestamp}`
}

export const getAuthObject = async (Library: any, account: string) =>{
  const sigData = await getSignInfo(Library, account)
  const { error, ...data } = sigData
  return { address: account.toLocaleLowerCase(), ...data}
}
