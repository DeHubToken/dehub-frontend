"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { truncate } from "lodash";
import { AlertTriangle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import dayjs from "@/libs/dayjs";
import { createAvatarName } from "@/libs/utils";

import { getReportsByTokenId } from "@/services/user-report";

import { getAvatarUrl } from "@/web3/utils/url";

export const ReportListModal = ({ tokenId }: { tokenId: number | null }) => {
  const [open, setOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (tokenId) {
      fetchReports(tokenId);
    }
  }, [tokenId]);

  const fetchReports = async (tokenId: number) => {
    setLoading(true);
    try {
      const res = await getReportsByTokenId(tokenId);
      if (!res.success) {
        console.log("Failed to get reports", res.error);
        setLoading(false);
        return;
      }
      setReports(res.data.reports);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching reports:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AlertTriangle className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="shadow-lg max-w-lg rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex"> <AlertTriangle   />  &nbsp;<span> Users Report #{tokenId}</span></DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-center">No reports available for this tokenId.</div>
        ) : (
          <div className="max-h-[80vh] space-y-4 overflow-scroll">
            {reports.map((data, index) => (
              <div
                key={index}
                className=" shadow-sm rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="size-10 rounded-full object-cover">
                    <AvatarFallback>
                      {createAvatarName(data.userDetails?.username || "User")}
                    </AvatarFallback>
                    <AvatarImage
                      src={getAvatarUrl(data?.userDetails?.avatarImageUrl || "")}
                    />
                  </Avatar>
                  <Link
                    href={`/${data?.userDetails?.username || data?.userDetails?.address}`}
                    className="font-medium"
                  >
                    {truncate(data?.userDetails?.username || data?.userDetails?.address)}
                  </Link>
                </div>
                <p className="text-sm">{data?.description ?? "No Description provided"}</p>
                <p className="text-xs text-muted-foreground">
                  {dayjs(data.createdAt).fromNow()}
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
