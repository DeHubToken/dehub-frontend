"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AvatarFallback, AvatarImage, Avatar as AvatarRoot } from "@/ui/avatar";

import { createContext } from "@/libs/context";
import { SignGuardModal } from "@/components/modals/sign-guard-modal";

const UserNameModal = dynamic(
  () => import("../components/modals/username-modal").then((m) => m.UserNameModal),
  { ssr: false }
);

type Props = { children: React.ReactNode };

type State = {
  data: string | null;
  setData: (data: string) => void;
};

const [Provider, useAvatarWallerProvider] = createContext<State>("AvatarContext");

export type AvatarComponentProps = {
  address: string;
  ensImage?: string | null;
  size: number;
};

function Avatar(props: AvatarComponentProps) {
  const { size } = props;
  const { data } = useAvatarWallerProvider("Avatar");
  return (
    <Link href="/me" style={{ width: size, height: size, borderRadius: 999 }}>
      <AvatarRoot>
        <AvatarFallback>ME</AvatarFallback>
        <AvatarImage src={data || "/avatar.png"} />
      </AvatarRoot>
    </Link>
  );
}

export function AvatarWalletProvider(props: Props) {
  const [data, setData] = useState<string | null>(null);

  return (
    <Provider data={data} setData={setData}>
      {props.children}
      <SignGuardModal />
      <UserNameModal />
    </Provider>
  );
}
export { useAvatarWallerProvider };
