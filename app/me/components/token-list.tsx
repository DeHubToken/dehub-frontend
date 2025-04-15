"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import UserSearchModal from "@/app/components/UserSearchModal";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import useTokenBalance from "@/hooks/use-token-balance";
import { useActiveWeb3React } from "@/hooks/web3-connect";

import { cn } from "@/libs/utils";

import { supportedTokens } from "@/configs";

export default function TokensList() {
  const { chainId } = useActiveWeb3React();

  const avaialbleTokens = useMemo(
    () => supportedTokens.filter((token) => token.chainId === chainId),
    [chainId]
  );
  const tokenBalance = useTokenBalance(true);

  if (!avaialbleTokens || avaialbleTokens.length === 0) {
    return null;
  }

  return (
    <div className="h-auto w-full max-w-screen-xs space-y-4 rounded-3xl bg-theme-mine-shaft-dark p-6 dark:bg-theme-mine-shaft-dark">
      <div className="flex h-auto w-full items-center justify-between px-4">
        <p className="text-lg font-semibold">Assets</p>
        <p className="text-lg font-semibold">Holdings</p>
      </div>

      <div className="h-80 w-full overflow-y-scroll rounded-3xl dark:bg-theme-mine-shaft">
        <ul className="h-auto w-full space-y-4 p-4">
          {avaialbleTokens.map((token, index) => {
            if (token.symbol === "DHB") {
              return (
                <BJ
                  key={token.chainId + "-" + index}
                  iconUrl={token.iconUrl}
                  label={token.label}
                  tokenBalance={tokenBalance?.tokenBalances?.[token.address] || 0}
                />
              );
            }

            return (
              <li
                key={token.chainId + "-" + index}
                className="flex h-auto w-full items-center justify-between py-1"
              >
                <div className="flex size-auto items-center justify-start gap-2">
                  <img
                    src={token.iconUrl}
                    alt={token.label}
                    width={200}
                    height={200}
                    className="size-8 object-cover"
                  />
                  <p className="text-sm">{token.label}</p>
                </div>
                <p className="text-sm">{tokenBalance?.tokenBalances?.[token.address] || 0}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function BJ(props: { iconUrl: string; label: string; tokenBalance: number }) {
  const { iconUrl, label, tokenBalance } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toggle, setToggle] = useState(false);

  function onToggle() {
    setToggle((prev) => !prev);
  }

  return (
    <motion.li
      animate={toggle ? { height: 64 } : { height: "auto" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex h-auto w-full items-start justify-between",
        toggle && "rounded-lg"
      )}
    >
      <div className="flex h-auto w-full items-center justify-between">
        <div className="flex size-auto items-center justify-start gap-2">
          <img src={iconUrl} alt={label} width={200} height={200} className="size-8 object-cover" />
          <p className="text-sm">{label}</p>
        </div>
        <p className={cn("text-sm")}>{tokenBalance || 0}</p>
      </div>

      <motion.button
        initial={{ rotate: 0 }}
        animate={{ rotate: toggle ? -180 : 0 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="absolute left-1/2 top-1"
        onClick={onToggle}
      >
        <ChevronDown size={16} className="text-lg" />
      </motion.button>

      {toggle && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="absolute bottom-1 right-2 flex items-center gap-2"
        >
          <Topup />
          <Button
            variant="ghost"
            className="h-7 rounded-full bg-theme-mine-shaft-dark px-4 text-xs dark:bg-theme-mine-shaft-dark dark:hover:bg-theme-mine-shaft-dark/70"
            asChild
            disabled
          >
            <a href="#" target="_blank" rel="noreferrer">
              Bridge (coming soon)
            </a>
          </Button>
          <Button
            variant="ghost"
            className="h-7 rounded-full bg-theme-mine-shaft-dark px-4 text-xs dark:bg-theme-mine-shaft-dark dark:hover:bg-theme-mine-shaft-dark/70"
            asChild
            onClick={() => setIsModalOpen(true)}
          >
            <p>Transfer</p>
          </Button>

          {/* User Search Modal */}
          {isModalOpen && <UserSearchModal setIsModalOpen={setIsModalOpen} />}
        </motion.div>
      )}
    </motion.li>
  );
}

function Topup() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 rounded-full bg-theme-mine-shaft-dark px-4 text-xs dark:bg-theme-mine-shaft-dark dark:hover:bg-theme-mine-shaft-dark/70"
        >
          Top up
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuItem asChild>
          <a
            href="https://app.camelot.exchange/?outputCurrency=0x9caae40dcf950afea443119e51e821d6fe2437ca"
            className="text-sm"
            target="_blank"
            rel="noreferrer"
          >
            Buy from DEX
          </a>
        </DropdownMenuItem>
        <DropdownMenuLabel>Buy with Card (coming soon)</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
