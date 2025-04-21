"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaQuestionCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { getDpayTnx } from "@/services/dpay";

import { chainIcons, supportedTokens } from "@/configs";

type TnxStatus = "pending" | "succeeded" | "failed" | "init" | "Token_verified";

interface TnxData {
  _id: string;
  receiverId: string;
  sessionId: string;
  amount: number;
  tokenSymbol: string;
  tokenAddress?: string;
  chainId: number;
  status_stripe: TnxStatus;
  txnHash?: string;
  note?: string;
  type: string;
  tokenSendStatus: "not_sent" | "sending" | "sent" | "cancelled" | "failed";
  tokenSendRetryCount: number;
  receiverAddress: string;
  tokenSendTxnHash?: string;
  approxTokensToReceive?: string;
  approxTokensToSent?: string;
  lastTriedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface TnxResponse {
  error?: string;
  success: boolean;
  data?: TnxData[];
}

const TnxPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sid = searchParams.get("sid");

  const [status, setStatus] = useState<TnxStatus | "not_found">("pending");
  const [txData, setTxData] = useState<TnxData | null>(null);

  useEffect(() => {
    if (!sid) return;

    const fetchTnxStatus = async () => {
      try {
        const response: TnxResponse = await getDpayTnx(sid);
        if (!response.success) {
          toast.error(response.error || "Failed to fetch transaction");
          setStatus("not_found");
          return;
        }

        const data = response.data?.[0];
        if (!data) {
          setStatus("not_found");
          return;
        }

        setTxData(data);
        setStatus(data.status_stripe);
      } catch (error) {
        console.error("Error fetching transaction status:", error);
        setStatus("failed");
      }
    };

    fetchTnxStatus();
    const interval = setInterval(fetchTnxStatus, 3000);
    return () => clearInterval(interval);
  }, [sid]);

  const getStatusIcon = useCallback(() => {
    switch (status) {
      case "init":
      case "pending":
        return <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-yellow-500" />;
      case "succeeded":
        return <FaCheckCircle className="mx-auto mb-4 text-4xl text-green-600" />;
      case "failed":
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
          status === "succeeded"
            ? "Payment Completed"
            : status === "failed"
              ? "Payment Failed"
              : "Awaiting Payment",
        completed: status !== "init" && status !== "pending",
        failed: status === "failed"
      },
      {
        label:
          txData.tokenSendStatus === "not_sent"
            ? "Awaiting Token Initiation"
            : txData.tokenSendStatus === "sending"
              ? "Token Sending"
              : txData.tokenSendStatus === "sent"
                ? "Token Transaction Sent"
                : txData.tokenSendStatus === "cancelled"
                  ? "Token Transaction Cancelled"
                  : "Token Transaction Failed",
        completed:
          txData.tokenSendStatus === "sent" ||
          txData.tokenSendStatus === "failed" ||
          txData.tokenSendStatus === "cancelled",
        failed: txData.tokenSendStatus === "failed" || txData.tokenSendStatus === "cancelled"
      }
    ];
  };

  const renderStepProgress = () => {
    const steps = getSteps();
    return (
      <div className="mb-6 flex w-full flex-wrap items-center justify-center gap-4 text-left">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
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
    );
  };

  const renderDetailsGrid = () => {
    if (!txData) return null;
  
    const skeletonText = (
      <span className="h-4 w-24 animate-pulse rounded bg-gray-300 inline-block" />
    );
  
    const getFieldValue = (label: string, value: any) => {
      if (value !== null && value !== undefined && value !== "") return value;
  
      const pendingLikeStatuses = ["pending", "processing", "initiated"];
      const failedLikeStatuses = ["failed", "error"];
  
      const valueStr = value?.toString()?.toLowerCase();
  
      if (pendingLikeStatuses.some((s) => valueStr?.includes(s))) {
        return <span className="text-yellow-500">Pending</span>;
      }
  
      if (failedLikeStatuses.some((s) => valueStr?.includes(s))) {
        return <span className="text-red-500">Failed</span>;
      }
  
      return skeletonText;
    };
  
    const fields: [string, any][] = [
      ["Transaction ID", getFieldValue("Transaction ID", txData._id)],
      ["Amount", getFieldValue("Amount", `$${txData.amount}`)],
      ["Receiver Wallet Address", getFieldValue("Receiver Wallet Address", txData.receiverAddress)],
      ["Type", getFieldValue("Type", txData.type)],
      [
        "Approx. Tokens To Receive",
        <span className="flex items-center gap-1">
          {txData.approxTokensToReceive ? (
            <>
              <span className="text-xl">{txData.approxTokensToReceive}</span>
              <Image
                src={supportedTokens.find((t) => t.symbol === txData.tokenSymbol)?.iconUrl ?? ""}
                alt="token"
                height={30}
                width={30}
              />
              <Image
                src={chainIcons[txData.chainId]}
                height={30}
                width={30}
                alt={`${txData.chainId}`}
              />
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
        "Approx. Tokens To Send",
        <span className="flex items-center gap-1">
          {txData.approxTokensToSent ? (
            <>
              <span className="text-xl">{txData.approxTokensToSent}</span>
              <Image
                src={supportedTokens.find((t) => t.symbol === txData.tokenSymbol)?.iconUrl ?? ""}
                alt="token"
                height={30}
                width={30}
              />
              <Image
                src={chainIcons[txData.chainId]}
                height={30}
                width={30}
                alt={`${txData.chainId}`}
              />
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
      ["Token Send Txn Hash", getFieldValue("Token Send Txn Hash", txData.tokenSendTxnHash)]
    ];
  
    return (
      <div className="grid w-full grid-cols-1 gap-4 text-left text-sm sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg border border-gray-100 bg-gray-50 p-3 shadow-sm"
          >
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="overflow-hidden text-ellipsis break-words text-sm font-semibold text-gray-800">
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
        return `Payment successful! You’ll receive approximately ${txData?.approxTokensToReceive ?? "N/A"} ${txData?.tokenSymbol}.`;
      case "failed":
        return "Payment failed. Please try again or contact support.";
      case "Token_verified":
        return "Token transaction verified. You are all set!";
      case "not_found":
      default:
        return "No transaction found for the provided session ID.";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-4xl space-y-6 rounded-2xl bg-white p-6 text-center shadow-lg md:p-10">
        {getStatusIcon()}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {status === "not_found"
              ? "Transaction Not Found"
              : (getSteps()[3]?.label ?? "Checking Status...")}
          </h2>
          <p className="mt-1 text-sm text-gray-600">{getDescription()}</p>
        </div>
        {txData && (
          <>
            <div className="text-left">{renderStepProgress()}</div>
            {renderDetailsGrid()}
          </>
        )}
        <Button className="mt-6 w-full" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default TnxPage;
