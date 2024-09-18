"use client";

import { useAtomValue, useSetAtom } from "jotai";

import { Button } from "@/components/ui/button";

import { cn } from "@/libs/utils";

import { changeProfileModeAtom, profileModeAtom } from "@/stores/atoms/profile";

export function EditProfileButton() {
  const profileEditMode = useAtomValue(profileModeAtom);
  const changeProfileMode = useSetAtom(changeProfileModeAtom);
  const message = profileEditMode === "view" ? "Edit profile" : "Cancel";

  return (
    <Button
      className="absolute right-3 top-3 z-10 gap-2 rounded-full sm:right-5 sm:top-5"
      size="sratch"
      onClick={changeProfileMode}
    >
      {message}
    </Button>
  );
}

type CancelButtonProps = React.ComponentProps<typeof Button>;

export function CancelButton(props: CancelButtonProps) {
  const { className, ...rest } = props;
  const changeProfileMode = useSetAtom(changeProfileModeAtom);

  return (
    <Button
      variant="secondary"
      size="sratch"
      className={cn("gap-2 rounded-full py-5", className)}
      type="button"
      {...rest}
      onClick={() => changeProfileMode()}
    >
      Cancel
    </Button>
  );
}
