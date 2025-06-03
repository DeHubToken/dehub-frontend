"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaTimesCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";

const FailedPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-6 text-center shadow-xl">
        <FaTimesCircle className="mx-auto mb-4 text-4xl" />
        <h2 className="mb-2 text-xl font-semibold">Payment Failed</h2>
        <p className="mb-6 text-sm">Something went wrong during checkout. Please try again.</p>

        <Button variant="outline" className="w-full" onClick={() => router.back()}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default FailedPage;
