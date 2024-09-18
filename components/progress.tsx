"use client";

import { AppProgressBar } from "next-nprogress-bar";

export function ProgressBar() {
  return <AppProgressBar height="4px" color="#7C00FE" options={{ showSpinner: false }} />;
}
