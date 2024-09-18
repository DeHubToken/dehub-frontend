"use client";

import type { Crop, PixelCrop, ReactCropProps } from "react-image-crop";

import { useRef, useState } from "react";
import { ReactCrop } from "react-image-crop";

import { canvasPreview } from "@/libs/canvas-preview";

import { Spinner } from "./ui/spinner";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  cropperProps?: Omit<ReactCropProps, "onChange" | "crop">;
  onComplete?: (preview: string | null) => void;
};

export function ImageCropper(props: Props) {
  const { cropperProps, onComplete, ...rest } = props;
  const [crop, setCrop] = useState<Crop>();

  const ref = useRef<HTMLImageElement>(null);

  const [loading, setLoading] = useState(false);

  const onCropComplete = (crop: PixelCrop) => {
    if (!ref.current) return;
    if (!crop.width || !crop.height) return;
    canvasPreview(ref.current, crop).then((preview) => {
      onComplete?.(preview);
    });
  };

  return (
    <ReactCrop
      crop={crop}
      onChange={(_, p) => setCrop(p)}
      {...cropperProps}
      onComplete={onCropComplete}
    >
      <div className="relative size-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Image preview" {...rest} onLoad={() => setLoading(false)} ref={ref} />
        {loading && (
          <div className="absolute inset-0 flex size-full flex-col items-center justify-center gap-2 bg-black/50">
            <Spinner />
            <span className="text-white">Loading image...</span>
          </div>
        )}
      </div>
    </ReactCrop>
  );
}
