import Image from "next/image";

import { supportedNetworks } from "@/web3/configs";

import { chainIcons } from "@/configs";

export const ChainIconById = ({ chainId, label = false }: { chainId: number; label?: boolean }) => {
  if (chainId && chainIcons[chainId]) {
    return (
      <div className="flex flex-grow items-center gap-1">
      {chainId && (
        <Image
          src={chainIcons[chainId]}
          alt={`icon-for-${chainId}-missing.`}
          width={24}
          height={24}
          className="h-6 w-6"
        />
      )}
      {label && <span>{supportedNetworks.find((c) => c.chainId == chainId)?.label}</span>}
    </div>
    
    );
  }
  return chainId && supportedNetworks.find((c) => c.chainId == chainId)?.label;
};
