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
  percentShortcuts: number[];
  minPeriod: number;
  maxPeriod: number;
  unlockDateFetcher: (account: string) => Promise<Date | null>;
  handleStake: (account: string, period: number, stakeAmount: number) => void;
  stakeAmount: number;
  handleSliderChange: (value: number) => void;
  handlePeriodChange: (value: number) => void;
  disableStake: boolean;
  stakeAction: (account: string, amount: number, period: number) => Promise<boolean>;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  account,
  maxBalance,
  fetchBalanceStatus,
  isTxPending,
  minPeriod,
  maxPeriod,
  unlockDateFetcher,
  handleStake,
  stakeAmount,
  handleSliderChange,
  handlePeriodChange,
  disableStake,
  stakeAction
}) => {
  const [value, setValue] = React.useState<string>("");
  const [period, setPeriod] = React.useState<number>(minPeriod);
  const [unlockDate, setUnlockDate] = React.useState<Date | null>(null);
  const [showFieldWarning, setShowFieldWarning] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const formRef = React.useRef(null);

  const handleClose = () => {
    setValue("");
    setPeriod(600);
    onClose();
  };

  const handleChange = (inputValue: string) => {
    if (!isNaN(Number(inputValue))) {
      setValue(inputValue);
    } else {
      setErrorMessage("Please enter a valid number");
      setShowFieldWarning(true);
    }
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
    if (!isNaN(stakeAmount)) {
      setValue(stakeAmount.toFixed(1));
    }
  }, [stakeAmount]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent showCloseButton={!disableStake}>
        <DialogHeader>
          <DialogTitle>Stake Your Tokens</DialogTitle>
        </DialogHeader>

        <div>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontWeight: 600 }}>Stake:</span>
            <span style={{ fontWeight: 600, textTransform: "uppercase" }}>$BJ</span>
          </div>

          <BalanceInput
            value={value}
            onUserInput={handleChange}
            isWarning={showFieldWarning}
            inputProps={{ disabled: !account || isTxPending }}
          />
          {showFieldWarning && (
            <span
              style={{ color: "#ed4b9e", fontSize: "12px", textAlign: "right", marginTop: "4px" }}
            >
              {errorMessage}
            </span>
          )}
          {/* <div>
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
            disabled={!account || isTxPending}
            step={0.00001}
            style={{ marginBottom: "16px", width: "100%" }}
          /> */}

          <div className="relative">
            <span style={{ textAlign: "left" }} className="w-3">
              Period:
            </span>
            <div
              className="shadow-inner relative items-end rounded-lg border-[#545B67] bg-[#3E4754] p-2"
              style={{ cursor: "pointer" }}
            >
              <select
                value={period || 600}
                onChange={(e) => {
                  const newPeriod = Number(e.target.value);
                  setPeriod(newPeriod);
                  handlePeriodChange(newPeriod);
                }}
                disabled={!account || isTxPending}
                className="w-full appearance-none border-none bg-transparent pr-10 text-right outline-none"
                style={{
                  background: "transparent",
                  color: "white",
                  cursor: "pointer",
                  padding: "10px",
                  fontSize: "16px",
                  textAlign: "center",
                  textAlignLast: "center"
                }}
              >
                <option value="" disabled>
                  Select Period
                </option>{" "}
                {/* Placeholder option */}
                {[600, 700, 800, 900, 1000].map((value) => (
                  <option key={value} value={value} className="right-4 bg-[#3E4754] text-white">
                    {value}
                  </option>
                ))}
              </select>
              <div
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transform"
                style={{
                  color: "white",
                  fontSize: "14px"
                }}
              >
                Days
              </div>
            </div>
          </div>

          <div className="overview-info mt-4 w-full text-left">
            <button
              className="p-button w-full"
              disabled={!account || disableStake}
              onClick={() => {
                if (!account) {
                  toast.error("account not set.");
                  return;
                }

                if (Number(value) <= 0) {
                  toast.error("Please enter a value greater than 0");
                  return;
                }
                handleStake(account, Number(value), period);
              }}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px",
                borderRadius: "4px"
              }}
            >
              {disableStake ? <BeatLoader loading={true} /> : "Stake"}
            </button>
          </div>
        </div>
        <DialogFooter>{/* You can add footer content here if needed */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
