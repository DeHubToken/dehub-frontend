import React from "react";
import Image from "next/image";

import { chainIcons, supportedTokens } from "@/configs";

type Props = {};

const TokenAndChainIcon = ({ tokenSymbol, chainId }: { tokenSymbol: string; chainId: number }) => {
  const token = supportedTokens.find((t) => t.symbol === tokenSymbol);
  const tokenIcon = token?.iconUrl ?? "";
  const chainIcon = chainIcons[chainId];
  return (
    <div className="relative h-10 w-16">
      {/* Chain Icon - Back */}
      <div className="absolute left-0 top-0 z-0 h-10 w-10 rounded-full shadow">
        <Image
          src={chainIcon}
          alt={`Chain ${chainId}`}
          height={40}
          width={40}
          className="rounded-full"
        />
      </div>

      {/* Token Icon - Front */}
      <div className="absolute left-5 top-0 z-10 h-10 w-10 rounded-full shadow">
        <Image src={tokenIcon} alt={tokenSymbol} height={40} width={40} className="rounded-full" />
      </div>
    </div>
  );
};

export default TokenAndChainIcon;
