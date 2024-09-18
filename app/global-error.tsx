"use client";

import { Error } from "@/components/error";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return <Error error={error} resetErrorBoundary={reset} title="Error loading resource" />;
}
