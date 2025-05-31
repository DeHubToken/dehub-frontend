"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-6 shadow-xl text-center">
        <FaCheckCircle className="mx-auto mb-4 text-4xl" />
        <h2 className="mb-2 text-xl font-semibold">Payment Successful</h2>
        <p className="mb-6 text-sm">Your DeHub tokens will arrive shortly in your wallet.</p>

        <Button className="w-full" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
