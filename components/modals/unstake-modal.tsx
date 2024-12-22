/* eslint-disable */
"use client";

import * as React from "react";
import Skeleton from "react-loading-skeleton";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

import BalanceInput from "../balance-input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  account: string | null;
  maxBalance: number;
  fetchBalanceStatus: "SUCCESS" | "LOADING" | "ERROR";
  isTxPending: boolean;
  unlockDateFetcher: (account: string) => Promise<Date | null>;
  handleUnStake: (account: string, stakeAmount: number) => Promise<void>;
  handleSliderChange: (value: number) => void;
  UnStakeAmount: number;
  disableUnStake: boolean;
  callback: () => void;
};

const UnStakeModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  account,
  maxBalance,
  fetchBalanceStatus,
  unlockDateFetcher,
  handleUnStake,
  UnStakeAmount,
  handleSliderChange,
  disableUnStake,
  callback
}) => {
  const [value, setValue] = React.useState<string>("");
  const [unlockDate, setUnlockDate] = React.useState<Date | null>(null);
  const [showFieldWarning, setShowFieldWarning] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [localTxPending, setLocalTxPending] = React.useState<boolean>(false);

  const handleChange = (inputValue: string) => {
    if (!isNaN(Number(inputValue))) {
      setValue(inputValue);
    } else {
      setErrorMessage("Please enter a valid number");
      setShowFieldWarning(true);
    }
  };

  const handleClose = () => {
    setValue("");
    onClose();
  };

  React.useEffect(() => {
    const fetchUnlockDate = async () => {
      if (!account) {
        setUnlockDate(null);
        return;
      }
      try {
        const date = await unlockDateFetcher(account);
        setUnlockDate(date);
      } catch (error) {
        console.error("Error fetching unlock date:", error);
        setUnlockDate(null);
      }
    };

    if (account) {
      fetchUnlockDate();
    } else {
      setUnlockDate(null);
    }
  }, [account, unlockDateFetcher]);

  React.useEffect(() => {
    if (!isNaN(UnStakeAmount)) {
      setValue(UnStakeAmount.toFixed(5));
    }
  }, [UnStakeAmount]);

  const handleUnstakeClick = async () => {
    if (!account) {
      toast.error("Account not set.");
      return;
    }

    const unstakeAmount = Number(value);
    if (unstakeAmount <= 0 || isNaN(unstakeAmount)) {
      toast.error("Invalid unstake amount.");
      return;
    }

    try {
      setLocalTxPending(true);
      await handleUnStake(account, unstakeAmount);
      callback();
      onClose();
    } catch (error) {
      toast.error("An error occurred during unstaking.");
    } finally {
      setLocalTxPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={!disableUnStake}>
        <DialogHeader>
          <DialogTitle>UnStake Your Tokens</DialogTitle>
        </DialogHeader>

        <div>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontWeight: 600 }}>UnStake:</span>
            <span style={{ fontWeight: 600, textTransform: "uppercase" }}>$BJ</span>
          </div>

          <BalanceInput
            value={value}
            onUserInput={handleChange}
            isWarning={showFieldWarning}
            inputProps={{ disabled: !account || localTxPending }}
          />
          {/* {showFieldWarning && (
                        <span style={{ color: "#ed4b9e", fontSize: "12px", textAlign: "right", marginTop: "4px" }}>
                            {errorMessage}
                        </span>
                    )}
                    <div>
                        <span style={{ textAlign: "right", fontSize: "12px" }} className="mr-1">
                            Balance:
                        </span>
                        {fetchBalanceStatus === "SUCCESS" ? (
                            <span style={{ textAlign: "right", fontSize: "12px" }}>{maxBalance.toString()}</span>
                        ) : (
                            <Skeleton width="5rem" height="1rem" />
                        )}
                    </div> */}

          {/* Slider */}
          {/* <input
                        type="range"
                        min={0}
                        max={maxBalance || 1000}
                        value={value && !isNaN(Number(value)) ? Number(value) : 0}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            setValue(newValue.toFixed(5));
                            handleSliderChange(newValue);
                        }}
                        disabled={!account || localTxPending}
                        step={0.00001}
                        style={{ marginBottom: "16px", width: "100%" }}
                    /> */}

          <div className="overview-info mt-4 w-full text-left">
            <button
              className="p-button w-full"
              disabled={!account || disableUnStake || localTxPending}
              onClick={handleUnstakeClick}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px",
                borderRadius: "4px"
              }}
            >
              {localTxPending ? <BeatLoader loading={true} size={8} color="#fff" /> : "UnStake"}
            </button>
          </div>
        </div>
        <DialogFooter>{/* You can add footer content here if needed */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnStakeModal;
