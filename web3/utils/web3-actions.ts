// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getCookie, setCookie } from "@/libs/cookie";

import { env, expireSignTime } from "@/configs";

import { performPersonalSign } from "./sign";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSignInfo = async (library: any, account: string) => {
  const cookieKey = env.isDevMode ? "data_dev" : "data_v2";
  let data = getCookie(cookieKey);
  try {
    data = data ? JSON.parse(data) : undefined;
  } catch (e) {
    data = null;
  }

  let timestamp = data?.[account]?.timestamp;
  let sig = data?.[account]?.sig;
  const curTime = Math.floor(Date.now() / 1000);

  if (!timestamp || timestamp <= curTime - expireSignTime) {
    timestamp = curTime;
    const displayedDate = new Date(timestamp * 1000);
    const signMessage = `Welcome to DeHub!\n\nClick to sign in for authentication.\nSignatures are valid for ${expireSignTime / 3600} hours.\nYour wallet address is ${account.toLowerCase()}.\nIt is ${displayedDate.toUTCString()}.`;
    sig = await performPersonalSign(library, account, signMessage);

    data = getCookie(cookieKey);
    let dataObject;
    setCookie(cookieKey,"")
    if (!data) {
      // If no existing data, create a new one with the current account active
      dataObject = { [account]: { timestamp, sig, isActive: true } };
    } else {
      // Parse existing data and update
      dataObject = JSON.parse(data);
      Object.keys(dataObject).forEach((key) => {
        dataObject[key].isActive = false; // Set all other accounts to inactive
      });
      dataObject[account] = { timestamp, sig, isActive: true }; // Set the current account to active
    }

    setCookie(cookieKey, JSON.stringify(dataObject), 1); // Update the cookie with new data
  }

  return { error: false, sig, timestamp };
};
