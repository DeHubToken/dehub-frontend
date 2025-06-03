import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { deleteAllMessages } from "@/services/dm";

import { messages } from "../utils";
import { useMessage } from "./provider";

export const DeleteChatModal = () => {
  const {
    toggleDeleteChat = false,
    selectedMessageId,
    handleToggleDeleteChat,
    me = { role: "member" },
    setMessages
  }: any = useMessage("ConversationMoreOptions");
  const { account } = useActiveWeb3React();

  const handleDeleteChat = async () => {
    if (!account) {
      toast.error("Please connect to your wallet.");
      return;
    }

    try {
      const res: any = await deleteAllMessages(selectedMessageId, account);
      if (res.success) {
        toast.success(res.data.message);
        handleToggleDeleteChat();
        setMessages((prevMessages: any[]) =>
          prevMessages.map((item) =>
            item._id !== selectedMessageId ? item : { ...item, messages: [] }
          )
        );
      } else {
        toast.error("Failed to delete chat. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <Dialog open={toggleDeleteChat} onOpenChange={handleToggleDeleteChat}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
        </DialogHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
          <Label>
            Are you sure? If you delete the chat, the messages will be deleted from your side.
          </Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button autoFocus={true} onClick={handleToggleDeleteChat}>
            Cancel
          </Button>
          <Button onClick={handleDeleteChat}>Delete</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
