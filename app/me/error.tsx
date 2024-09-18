"use client";

import { Error } from "@/components/error";

export default function MeErrorBoundry({ error, reset }: { error: Error; reset: () => void }) {
  return <Error error={error} resetErrorBoundary={reset} />;
}
