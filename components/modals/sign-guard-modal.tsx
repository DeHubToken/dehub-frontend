"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getSignInfo, isSignatureValid, readSignatureCookie } from "@/web3/utils/web3-actions";

import { isSignedAtom } from "@/stores";

// Schema to validate that user has signed
const schema = z.object({
  placeholder: z.literal(true)
});

type TSchema = z.infer<typeof schema>;

/**
 * A blocking dialog that forces signature before using the page.
 */
export function SignGuardModal() {
  const { library, account } = useActiveWeb3React();
  const isSigned = useAtomValue(isSignedAtom);
  const setIsSigned = useSetAtom(isSignedAtom);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  // Only show modal and run logic if connected
  useEffect(() => {
    if (!account || !library) return;
    try {
      setStatus("loading");
      const data = readSignatureCookie();
      const existing = data[account];
      if (existing && existing.isActive && isSignatureValid(existing, account)) {
        setIsSigned(true);
        setStatus("idle");
      } else {
        setIsSigned(false);
        setStatus("idle");
      }
    } catch (e: any) {
      setError(e.message || "Cookie validation failed");
      setStatus("error");
      setIsSigned(false);
    }
  }, [account, library, setIsSigned]);

  // If not connected, do not show modal or check signature
  if (!account || !library) return null;
  if (isSigned) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus("loading");
      const data = readSignatureCookie();
      const existing = data[account];
      if (existing && existing.isActive && isSignatureValid(existing, account)) {
        setIsSigned(true);
      } else {
        await getSignInfo(library, account);
        setIsSigned(true);
      }
    } catch (e: any) {
      setError(e.message || "Signing failed");
      setStatus("error");
    }
  };

  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Please Sign to Continue</DialogTitle>
          <DialogDescription className="mt-2">
            You must sign our authentication message to use this site. Click below to sign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-4">
          {error && <p className="text-center text-red-500">{error}</p>}
          <Button
            type="submit"
            variant="gradientOne"
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" ? "Signing..." : "Sign Message"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
