import React from "react";
 
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
 
import { useMessage } from "./provider";

const TipModal = () => {
  const { toggleTipModal: isOpen, handleToggleTipModal }: any = useMessage("BlockModal");

  return (
    <Dialog open={isOpen} onOpenChange={handleToggleTipModal}>
      <DialogContent>
        <h2 className="mb-4 text-lg font-bold">Tip</h2>
      </DialogContent>
    </Dialog>
  );
};

export default TipModal;
