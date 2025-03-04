"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { NFT } from "@/services/nfts";
import { reasonReportFeed } from "@/services/user-report";

import { getSignInfo } from "@/web3/utils/web3-actions";

export const FeedReportDialog = ({ post }: { post: NFT }) => {
  const [open, setOpen] = useState(false);
  const { account, library }: any = useActiveWeb3React();
  const [reason, setReason] = useState("");
  const postType = post.postType ?? "video";

  const reportFeedHandler = async () => {
    try {
      const sig = await getSignInfo(library, account);

      if (!sig?.sig || !sig?.timestamp) {
        toast.error("Failed to submit the report. Please try again. ❌");
        return;
      }

      const res: any = await reasonReportFeed(
        post.tokenId,
        reason,
        account,
        sig.sig,
        sig.timestamp
      );

      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success(res?.data?.message ?? "Report added successfully");
      setReason("");
      setOpen(false);
      return;
    } catch (error: any) {
      console.error("Error reporting feed:", error);
      toast.error(error.message || "Failed to submit the report. Please try again. ❌");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full bg-red-700" variant="secondary">
          <AlertTriangle className="size-5" /> &nbsp;&nbsp;Report
        </Button>
      </DialogTrigger>{" "}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Send a report to the Feed on
            <Link href={postType === "video" ? `/stream/${post.tokenId}` : `/feed/${post.tokenId}`}>
              #{post.tokenId}
            </Link>
          </DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Reason for report (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-4"
        />

        <DialogFooter className="mt-4 flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(false);
              setReason("");
            }}
          >
            Cancel
          </Button>
          <Button variant="ghost" onClick={reportFeedHandler}>
            Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
