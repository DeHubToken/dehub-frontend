"use client";

import type { Props } from "./connect-button";

import { ConnectButton as RaninbowConnectButton } from "@rainbow-me/rainbowkit";

import { WalletButton } from "./connect-button";

export default function FixConnectButton(props: Props) {
  return (
    <RaninbowConnectButton.Custom {...props}>
      {(renderProps) => <WalletButton fixed {...renderProps} />}
    </RaninbowConnectButton.Custom>
  );
}
