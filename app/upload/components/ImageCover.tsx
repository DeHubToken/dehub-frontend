import React from "react";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/libs/utils";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const ImageCover = ({
  form,
  thumbnailFile,
  setThumbnailFile,
  setThumbnailPreview, 
  thumbnailPreview, 
}: any) => {

  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: { "image/*": [".jpg", ".jpeg", ".png"] },
    maxSize: 20_971_520, // 20MB
    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      setThumbnailFile(file);
      form.setValue("thumbnail", url);
    }
  });
  return (
    <>
      <div className="flex h-auto w-full flex-col flex-wrap items-center justify-start gap-4 sm:flex-row sm:flex-nowrap sm:gap-2">
        <p className="min-w-full text-lg leading-none sm:min-w-[20%]">
          Cover <br className="hidden sm:block" /> Image
        </p>

        <div className="h-auto w-full">
          <div
            className={cn(
              "relative h-40 max-h-40 w-full overflow-hidden rounded-3xl border border-dashed border-gray-200 bg-theme-mine-shaft-dark hover:cursor-pointer dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark",
              isDragAccept ? "border border-green-500" : "",
              isDragReject ? "border border-red-500" : ""
            )}
            {...getRootProps()}
          >
            {!thumbnailPreview && (
              <>
                <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2">
                  <ImagePlus className="size-10 text-gray-300 dark:text-theme-titan-white/60" />
                  <div className="flex size-auto flex-col items-center justify-center -space-y-1">
                    <p className="text-md">No File Chosen</p>
                    <p className="text-sm">(Recommended size: 1280x720)</p>
                  </div>
                </div>

                <input
                  type="file"
                  className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
                  {...getInputProps()}
                />
              </>
            )}

            {thumbnailPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <Image
                className="size-full rounded-3xl object-cover"
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                height={300}
                width={1000}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        {thumbnailFile && (
          <Button
            variant="gradientOne"
            size="sm"
            onClick={() => {
              setThumbnailPreview(null);
              setThumbnailFile(null);
              form.setValue("thumbnail", "");
            }}
          >
            Remove
          </Button>
        )}
      </div>
    </>
  );
};

export default ImageCover;
