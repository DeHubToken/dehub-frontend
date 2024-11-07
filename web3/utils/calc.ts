import { badges, devFee, streamInfoKeys, supportedTokens } from "@/configs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getTotalBountyAmount = (streamInfo: any, bAddFee = false) => {
  if (!streamInfo[streamInfoKeys.isAddBounty]) return 0;
  const bountyToken = supportedTokens.find(
    (e) =>
      e.chainId === streamInfo[streamInfoKeys.addBountyChainId] &&
      e.symbol === streamInfo[streamInfoKeys.addBountyTokenSymbol]
  );
  if (!bountyToken) return 0;
  const amount =
    streamInfo[streamInfoKeys.addBountyAmount] *
    (Number(streamInfo[streamInfoKeys.addBountyFirstXComments]) +
      Number(streamInfo[streamInfoKeys.addBountyFirstXViewers])) *
    (bAddFee ? 1 + devFee : 1);
  const precision = 5;
  return Math.round(amount * 10 ** precision) / 10 ** precision;
};

export const getBadge = (stakingAmount: number) => {
  if (!stakingAmount) return badges[0];
  let curBadge = badges[0];
  for (const badge of badges) {
    curBadge = badge;
    if (stakingAmount < badge.amount) return curBadge;
  }
  return curBadge;
};

export const getBadgeUrl = (stakingAmount: number | string, theme = 'light') =>{
  const badge  = typeof stakingAmount === 'string' ? stakingAmount : getBadge(stakingAmount as number).name;
  return theme === "dark" 
    ? `/icons/badge_white/${badge}.png`
    : `/icons/badge/${badge}.png`;
}

export const sleep = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
