import "server-only";

import type { User } from "@/stores/atoms/user";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import { formatToUsDate } from "@/libs/date-time";

import { AccountInformationForm } from "./account-information-form";
import { InformationPanel } from "./information-panel";
import { ProfileModeSwitcher } from "./profile-mode-switcher";
import TokensList from "./token-list";

type Props = { user: User };

export function UserInfo(props: Props) {
  const { user } = props;

  return (
    <ProfileModeSwitcher
      view={<InformationPanel user={user} />}
      edit={<AccountInformationForm user={user} />}
    />
  );
}
