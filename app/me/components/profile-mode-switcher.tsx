"use client";

import { useAtomValue } from "jotai";

import { profileModeAtom } from "@/stores/atoms/profile";

type Props = {
  view: React.ReactNode;
  edit: React.ReactNode;
};

export function ProfileModeSwitcher(props: Props) {
  const { view, edit } = props;
  const profileMode = useAtomValue(profileModeAtom);
  if (profileMode === "view") return view;
  return edit;
}
