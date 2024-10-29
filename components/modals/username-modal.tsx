"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useAtomValue } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { updateProfile } from "@/services/user";

import { getSignInfo } from "@/web3/utils/web3-actions";

import { isUsernameSetAtom } from "@/stores";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

const schema = z.object({
  username: z.string({ required_error: "This field is required" }).min(3, {
    message: "Username must be at least 3 characters long"
  })
});

type TSchema = z.infer<typeof schema>;

export function UserNameModal() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const { account, library } = useActiveWeb3React();
  const isUserNameSet = useAtomValue(isUsernameSetAtom);
  const form = useForm<TSchema>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" }
  });

  async function onSubmit(data: TSchema) {
    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }
    setStatus("loading");
    try {
      const sign = await getSignInfo(library, account);
      const formData = new FormData();
      formData.append("address", account);
      formData.append("sig", sign.sig);
      formData.append("timestamp", sign.timestamp);
      formData.append("username", data?.username);
      const res = await updateProfile(formData);
      if (!res.success) {
        toast.error(res.error);
        setStatus("error");
        return;
      }

      if (res.data.error) {
        toast.error(res.data.error_msg || "An error occurred. Please try again later.");
        return;
      }

      window.location.reload();
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
      setStatus("error");
      return;
    }
  }

  return (
    <Dialog open={!isUserNameSet}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Your username is missing!</DialogTitle>
          <DialogDescription className="mt-4">
            You need to set a username to use this app. This will be your public identity on the
            platform.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <Input placeholder="username" {...form.register("username")} />
            {form.formState.errors?.username && (
              <span className="text-red-500">{form.formState.errors?.username.message}</span>
            )}
          </div>
          <Button variant="gradientOne" type="submit" disabled={status === "loading"}>
            Set Username
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
