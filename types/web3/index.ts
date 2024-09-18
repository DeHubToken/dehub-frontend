export interface NFTStakingInfo {
  tDividETH: number;
  tStakedBoredM: number;
  mStakedBoredM: number;
  mEarnedETH: number;
  mClaimedETH: number;
  mClaimableETH: number;
  tDividETHLock: number;
  tStakedBoredMLock: number;
  mStakedBoredMLock: number;
  mEarnedETHLock: number;
  mClaimedETHLock: number;
  mClaimableETHLock: number;
  mTimestampLock: number;
  mPercentFree: number;
  mPercentLock: number;
}

export interface BNBStakingInfo {
  balance: number;
  myShares: number;
  myEarnedBNB: number;
}
