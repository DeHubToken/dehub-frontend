/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Info } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

import Modal from "@/components/modals/staking-modal";
import UnStakeModal from "@/components/modals/unstake-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useActiveWeb3React } from "@/hooks/web3-connect";

// import {
//   allTotalStaked,
//   claim,
//   getStakedForAccounts,
//   lastTierOnIndex,
//   pendingReward,
//   stake,
//   stakingShares,
//   totalStakers,
//   tvl,
//   unlockDate,
//   unstake,
//   userMinPeriod,
//   userUnlockAt
// } from "../../../web3/utils/get";

export function StakingForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  //@ts-ignore
  const { account }: any = useActiveWeb3React();
  const [totalAllStaked, setAllTotalStaked] = useState<number | null>(null);
  const [totalStaked, setTotalStaked] = useState<number>(0);
  const [totalStakersCount, setTotalStakersCount] = useState<number | null>(null);
  const [stakingSharesPercent, setStakingSharesPercent] = useState<number | null>(null);
  const [lastTier, setLastTier] = useState<string | null>(null);
  const [lockDate, setUnlockDate] = useState<Date | null>(null);
  const [rewardPending, setRewardPending] = useState<number>(0);
  const [userUnlock, setUserUnlock] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [unstakeAmount, setUnStakeAmount] = useState<number>(0);
  const [stakePeriod, setStakePeriod] = useState<number>(30);
  const [unStakePeriod, setUnStakePeriod] = useState<number>(30);
  const [TVL, setTVL] = useState<string | null>(null);
  const [maxBalance, setMaxBalance] = useState(0);
  const [isTxPending, setIsTxPending] = useState(false);
  const [percentShortcuts, setPercentShortcuts] = useState([10, 25, 50, 75, 100]);
  const [minPeriod, setMinPeriod]: any = useState(600);
  const [maxPeriod, setMaxPeriod] = useState(365);
  const [hasStaked, setHasStaked] = useState(false);
  const [hasUnStaked, setHasUnStaked] = useState(false);
  const [isStakeButton, setIsStakeButton] = useState(false);
  const [isUnStakeButton, setIsUnStakeButton] = useState(false);
  const [isClaimButton, setIsClaimButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnStakeModalOpen, setIsUnStakeModalOpen] = useState(false);

  const handleMaxPeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxPeriod(Number(value));
  };

  //   const handleStake = async (account: string, stakeAmount: number, period: number) => {
  //     try {
  //       setIsStakeButton(true);
  //       const result = await stake(account, period, stakeAmount);
  //       if (!result) return;

  //       if (result.status === 1) {
  //         toast.success("Staked Successfully");
  //         fetchAll();
  //         setHasStaked(true);
  //       } else {
  //         toast.error("Staking failed. Please try again.");
  //       }
  //     } catch (e: any) {
  //       toast.error(e.message);
  //     } finally {
  //       setIsStakeButton(false);
  //       setIsModalOpen(false);
  //     }
  //   };

  //   const handleClaim = async () => {
  //     try {
  //       if (!account) {
  //         return;
  //       }
  //       setIsClaimButton(true);
  //       const result = await claim();

  //       if (result) {
  //         toast.success("Claim successful:");
  //         setHasStaked(false);
  //         window.location.reload();
  //       } else {
  //         toast.error("Claim failed.");
  //       }
  //     } catch (e: any) {
  //       toast.error(e.message);
  //     } finally {
  //       setIsClaimButton(false);
  //     }
  //   };

  //   const handleUnstake = async (account: any, stakeAmount: number) => {
  //     try {
  //       setIsUnStakeButton(true);
  //       if (!account) {
  //         return;
  //       }

  //       const staked: any = await getStakedForAccounts([account]);
  //       const totalStakedValue = staked ? staked[account] : 0;

  //       if (stakeAmount > totalStakedValue) {
  //         toast.error("unstake amount is greater than staked amount");
  //         return;
  //       }
  //       const result = await unstake(account, stakeAmount);
  //       if (result) {
  //         toast.success("Unstaked successfully");
  //         setHasUnStaked(false);
  //       } else {
  //         console.log("Unstaking failed.");
  //       }
  //     } catch (e: any) {
  //       toast.error(e, e.message);
  //     } finally {
  //       setIsUnStakeButton(false);
  //       setIsUnStakeModalOpen(false);
  //     }
  //   };

  //   function fetchAll() {
  //     handleUserUnlock();
  //     pendingUserReward();
  //     bjUnlockDate();
  //     fetchLastTier();
  //     fetchStakingShares();
  //     fetchTotalStaked();
  //     fetchMinPeriod();
  //   }
  //   useEffect(() => {
  //     if (account) {
  //       fetchAll();
  //     }
  //   }, [account]);

  //   useEffect(() => {
  //     const fetchTotalStakers = async () => {
  //       try {
  //         const stakers = await totalStakers();
  //         setTotalStakersCount(stakers || 0);
  //       } catch (error) {
  //         console.error("Failed to fetch total stakers:", error);
  //       }
  //     };

  //     fetchTotalStakers();
  //   }, []);

  //   useEffect(() => {
  //     const fetchTotalStaked = async () => {
  //       try {
  //         const totalStake: any = await allTotalStaked();
  //         setAllTotalStaked(totalStake || 0);
  //       } catch (error) {
  //         console.error("Failed to fetch total stakers:", error);
  //       }
  //     };

  //     fetchTotalStaked();
  //   }, []);

  //   useEffect(() => {
  //     const fetchTVL = async () => {
  //       try {
  //         const tvls: any = await tvl();
  //         setTVL(tvls || 0);
  //       } catch (error) {
  //         console.error("Failed to fetch total stakers:", error);
  //       }
  //     };

  //     fetchTVL();
  //   }, []);

  const handleSliderChange = (value: number) => {
    setStakeAmount(value);
  };

  const handlePeriodChange = (value: number) => {
    setStakePeriod(value);
  };

  const handleUnstakeSliderChange = (value: number) => {
    setUnStakeAmount(value);
  };

  const handleUnstakePeriodChange = (value: number) => {
    setUnStakePeriod(value);
  };

  //   const handelStakeModal = () => {
  //     setIsModalOpen(!isModalOpen);
  //   };

  //   const handleUnStakeModal = () => {
  //     setIsUnStakeModalOpen(!isUnStakeModalOpen);
  //   };

  //   const fetchTotalStaked = async () => {
  //     try {
  //       const staked: any = await getStakedForAccounts([account]);
  //       const totalStakedValue = staked ? staked[account] : 0;
  //       setTotalStaked(totalStakedValue);
  //     } catch (error) {
  //       console.error("Failed to fetch total staked:", error);
  //     }
  //   };

  const userAddress = account;
  //   const fetchStakingShares = async () => {
  //     try {
  //       const shares: any = await stakingShares(userAddress);
  //       setStakingSharesPercent(shares || 0);
  //     } catch (error) {
  //       console.error("Failed to fetch staking shares:", error);
  //     }
  //   };

  //   const fetchLastTier = async () => {
  //     try {
  //       const tier: any = await lastTierOnIndex(account);
  //       setLastTier(tier);
  //     } catch (error) {
  //       console.error("Failed to fetch last tier:", error);
  //       setLastTier(null);
  //     }
  //   };

  //   const bjUnlockDate = async () => {
  //     try {
  //       const unlock: any = await unlockDate(account);
  //       setUnlockDate(unlock);
  //     } catch (error) {
  //       setUnlockDate(null);
  //     }
  //   };

  //   const pendingUserReward = async () => {
  //     try {
  //       const userUnlock: any = await pendingReward(account);
  //       setRewardPending(userUnlock);
  //     } catch (error) {
  //       setUnlockDate(null);
  //     }
  //   };

  //   const handleUserUnlock = async () => {
  //     try {
  //       const userAtUnlock: any = await userUnlockAt(account);
  //       setUserUnlock(userAtUnlock);
  //     } catch (error) {
  //       setUnlockDate(null);
  //     }
  //   };

  //   const fetchMinPeriod = async () => {
  //     try {
  //       if (!account) return;
  //       const period: any = await userMinPeriod(account);
  //       setMinPeriod(period);
  //     } catch (error) {
  //       setMinPeriod(null);
  //     }
  //   };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-8 sm:gap-12">
      {/* Staking header */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <div className="w-full rounded-3xl bg-gradient-to-r from-blue-500 to-blue-300 p-8">
          <p className="text-theme-monochrome-100 text-lg">Total Staked</p>
          <h1 className="text-theme-monochrome-100 mt-4 w-full text-end text-3xl font-medium">
            {/* {totalAllStaked !== null ? (
              `${totalAllStaked} BJ`
            ) : (
              <BeatLoader color="white" loading={true} />
            )} */}
            <BeatLoader color="white" loading={true} />
          </h1>
        </div>
        <div className="w-full rounded-3xl bg-theme-neutrals-800 p-8">
          <h1 className="text-theme-monochrome-300 text-xl">TVL</h1>
          <h1 className="text-theme-monochrome-200 mt-4 w-full text-end text-3xl font-medium">
            {/* {TVL !== null ? `$ ${TVL}` : <BeatLoader color="white" loading={true} />} */}
            <BeatLoader color="white" loading={true} />
          </h1>
        </div>
        <div className="w-full rounded-3xl bg-theme-neutrals-800 p-8">
          <h1 className="text-theme-monochrome-300 text-xl">Stakers</h1>
          <h1 className="text-theme-monochrome-200 mt-4 w-full text-end text-3xl font-medium">
            {/* {totalStakersCount !== null ? (
              totalStakersCount
            ) : (
              <BeatLoader color="white" loading={true} />
            )} */}
            <BeatLoader color="white" loading={true} />
          </h1>
        </div>
      </div>

      {/* staking content */}
      <div className="grid w-full grid-cols-1 gap-4 rounded-2xl bg-theme-mine-shaft-dark p-6 sm:grid-cols-2 sm:gap-8 sm:p-10">
        <Box title="My Staked">
          {/* {totalStaked !== null ? `${totalStaked} BJ` : <BeatLoader color="white" loading={true} />} */}
          <BeatLoader color="white" loading={true} />
        </Box>
        <Box title="Staking Shares">
          {/* {stakingSharesPercent !== null ? (
            `${stakingSharesPercent}%`
          ) : (
            <BeatLoader color="white" loading={true} />
          )} */}
          <BeatLoader color="white" loading={true} />
        </Box>
        <Box title="Last Tier">
          {/* {lastTier !== null ? `${lastTier}` : <BeatLoader color="white" loading={true} />} */}
          <BeatLoader color="white" loading={true} />
        </Box>
        <Box title="Unlock Date">
          {/* {lockDate !== null ? `${lockDate}` : <BeatLoader color="white" loading={true} />} */}
          <BeatLoader color="white" loading={true} />
        </Box>
        <Box title="Pending Reward">
          {/* {rewardPending !== null ? (
            `${rewardPending}`
          ) : (
            <BeatLoader color="white" loading={true} />
          )} */}
          <BeatLoader color="white" loading={true} />
        </Box>
        <Box title="Total Unlocked">
          {/* {userUnlock !== null ? `${userUnlock}` : <BeatLoader color="white" loading={true} />} */}
          <BeatLoader color="white" loading={true} />
        </Box>
        <div className="flex w-full items-center">
          <p className="text-theme-monochrome-300 flex items-center gap-1 text-[15px] xl:gap-3">
            <Info className="size-4 xl:size-5" /> Log in to see your stats
          </p>
        </div>
        <div className="flex w-full sm:justify-end">
          {!account && <ConnectButton label="Connect" />}
          {account && totalStaked <= 0 && (
            <Button
              //   onClick={handelStakeModal}
              variant="gradientOne"
              className="px-12"
              disabled={isStakeButton}
            >
              {!isStakeButton ? "Stake" : "Staking...."}
            </Button>
          )}

          {account && totalStaked > 0 && (
            <>
              <Button
                // onClick={handelStakeModal}
                variant="gradientOne"
                className="px-12"
              >
                Stake
              </Button>

              <button
                // onClick={handleUnStakeModal}
                className="rounded-full bg-red-600 px-10 py-3 text-lg font-semibold text-white hover:bg-red-700"
                disabled={isUnStakeButton}
              >
                {!isUnStakeButton ? "Unstake" : "UnStaking...."}
              </button>
              {/* {rewardPending > 0 && (
                <button
                  onClick={handleClaim}
                  className="rounded-full bg-yellow-600 px-10 py-3 text-lg font-semibold text-white hover:bg-yellow-700"
                  disabled={isClaimButton}
                >
                  {!isClaimButton ? "Claim" : "Claiming..."}
                </button>
              )} */}
            </>
          )}
        </div>
      </div>

      {/* Staking Modal */}
      {/* <Modal
        isOpen={isModalOpen}
        onClose={handelStakeModal}
        maxBalance={maxBalance}
        account={account}
        isTxPending={isTxPending}
        percentShortcuts={percentShortcuts}
        minPeriod={minPeriod}
        maxPeriod={maxPeriod}
        //@ts-ignore
        unlockDate={unlockDate}
        handleStake={handleStake}
        stakeAmount={stakeAmount}
        handleSliderChange={handleSliderChange}
        handlePeriodChange={handlePeriodChange}
        // disableStake={isTxPending}
        disableStake={isStakeButton}
      /> */}

      {/* Unstaking Modal */}
      {/* <UnStakeModal
        callback={fetchAll}
        isOpen={isUnStakeModalOpen}
        onClose={handleUnStakeModal}
        maxBalance={maxBalance}
        account={account}
        isTxPending={isTxPending}
        //@ts-ignore
        unlockDate={unlockDate}
        handleUnStake={handleUnstake}
        stakeAmount={stakeAmount}
        handleUnStakeSliderChange={handleUnstakeSliderChange}
        handleUnStakePeriodChange={handleUnstakePeriodChange}
        // disableStake={isTxPending}
        disableUnstake={isUnStakeButton}
      /> */}
    </div>
  );
}

type BoxProps = {
  children: React.ReactNode;
  title?: string;
};

function Box({ children, title }: BoxProps) {
  return (
    <div className="w-full rounded-2xl bg-theme-neutrals-800 p-8">
      <h1 className="text-theme-monochrome-300 text-lg sm:text-xl">{title}</h1>
      <h1 className="text-theme-monochrome-200 mt-4 w-full text-end text-3xl font-medium">
        {children}
      </h1>
    </div>
  );
}

export const ConnectButton = dynamic(() => import("@/components/fix-connect-button"), {
  ssr: false,
  loading: () => (
    <div className="flex size-auto items-center justify-center">
      <Skeleton className="bg-theme-monochrome-500 h-12 w-[162px] rounded-full" />
    </div>
  )
});
