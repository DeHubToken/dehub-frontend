 
import {
  Dialog,
  DialogContent, 
  DialogHeader, 
} from "@/components/ui/dialog";

import { useMessage } from "./provider";

export const MediaUploader = () => {
  const { toggleMedia, handleToggleMedia }: any = useMessage("MediaUploader");
  return (
    <Dialog open={toggleMedia} onOpenChange={handleToggleMedia}>
      <DialogContent className="max-w-[1400px] sm:rounded-3xl">
        <DialogHeader className="flex flex-row gap-4">
          <h3>Drag & Drop to Upload</h3>
        </DialogHeader>
        <div className="mt-8 flex flex-col gap-6">i am media MediaUploader</div>
      </DialogContent>
    </Dialog>
  );
};
