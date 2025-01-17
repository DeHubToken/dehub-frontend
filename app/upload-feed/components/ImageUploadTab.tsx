import { useState } from "react";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PreviewFile } from "../types";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const ImageUploadTab = ({ imagePreviews, setImagePreviews }: any) => {
  const [error, setError] = useState<string|null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    onDrop: (acceptedFiles: PreviewFile[], fileRejections: any) => {
      // Reset error state
      setError(null);

      // Custom check to allow only up to 5 files
      if (imagePreviews.length + acceptedFiles.length > 5) {
        setError("You can only upload a maximum of 5 images.");
        return;
      }

      // Check if there were rejected files
      if (fileRejections.length > 0) {
        setError("Only .jpg, .jpeg, and .png files are allowed.");
        return;
      }

      // Map files and generate preview URLs
      const newPreviews = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      setImagePreviews((prev:PreviewFile[]) => [...prev, ...newPreviews]);
    }
  });

  const removeImage = (index: number) => {
    setImagePreviews((prev: PreviewFile[]) =>
      prev.filter((_: PreviewFile, i: number) => i !== index)
    );
    if (imagePreviews.length <= 5 && error) {
      setError(null);
    }
  };
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl">UPLOAD PREVIEW</h1>
        {imagePreviews.length > 0 && (
          <Button
            size="sm"
            variant="gradientOne"
            onClick={() => setImagePreviews([])} // Clear all images
          >
            Remove All
          </Button>
        )}
      </div>

      <div
        {...getRootProps()}
        className="relative h-60 w-full rounded-3xl border border-dashed border-gray-200 bg-theme-mine-shaft-dark hover:cursor-pointer dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark lg:size-full"
      >
        {imagePreviews.length === 0 && (
          <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2">
            <ImagePlus className="size-12 text-gray-300 dark:text-theme-titan-white/60" />
            <div className="flex size-auto flex-col items-center justify-center">
              <p className="text-md">Drop or Select Images</p>
              <p className="text-sm">(Max Image File Size: 5MB)</p>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          max={5}
          className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
          {...getInputProps()}
        />
        {/* Preview images */}
        <div className="ml-4 mt-4 flex max-h-52 flex-wrap gap-4 overflow-x-scroll">
          {imagePreviews.map((file: PreviewFile, index: number) => (
            <div key={index} className="relative">
              <Image
                className="h-40 w-40 rounded-2xl object-cover"
                src={file?.preview||""}
                height={300}
                width={300}
                alt={file.name}
              />
              <Button
                size="sm"
                variant="gradientOne"
                className="absolute right-0 top-0"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering file input
                  removeImage(index); // Remove the image
                }}
              >
                Remove
              </Button>
            </div>
          ))}

          {error && <span className="text-red-600">{error}</span>}
        </div>
      </div>
    </>
  );
};
export default ImageUploadTab;
