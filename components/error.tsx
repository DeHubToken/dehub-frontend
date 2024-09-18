"use client";

import type { ErrorBoundryProps } from "@/types";

import { XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  title?: string;
};

export function Error({ error, resetErrorBoundary, title }: ErrorBoundryProps & ErrorProps) {
  return (
    <div className="flex size-full min-h-screen flex-col items-center justify-center">
      <div className="max-w-[600px] rounded-lg border bg-theme-mine-shaft-dark p-4 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon className="size-10 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-red-600">{title || "Error loading resources"}</h3>
            <div className="mt-2 text-sm text-slate-400">
              <p>
                This resource doesn&apos;t exist or you don&apos;t have the neccessary rights to
                access it.
              </p>

              {process.env.NODE_ENV === "development" && (
                <div className="my-4 rounded border border-gray-200 p-3 dark:border-theme-mine-shaft">
                  <pre className="text-xs text-red-600">{error.message}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="ml-12 mt-2">
          <Button
            onClick={() => resetErrorBoundary()}
            className="mr-2 border border-gray-300 bg-gray-200 dark:border-theme-mine-shaft"
          >
            Try again
          </Button>
          <Button
            className="border border-gray-300 bg-gray-200 dark:border-theme-mine-shaft"
            onClick={() => (window.location.href = "/")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
