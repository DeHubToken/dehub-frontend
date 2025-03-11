import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { fetchUserDmStatus, updateUserDmStatus } from "@/services/dm";

import { useMessage } from "./provider";

export const UserDMStatusModal = () => {
  const { toggleUserDMStatusModal, handleToggleUserDMStatusModal } =
    useMessage("UserDMStatusModal");
  const { account }: any = useActiveWeb3React();

  // Local state for form fields
  const [status, setStatus] = useState<"NEW_DM" | "ALL" | "ACTIVE_ALL">("ACTIVE_ALL");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Fetch the existing DM status when the modal opens
  useEffect(() => {
    const fetchStatus = async () => {
      if (!account) return;

      setFetching(true);
      try {
        const response: any = await fetchUserDmStatus(account);
        console.log("DM Status Response:", response);

        const userData = response?.data?.data;

        if (!userData || userData.length === 0) {
          setStatus("ACTIVE_ALL"); // No restrictions
        } else if (userData.includes("NEW_DM")) {
          setStatus("NEW_DM"); // Block new DMs
        } else if (userData.includes("ALL")) {
          setStatus("ALL"); // Block all chats
        }
      } catch (error: any) {
        toast.error("Failed to fetch DM status.");
      } finally {
        setFetching(false);
      }
    };

    if (toggleUserDMStatusModal) fetchStatus();
  }, [toggleUserDMStatusModal, account]);

  // Function to handle API call
  const handleUpdateStatus = async (selectedStatus: "NEW_DM" | "ACTIVE_ALL" | "ALL") => {
    if (!account) {
      toast.error("Please connect with your wallet.");
      return;
    }

    setLoading(true);

    try {
      await updateUserDmStatus({
        address: account,
        status: selectedStatus,
        action: selectedStatus === "ACTIVE_ALL" ? "enable" : "disable"
      });

      setStatus(selectedStatus);
      toast.success("DM status updated successfully.");
      handleToggleUserDMStatusModal(); // Close modal after update
    } catch (err: any) {
      toast.error(err.message || "Failed to update DM status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={toggleUserDMStatusModal} onOpenChange={handleToggleUserDMStatusModal}>
      <DialogContent className="max-w-md p-6 sm:rounded-3xl">
        <DialogTitle className="text-lg font-semibold">Manage DM Restrictions</DialogTitle>
        <DialogDescription>Select who can message you.</DialogDescription>

        <AlertDialogHeader className="flex flex-col gap-4">
          <Label className="text-sm font-medium">Select DM Restriction:</Label>

          {/* Radio Group for Restriction Selection */}
          <RadioGroup
            value={status}
            onValueChange={(value) => handleUpdateStatus(value as "NEW_DM" | "ALL" | "ACTIVE_ALL")}
            disabled={loading || fetching}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="NEW_DM" id="new_dm" />
              <Label htmlFor="new_dm">Block New DMs</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="ALL" id="all_chats" />
              <Label htmlFor="all_chats">Block All Chats</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="ACTIVE_ALL" id="enable_dm" />
              <Label htmlFor="enable_dm">Enable All DMs</Label>
            </div>
          </RadioGroup>
        </AlertDialogHeader>

        <div className="mt-4 flex gap-4">
          <Button
            className="w-full"
            onClick={() => handleToggleUserDMStatusModal()}
            disabled={loading || fetching}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
