import type { TProfile } from "../utils";

import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "sonner";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getSignInfo } from "@/web3/utils/web3-actions";

import { changeProfileModeAtom, getFilesAtom } from "@/stores";

import { update } from "../actions";
import { buildProfileFormData } from "../utils";

export function useUpdateProfile() {
  const { account, library } = useActiveWeb3React();
  const updatedImageFiles = useAtomValue(getFilesAtom);
  const changeProfileMode = useSetAtom(changeProfileModeAtom);
  const queryClient = useQueryClient();

  async function updateProfile(data: TProfile) {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }
    // TODO: Handle metamast error (user reject the transaction)
    const sign = await getSignInfo(library, account);

    const formData = buildProfileFormData(data);
    formData.append("address", account);
    formData.append("sig", sign.sig);
    formData.append("timestamp", sign.timestamp);
    if (updatedImageFiles.avatarFile) {
      formData.append("avatarImg", updatedImageFiles.avatarFile);
    }
    if (updatedImageFiles.bannerFile) {
      formData.append("coverImg", updatedImageFiles.bannerFile);
    }

    toast.promise(update(formData), {
      loading: "Updating profile...",
      success: (res) => {
        if (!res.success) {
          throw new Error(res.error);
        }
        queryClient.invalidateQueries({ queryKey: ["account", account] });
        changeProfileMode();
        return "Profile updated successfully";
      },
      error: (err) => err.message
    });
  }

  return { updateProfile };
}
