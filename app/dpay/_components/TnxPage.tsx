"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaQuestionCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { getDpayTnx } from "@/services/dpay";

import { chainIcons, supportedTokens } from "@/configs";

import { TnxData, TnxResponse, TnxStatus } from "../types";
import TokenAndChainIcon from "./TokenAndChainIcon";
import { getExplorerUrl } from "@/libs/utils";
import { miniAddress } from "@/libs/strings";

const TnxPage = ({ sid }: { sid: string }) => {
  const router = useRouter();

  const [status, setStatus] = useState<TnxStatus | "not_found">("pending");
  const [txData, setTxData] = useState<TnxData | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  const [loading, setLoading] = useState(false);

  const fetchTnxStatus = async () => {
    if (!sid) return;
    setLoading(true);
    try {
      const response: TnxResponse = await getDpayTnx({ sid });
      if (!response.success) {
        toast.error(response.error || "Failed to fetch transaction");
        setStatus("not_found");
        return;
      }
      if (!response.data?.tnxs) {
        setStatus("not_found");
        return;
      }
      const data = response.data?.tnxs[0];

      setTxData(data);
      setStatus(data.status_stripe);
    } catch (error) {
      console.error("Error fetching transaction status:", error);
      setStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  
// Memoize the polling condition
const shouldPoll = useMemo(() => {
  console.log("status",status,)
  if(["failed","expired"].includes(status)){
    return false
  }
  return (!["sent"].includes(txData?.tokenSendStatus??"not_sent"));
}, [status, txData?.tokenSendStatus]);

useEffect(() => {
  if (!sid) return;

  fetchTnxStatus(); // Initial fetch

  if (!shouldPoll) return;

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        fetchTnxStatus();
        return 5;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [sid, shouldPoll]); // Now depends only on `shouldPoll`, not raw fields
  
  const getStatusIcon = useCallback(() => {
    switch (status) {
      case "init":
      case "pending":
        return <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-yellow-500" />;
      case "succeeded":
      case "complete":
        return <FaCheckCircle className="mx-auto mb-4 text-4xl text-green-600" />;
      case "failed":
      case "expired":
        return <FaTimesCircle className="mx-auto mb-4 text-4xl text-red-500" />;
      case "Token_verified":
        return <FaCheckCircle className="mx-auto mb-4 text-4xl text-blue-500" />;
      case "not_found":
      default:
        return <FaQuestionCircle className="mx-auto mb-4 text-4xl text-gray-400" />;
    }
  }, [status]);

  const getSteps = () => {
    if (!txData) return [];
    return [
      {
        label: "Transaction Created",
        completed: true
      },
      {
        label:
          status === "succeeded" || status === "complete"
            ? "Payment Completed"
            : status === "failed"
              ? "Payment Failed"
              : status === "expired"
                ? "Payment Expired"
                : "Awaiting Payment",
        completed: status !== "init" && status !== "pending",
        failed: status === "failed" || status === "expired"
      },
      {
        label:
          txData.tokenSendStatus === "not_sent" && txData.status_stripe != "expired"
            ? "Awaiting Token Initiation"
            : txData.tokenSendStatus === "sending"
              ? "Token Sending"
              : txData.tokenSendStatus === "processing"
                ? "Processing Transaction"
                : txData.tokenSendStatus === "sent"
                  ? "Token Transaction Sent"
                  : txData.tokenSendStatus === "cancelled"
                    ? "Token Transaction Cancelled"
                    : txData.status_stripe === "expired"
                      ? "Token Transaction Expired"
                      : "Token Transaction Failed",
        completed: ["sent", "failed", "cancelled", "expired"].includes(
          txData.tokenSendStatus ?? ""
        ),
        failed: ["failed", "cancelled", "expired"].includes(txData.tokenSendStatus ?? ""),
        processing: txData.tokenSendStatus === "processing"
      }
    ];
  };

  const shimmer = <span className="inline-block h-4 w-24 animate-pulse rounded bg-gray-300" />;

  const renderDetailsGrid = () => {
    if (!txData) return null;

    const getFieldValue = (label: string, value: any) => {
      if (value !== null && value !== undefined && value !== "") return value;

      const pendingLikeStatuses = ["pending", "processing", "init"];
      const failedLikeStatuses = ["failed", "error"];

      const valueStr = value?.toString()?.toLowerCase();

      if (pendingLikeStatuses.some((s) => valueStr?.includes(s))) {
        return <span className="text-yellow-500">Pending</span>;
      }

      if (failedLikeStatuses.some((s) => valueStr?.includes(s))) {
        return <span className="text-red-500">Failed</span>;
      }

      return shimmer;
    };

    const fields: [string, any][] = [
      ["Transaction ID", getFieldValue("Transaction ID", txData._id)],
      [
        "Amount",
        getFieldValue("Amount", `${txData.amount} ${txData.currency?.toUpperCase() ?? "GBP"}`)
      ],
      ["Platform Fee", getFieldValue("Platform Fee", `${txData.fee ?? 0} GBP`)],
      ["Exchange Rate", getFieldValue("Exchange Rate", `${txData.exchange_rate ?? 0} GBP`)],
      ["Net Amount", getFieldValue("Net Amount", `${txData.net ?? 0} GBP`)],
      ["Receiver Wallet Address", getFieldValue("Receiver Wallet Address", txData.receiverAddress)],
      ["Type", getFieldValue("Type", txData.type)],
      [
        "Approx. Tokens To Receive",
        <span className="flex items-center gap-1">
          {txData.approxTokensToReceive ? (
            <>
              <span className="text-xl">{txData.approxTokensToReceive}</span>
              <TokenAndChainIcon tokenSymbol={txData.tokenSymbol} chainId={txData.chainId} />
            </>
          ) : (
            <>
              <span className="h-6 w-16 animate-pulse rounded-md bg-gray-300" />
              <span className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
              <span className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
            </>
          )}
        </span>
      ],
      [
        "Token Received",
        <span className="flex items-center gap-1">
          {txData.tokenReceived ? (
            <>
              <span className="text-xl">{txData.tokenReceived}</span>
              <TokenAndChainIcon tokenSymbol={txData.tokenSymbol} chainId={txData.chainId} />
            </>
          ) : (
            <>
              <span className="h-6 w-16 animate-pulse rounded-md bg-gray-300" />
              <span className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
              <span className="h-8 w-8 animate-pulse rounded-full bg-gray-300" />
            </>
          )}
        </span>
      ],
      ["Session ID", getFieldValue("Session ID", txData.sessionId)],
      ["Stripe Status", getFieldValue("Stripe Status", txData.status_stripe)],
      ["Token Send Status", getFieldValue("Token Send Status", txData.tokenSendStatus)],
      [
        "Token Send Txn Hash",
        getFieldValue(
          "Token Send Txn Hash",
          txData?.tokenSendStatus === "sent" ? (
            <a
              href={getExplorerUrl(txData.chainId, txData?.tokenSendTxnHash ?? "")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {miniAddress(txData.tokenSendTxnHash)}
            </a>
          ) : (
            txData.tokenSendStatus
          )
        )
      ]
    ];

    return (
      <div className="grid w-full grid-cols-1 gap-4 text-left text-sm sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className={`rounded-lg border border-gray-50 p-3 shadow-sm transition duration-500 ease-in-out ${loading ? "animate-pulse bg-gray-50" : ""}`}
          >
            <p className="text-xs font-medium ">{label}</p>
            <p className="overflow-hidden text-ellipsis break-words text-sm font-semibold ">
              {value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const getDescription = () => {
    switch (status) {
      case "init":
        return "Transaction created. Waiting for Stripe session confirmation.";
      case "pending":
        return "Please wait while your payment is processed.";
      case "succeeded":
        return `Payment successful! You’ll receive approximately ${txData?.tokenReceived ?? "N/A"} ${txData?.tokenSymbol}.`;
      case "failed":
        return "Payment failed. Please try again or contact support.";
      case "expired":
        return "This transaction has expired. Please try again or initiate a new payment session.";
      case "Token_verified":
        return "Token transaction verified. You are all set!";
      case "not_found":
      default:
        return "No transaction found for the provided session ID.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-6 rounded-2xl bg-gray-50 bg-opacity-10 p-6 text-center shadow-lg md:p-10">
        {getStatusIcon()}
        <div>
          <h2 className="text-xl font-bold">
            {status === "not_found"
              ? "Transaction Not Found"
              : status === "expired"
                ? "Transaction Expired"
                : (getSteps().slice(-1)[0]?.label ?? "Checking Status...")}
          </h2>
          <p className="mt-1 text-sm ">{getDescription()}</p>
        </div>
        {txData && (
          <>
            <div className="flex flex-wrap justify-center gap-2 text-left align-middle ">
              {getSteps().length > 0 &&
                getSteps().map((step, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    {step.completed ? (
                      step.failed ? (
                        <FaTimesCircle className="text-red-500" />
                      ) : (
                        <FaCheckCircle className="text-green-500" />
                      )
                    ) : (
                      <FaSpinner className="animate-spin text-yellow-500" />
                    )}
                    <span className="text-sm">{step.label}</span>
                  </div>
                ))}
            </div>
            {renderDetailsGrid()}
          </>
        )}
     {shouldPoll&&   <div className="text-sm text-gray-400">Next auto check in: {timeLeft}s</div>}
        <div className="flex flex-col items-center justify-center gap-2 pt-4 sm:flex-row">
          <Button
            className="mt-2 w-full max-w-xs sm:w-40"
            variant="outline"
            onClick={() => router.push("/dpay")}
          >
            Home
          </Button>
          {shouldPoll&&   <Button
            className="mt-2 w-full max-w-xs sm:w-40"
            onClick={() => {
              setTimeLeft(5);
              fetchTnxStatus();
            }}
            variant="gradientOne"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Now"}
          </Button>}
        </div>
      </div>
    </div>
  );
};

export default TnxPage;
