/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ConnectButton as RaninbowConnectButton } from "@rainbow-me/rainbowkit";
import { useSetAtom } from "jotai";
import { ChevronDown } from "lucide-react";
import { useAccount } from "wagmi";

import { Wallet } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useUser } from "@/hooks/use-user";
import { chains, useActiveWeb3React } from "@/hooks/web3-connect";

import { getAvatarUrl, getImageUrl } from "@/web3/utils/url";

import { isUsernameSetAtom } from "@/stores";

import { useSwitchChain } from "./providers";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./ui/dialog";

export type Props = React.ComponentProps<typeof RaninbowConnectButton>;

type AuthenticationStatus = "loading" | "unauthenticated" | "authenticated";
type RenderProps = {
  fixed?: boolean;
  account?: {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
  };
  chain?: {
    hasIcon: boolean;
    iconUrl?: string;
    iconBackground?: string;
    id: number;
    name?: string;
    unsupported?: boolean;
  };
  mounted: boolean;
  authenticationStatus?: AuthenticationStatus;
  openAccountModal: () => void;
  openChainModal: () => void;
  openConnectModal: () => void;
  accountModalOpen: boolean;
  chainModalOpen: boolean;
  connectModalOpen: boolean;
};

export function WalletButton(props: RenderProps) {
  const {
    account,
    chain,
    openAccountModal,
    openChainModal,
    openConnectModal,
    authenticationStatus,
    mounted,
    fixed
  } = props;

  const { user } = useUser();
  const isSmallScreen = useMediaQuery("(max-width: 960px)");

  const setIsUsernameSet = useSetAtom(isUsernameSetAtom);

  // Note: If your app doesn't use authentication, you
  // Can remove all 'authenticationStatus' checks
  const ready = mounted && authenticationStatus !== "loading";
  const connected =
    ready &&
    account &&
    chain &&
    (!authenticationStatus || authenticationStatus === "authenticated");

  useEffect(() => {
    fetch(`/api/cookies`, {
      method: "POST",
      body: JSON.stringify({
        wallet_information: account,
        chain_information: chain,
        user_information: user?.result,
        connected: connected ? true : false
      })
    }).catch(() => null);
  }, [account, chain, connected, user]);

  useEffect(() => {
    if (connected && user && !user.result?.username) {
      setIsUsernameSet(false);
    }
  }, [connected, setIsUsernameSet, user]);
  const { connector } = useAccount();

  useEffect(() => {
    console.log("connector?.name", connector?.name);
  }, [connector]);
  return (
    <div
      {...(!ready && {
        "aria-hidden": true,
        style: {
          opacity: 0,
          pointerEvents: "none",
          userSelect: "none"
        }
      })}
    >
      {(() => {
        if (!connected) {
          if (!isSmallScreen || fixed) {
            return (
              <Button
                variant="gradientOne"
                size="lg"
                className="h-10 gap-2 px-6"
                onClick={openConnectModal}
              >
                <Wallet className="scale-125 text-white" /> Connect
              </Button>
            );
          } else {
            return (
              <Button
                onClick={openConnectModal}
                size="icon_sm"
                className="rounded-full"
                variant="ghost"
              >
                <Wallet className="scale-125 text-gray-400 dark:text-white" />
              </Button>
            );
          }
        }

        if (chain.unsupported) {
          return (
            <button onClick={openChainModal} type="button">
              Wrong network
            </button>
          );
        }
        if (connector?.name == "Web3Auth") {
          return (
            <Web3AuthChainSwitchModal
              isSmallScreen={isSmallScreen}
              fixed={fixed}
              user={user}
              account={account}
              chain={chain}
              openAccountModal={openAccountModal}
            />
          );
        }

        return (
          <div className="flex items-center justify-end gap-0 md:gap-4">
            {!isSmallScreen || fixed ? (
              <>
                <Button onClick={openChainModal} className="h-10 gap-2 rounded-full px-4" size="lg">
                  {chain.hasIcon && (
                    <div
                      style={{
                        background: chain.iconBackground
                      }}
                      className="size-5 rounded-full"
                    >
                      {chain.iconUrl && (
                        <Image
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          height={100}
                          width={100}
                          className="size-5"
                        />
                      )}
                    </div>
                  )}
                  {chain.name && chain.name.length > 10
                    ? `${chain.name.slice(0, 10)}...`
                    : chain.name}
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  onClick={openAccountModal}
                  variant="gradientOne"
                  size="lg"
                  className="hidden h-10 w-max gap-2 overflow-hidden px-0 md:flex"
                >
                  <div className="bg-theme-orange-500 grid size-full place-items-center px-4">
                    {account.displayBalance ? account.displayBalance : ""}
                  </div>
                  {user ? (
                    <Image
                      src={
                        user.result.avatarImageUrl
                          ? getAvatarUrl(user.result.avatarImageUrl)
                          : "/images/avatar.png"
                      }
                      height={300}
                      width={300}
                      alt="avatar"
                      className="size-6 rounded-full"
                    />
                  ) : (
                    <Image
                      src={account.ensAvatar ? account.ensAvatar : "/images/avatar.png"}
                      alt="avatar"
                      height={200}
                      width={200}
                      className="size-6 rounded-full"
                    />
                  )}
                  <span className="pr-6">{user ? user.result?.username : account.displayName}</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={openChainModal}
                  size="icon_sm"
                  className="rounded-full"
                  variant="ghost"
                >
                  {chain.hasIcon && (
                    <div
                      style={{
                        background: chain.iconBackground
                      }}
                      className="size-5 rounded-full"
                    >
                      {chain.iconUrl && (
                        <Image
                          alt={chain.name ?? "Chain icon"}
                          src={chain.iconUrl}
                          height={200}
                          width={200}
                          className="size-5"
                        />
                      )}
                    </div>
                  )}
                </Button>
                <Button
                  onClick={openAccountModal}
                  size="icon_sm"
                  className="rounded-full"
                  variant="ghost"
                >
                  <Wallet className="scale-125" />
                </Button>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default function ConnectButton(props: Props) {
  return (
    <RaninbowConnectButton.Custom {...props}>
      {(renderProps) => <WalletButton {...renderProps} />}
    </RaninbowConnectButton.Custom>
  );
}

export const Web3AuthChainSwitchModal = ({
  user,
  account,
  chain,
  isSmallScreen,
  fixed,
  openAccountModal
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { chainId } = useActiveWeb3React();
  const { setSelectedChain } = useSwitchChain();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="flex items-center justify-end gap-0 md:gap-4">
          {!isSmallScreen || fixed ? (
            <>
              <Button className="h-10 gap-2 rounded-full px-4" size="lg">
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground
                    }}
                    className="size-5 rounded-full"
                  >
                    {chain.iconUrl && (
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        height={100}
                        width={100}
                        className="size-5"
                      />
                    )}
                  </div>
                )}
                {chain.name && chain.name.length > 10
                  ? `${chain.name.slice(0, 10)}...`
                  : chain.name}
                <ChevronDown className="size-4" />
              </Button>
              <Button
                onClick={openAccountModal}
                variant="gradientOne"
                size="lg"
                className="hidden h-10 w-max gap-2 overflow-hidden px-0 md:flex"
              >
                <div className="bg-theme-orange-500 grid size-full place-items-center px-4">
                  {account.displayBalance ? account.displayBalance : ""}
                </div>
                {user ? (
                  <Image
                    src={
                      user.result.avatarImageUrl
                        ? getAvatarUrl(user.result.avatarImageUrl)
                        : "/images/avatar.png"
                    }
                    height={300}
                    width={300}
                    alt="avatar"
                    className="size-6 rounded-full"
                  />
                ) : (
                  <Image
                    src={account.ensAvatar ? account.ensAvatar : "/images/avatar.png"}
                    alt="avatar"
                    height={200}
                    width={200}
                    className="size-6 rounded-full"
                  />
                )}
                <span className="pr-6">{user ? user.result?.username : account.displayName}</span>
              </Button>
            </>
          ) : (
            <>
              <Button size="icon_sm" className="rounded-full" variant="ghost">
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground
                    }}
                    className="size-5 rounded-full"
                  >
                    {chain.iconUrl && (
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        src={chain.iconUrl}
                        height={200}
                        width={200}
                        className="size-5"
                      />
                    )}
                  </div>
                )}
              </Button>
              <Button
                onClick={openAccountModal}
                size="icon_sm"
                className="rounded-full"
                variant="ghost"
              >
                <Wallet className="scale-125" />
              </Button>
            </>
          )}
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>Switch Networks</DialogHeader>
        <div>
          {chains.map((chain) => (
            <div>
              <Button onClick={() => setSelectedChain(chain.id)}> {chain.id}</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
