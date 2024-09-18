"use client";

import { Error } from "@/components/error";

export default function StreamErrorBoundry(props: { error: Error; reset: () => void }) {
  return <Error error={props.error} resetErrorBoundary={props.reset} />;
}
