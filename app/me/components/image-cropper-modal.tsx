"use client";

import { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { ImageCropper } from "@/components/image-cropper";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { getCroppedImageAtom, saveCroppedImageAtom, showCropperAtom } from "@/stores/atoms/profile";

export function ImageCropperModal() {
  const [preview, setPreview] = useState<string | null>(null);

  const croppingImage = useAtomValue(getCroppedImageAtom);
  const saveCroppedImage = useSetAtom(saveCroppedImageAtom);
  const [showCropperModal, setShowCropperModal] = useAtom(showCropperAtom);

  const open = !!showCropperModal;

  return (
    <Dialog open={open} onOpenChange={setShowCropperModal}>
      <DialogContent className="max-w-2xl">
        <ImageCropper src={croppingImage || ""} onComplete={(preview) => setPreview(preview)} />
        <Button
          disabled={!preview}
          onClick={() => {
            if (!preview) return;
            saveCroppedImage({ preview });
            setPreview(null);
          }}
        >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
