/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSwitchChain, useWeb3AuthUser } from "@web3auth/modal/react";
import { useSetAtom } from "jotai";
import { ChevronDown } from "lucide-react";
import { useBalance } from "wagmi";

import { ChainIconById } from "@/app/components/ChainIconById";

import { Wallet } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useUser } from "@/hooks/use-user";
import { chains, useActiveWeb3React } from "@/hooks/web3-connect";

import { getAvatarUrl } from "@/web3/utils/url";

import { isUsernameSetAtom } from "@/stores";

import { chainIcons } from "@/configs";

import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";

export type Props = { fixed?: boolean };

function WalletButton({ fixed = false }: Props) {
  const [isAccountOpen, setAccountOpen] = useState(false);
  const [isChainOpen, setChainOpen] = useState(false);

  const { user } = useUser();
  const isSmall = useMediaQuery("(max-width: 960px)");
  const setIsUsernameSet = useSetAtom(isUsernameSetAtom);

  const {
    account,
    chainId,
    active: connected,
    activate,
    deactivate,
    disconnectLoading,
    connectLoading,
    connector
  } = useActiveWeb3React();

  const { data: balance } = useBalance({ address: account as `0x${string}` });

  const accountData = useMemo(() => {
    if (!account) return null;
    return {
      address: account,
      displayName: `${account.slice(0, 6)}...${account.slice(-4)}`,
      displayBalance: balance
        ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}`
        : "",
      ensAvatar: undefined
    };
  }, [account, balance]);

  const chainData = useMemo(() => {
    const chain = chains.find((c) => c.id === chainId);
    if (!chain) return null;
    return {
      id: chain.id,
      name: chain.name,
      iconUrl: chainIcons[chain.id as keyof typeof chainIcons],
      iconBackground: undefined
    };
  }, [chainId]);

  useEffect(() => {
    fetch(`/api/cookies`, {
      method: "POST",
      body: JSON.stringify({
        wallet_information: accountData,
        chain_information: chainData,
        user_information: user?.result,
        connected
      })
    }).catch(() => null);
  }, [accountData, chainData, user, connected]);

  useEffect(() => {
    if (connected && user && !user.result?.username) {
      setIsUsernameSet(false);
    }
  }, [connected, user, setIsUsernameSet]);

  const onConnect = useCallback(() => activate(), [activate]);
  const onDisconnect = useCallback(async () => {
    await deactivate();
    setAccountOpen(false);
  }, [deactivate]);
  const openAccount = useCallback(() => setAccountOpen(true), []);
  const openChain = useCallback(() => setChainOpen(true), []);

  // const isAccountLoading = connected && !account && !connectLoading;
  const isAccountLoading = connected && !account;

  // if (connectLoading) {
  //   return null;
  // }

  if (!connected || !accountData || !chainData) {
    return (
      <Button
        onClick={onConnect}
        variant={isSmall && !fixed ? "ghost" : "gradientOne"}
        size={isSmall && !fixed ? "icon_sm" : "lg"}
        className={isSmall && !fixed ? "rounded-full" : "h-10 gap-2 px-6"}
        disabled={isAccountLoading}
      >
        <Wallet className="scale-125 text-white" />
        {!isSmall || fixed
          ? connectLoading || isAccountLoading
            ? "Connecting..."
            : "Connect"
          : null}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Button
        onClick={openChain}
        size="lg"
        className="flex h-auto items-center gap-2 rounded-full px-0 sm:h-12 sm:px-12"
      >
        {chainData.iconUrl && (
          <div className="size-6 rounded-full" style={{ background: chainData.iconBackground }}>
            <Image src={chainData.iconUrl} alt={chainData.name} width={20} height={20} />
          </div>
        )}
        <span className="hidden sm:inline-block">
          {chainData.name.length > 10 ? `${chainData.name.slice(0, 10)}...` : chainData.name}
        </span>
        <ChevronDown className="hidden size-4 sm:block" />
      </Button>

      <Button
        onClick={openAccount}
        variant="gradientOne"
        size="lg"
        className="flex h-auto items-center gap-2 px-0 sm:h-12 sm:px-8"
      >
        <div className="bg-theme-orange-500 hidden place-items-center px-4 sm:grid">
          {accountData?.displayBalance}
        </div>
        <Image
          src={
            user?.result.avatarImageUrl
              ? getAvatarUrl(user.result.avatarImageUrl)
              : "/images/avatar.png"
          }
          alt="avatar"
          width={32}
          height={32}
          className="block size-6 rounded-full sm:size-8"
        />
        <span className="hidden sm:inline-block">
          {user?.result.username || accountData.displayName}
        </span>
      </Button>

      <Dialog open={isAccountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="w-[480px] rounded-2xl bg-[#1a1b1f] text-white">
          <DialogClose className="absolute right-4 top-4">
            <Cross2Icon />
          </DialogClose>
          <DialogHeader>Account</DialogHeader>
          <div className="space-y-4 p-4">
            <Link href="/me" className="flex items-center gap-3">
              <Image
                src={
                  user?.result.avatarImageUrl
                    ? getAvatarUrl(user.result.avatarImageUrl)
                    : accountData.ensAvatar || "/images/avatar.png"
                }
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <div className="font-medium text-white">
                  {user?.result.username || accountData.displayName}
                </div>
                <div className="text-sm text-gray-400">{accountData.address}</div>
              </div>
            </Link>
            <div className="text-center text-2xl font-bold text-white">
              {accountData.displayBalance}
            </div>
            <Button
              onClick={onDisconnect}
              variant="gradientOne"
              className="w-full"
              disabled={disconnectLoading}
            >
              Disconnect
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isChainOpen} onOpenChange={setChainOpen}>
        <DialogContent className="max-w-xs rounded-xl bg-[#1a1b1f] text-white">
          <DialogClose className="absolute right-4 top-4">
            <Cross2Icon />
          </DialogClose>
          <DialogHeader>Switch Network</DialogHeader>
          <NetworkList onSelect={() => setChainOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default WalletButton;

function NetworkList({ onSelect }: { onSelect: () => void }) {
  const { chainId } = useActiveWeb3React();
  const { switchChain, loading } = useSwitchChain();
  // console.log("ChainId out", chainId)
  return (
    <div className="flex flex-col gap-2 p-2">
      {chains.map((chain) => {
        const selected = chain.id === chainId;
        return (
          <button
            key={chain.id}
            onClick={async () => {
              // console.log("Switching chain", "0x" + chain.id.toString(16), chain.id, chainId)
              await switchChain("0x" + chain.id.toString(16));
              onSelect();
            }}
            disabled={loading}
            className={`flex items-center justify-between rounded-full p-3 text-white hover:bg-gray-700 ${selected ? "bg-purple-600" : ""}`}
          >
            <div className="flex items-center gap-2">
              <ChainIconById chainId={chain.id} />
              <span>{chain.name}</span>
            </div>
            {selected && <span>●</span>}
          </button>
        );
      })}
    </div>
  );
}
