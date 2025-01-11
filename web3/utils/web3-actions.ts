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
    if (!data) {
      setCookie(cookieKey, JSON.stringify({ [account]: { timestamp, sig } }), 1);
    } else {
      const dataObject = JSON.parse(data);
      dataObject[account] = { timestamp, sig };
      setCookie(cookieKey, JSON.stringify(dataObject), 1);
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
