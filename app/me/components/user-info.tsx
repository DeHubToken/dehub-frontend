import "server-only";

import type { User } from "@/stores/atoms/user";

import { AccountInformationForm } from "./account-information-form";
import { InformationPanel } from "./information-panel";
import { ProfileModeSwitcher } from "./profile-mode-switcher";

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
