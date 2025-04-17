"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaQuestionCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getDpayTnx } from "@/services/dpay";

type TnxStatus = "pending" | "success" | "failed" | "init" | "Token_verified";

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
  tokenSendStatus: "not_sent" | "sending" | "sent" | "failed";
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

  const getStatusIcon = () => {
    switch (status) {
      case "init":
      case "pending":
        return <FaSpinner className="mx-auto mb-4 animate-spin text-4xl text-yellow-500" />;
      case "success":
        return <FaCheckCircle className="mx-auto mb-4 text-4xl text-green-600" />;
      case "failed":
        return <FaTimesCircle className="mx-auto mb-4 text-4xl text-red-500" />;
      case "Token_verified":
        return <FaCheckCircle className="mx-auto mb-4 text-4xl text-blue-500" />;
      case "not_found":
      default:
        return <FaQuestionCircle className="mx-auto mb-4 text-4xl text-gray-400" />;
    }
  };

  const getSteps = () => {
    if (!txData) return [];
    return [
      {
        label: "Transaction Created",
        completed: true,
      },
      {
        label: "Stripe Payment",
        completed: status !== "init",
      },
      {
        label:
          status === "success"
            ? "Payment Completed"
            : status === "failed"
            ? "Payment Failed"
            : "Awaiting Payment",
        completed: status !== "init" && status !== "pending",
        failed: status === "failed",
      },
      {
        label:
          txData.tokenSendStatus === "not_sent"
            ? "Awaiting Token Initiation"
            : txData.tokenSendStatus === "sending"
            ? "Token Sending"
            : txData.tokenSendStatus === "sent"
            ? "Token Transaction Sent"
            : "Token Transaction Failed",
        completed:
          txData.tokenSendStatus === "sent" || txData.tokenSendStatus === "failed",
        failed: txData.tokenSendStatus === "failed",
      },
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

    const fields: [string, any][] = [
      ["Transaction ID", txData._id],
      ["Amount", `${txData.amount} ${txData.tokenSymbol}`],
      ["Receiver ID", txData.receiverId],
      ["Receiver Address", txData.receiverAddress],
      ["Type", txData.type],
      ["Chain ID", txData.chainId],
      ["Token Address", txData.tokenAddress],
      ["Session ID", txData.sessionId],
      ["Stripe Status", txData.status_stripe],
      ["Token Send Status", txData.tokenSendStatus],
      ["Retry Count", txData.tokenSendRetryCount],
      ["Token Send Txn Hash", txData.tokenSendTxnHash],
      ["Approx. Tokens To Receive", txData.approxTokensToReceive],
      ["Approx. Tokens To Send", txData.approxTokensToSent],
      ["Txn Hash", txData.txnHash],
      ["Note", txData.note],
      ["Last Tried At", txData.lastTriedAt && new Date(txData.lastTriedAt).toLocaleString()],
      ["Created At", new Date(txData.createdAt).toLocaleString()],
      ["Updated At", txData.updatedAt && new Date(txData.updatedAt).toLocaleString()],
    ];

    return (
      <div className="grid w-full grid-cols-1 gap-4 text-left text-sm sm:grid-cols-2">
        {fields.map(([label, value]) =>
          value ? (
            <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-3 shadow-sm">
              <p className="text-xs font-medium text-gray-500">{label}</p>
              <p className="overflow-hidden text-ellipsis break-words text-sm font-semibold text-gray-800">
                {value}
              </p>
            </div>
          ) : null
        )}
      </div>
    );
  };

  const getDescription = () => {
    switch (status) {
      case "init":
        return "Transaction created. Waiting for Stripe session confirmation.";
      case "pending":
        return "Please wait while your payment is processed.";
      case "success":
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
