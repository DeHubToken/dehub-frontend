import type { BigNumber } from "@ethersproject/bignumber";

import { ethers, utils } from "ethers";

import { streamInfoKeys } from "@/configs";

import { supportedNetworks } from "../configs";

export function getReadableNumber(
  numberData: number | string | BigNumber | null | undefined,
  decimals = 18
) {
  try {
    if (!numberData?.toString() || numberData.toString().indexOf("--") > -1) return "0";
    if (typeof decimals === "undefined") return "0";
    const readableNumberString = utils.formatUnits(numberData?.toString(), decimals).toString();
    return readableNumberString;
  } catch (error) {
    // TODO: Handle error
  }
  return "0";
}

export function formatNumber(value?: number, precise = 2) {
  if (value) {
    if (value > 1000_000) return `${Number((value / 1000_000).toFixed(precise)).toString()} M`;
    if (value > 1000) return `${Number((value / 1000).toFixed(precise)).toString()} K`;
    return Number(value.toFixed(precise)).toString();
  }
  return "0";
}

export function toBigAmount(
  amount: number,
  token: {
    decimals: number;
  }
) {
  if (!amount || !token) return ethers.BigNumber.from(0);
  return ethers.utils.parseUnits(amount.toString(), token.decimals);
}

export function getTransactionLink(chainId: number, txHash: string) {
  const chainData = supportedNetworks.find(
    (network) => network.chainId.toString() === chainId.toString()
  );
  if (!chainData) return null;
  if (txHash) {
    return `${chainData.explorerUrl}/tx/${txHash}`;
  }
  return `${chainData.explorerUrl}`;
}

export const filteredStreamInfo = (streamInfo: Record<string, unknown>) => {
  if (!streamInfo) return undefined;
  if (!streamInfo?.[streamInfoKeys.isAddBounty]) {
    delete streamInfo?.[streamInfoKeys.addBountyTokenSymbol];
    delete streamInfo?.[streamInfoKeys.addBountyChainId];
    delete streamInfo?.[streamInfoKeys.addBountyAmount];
  }
  if (!streamInfo?.[streamInfoKeys.isLockContent]) {
    delete streamInfo?.[streamInfoKeys.lockContentAmount];
    delete streamInfo?.[streamInfoKeys.lockContentChainIds];
    delete streamInfo?.[streamInfoKeys.lockContentTokenSymbol];
  }
  if (!streamInfo?.[streamInfoKeys.isPayPerView]) {
    delete streamInfo?.[streamInfoKeys.payPerViewAmount];
    delete streamInfo?.[streamInfoKeys.payPerViewChainIds];
    delete streamInfo?.[streamInfoKeys.payPerViewTokenSymbol];
  }
  return streamInfo;
};

/**
 *
 * @param rawLink username or link
 * @param host for example, x.com
 */
export const getSocialLink = (rawLink: string, host: string): string => {
  if (!rawLink) return "#";
  const index = rawLink.indexOf(host);
  const pref = `https://${host}/`;
  if (index > 0) return rawLink;
  if (rawLink.substring(0, 1) === "@" && host !== "tiktok.com")
    return pref + rawLink.substring(1, rawLink.length);
  if (rawLink.substring(0, 1) !== "@" && host === "tiktok.com") return pref + "@" + rawLink;
  return pref + rawLink;
};

export function formatNotificationDate(isoDateString: Date) {
  const date = new Date(isoDateString);
  const now = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return formatTime(date) + ", Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return formatTime(date) + ", Yesterday";
  }

  return formatTime(date) + ", " + daysOfWeek[date.getDay()];
}

function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes}${ampm}`;
}
