"use client";

import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";

import { getVideoCover } from "@/libs/canvas-preview";
import { cn } from "@/libs/utils";

const VideoUploadTab = ({
  videoFile,
  setVideoPreview,
  setVideoFile,
  form,
  videoPreview,
  setThumbnailPreview,
  setThumbnailFile,
  thumbnailFile,
  thumbnailPreview
}: any) => {
  const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
    accept: { "video/*": [".mp4"] },
    maxSize: 1_000_000_000,
    onDrop(acceptedFiles) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      getVideoCover(file).then((cover) => {
        if (cover && !thumbnailFile && !thumbnailPreview) {
          const imgUrl = URL.createObjectURL(cover);
          form.setValue("thumbnail", imgUrl);
          setThumbnailPreview(imgUrl);
          setThumbnailFile(cover as File);
        }
      });
      setVideoPreview(url);
      setVideoFile(file);
      form.setValue("title", file.name.replace(/\.[^/.]+$/, ""));
      form.setValue("video", url);
    }
  });

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl">UPLOAD PREVIEW</h1>
        {videoFile && (
          <Button
            size="sm"
            variant="gradientOne"
            onClick={() => {
              setVideoPreview(null);
              setVideoFile(null);
              form.setValue("video", "");
            }}
          >
            Remove
          </Button>
        )}
      </div>
      <div
        {...getRootProps()}
        className={cn(
          "relative h-60 w-full rounded-3xl border border-dashed border-gray-200 border-theme-mine-shaft bg-theme-mine-shaft-dark hover:cursor-pointer lg:size-full",
          isDragAccept ? "border border-green-500" : "",
          isDragReject ? "border border-red-500" : ""
        )}
      >
        {!videoPreview && (
          <>
            <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-2">
              <Upload className="size-12 text-gray-300 text-theme-titan-white/60" />
              <div className="flex size-auto flex-col items-center justify-center">
                <p className="text-md">Drop or Select Video</p>
                <p className="text-sm">(Max Video File Size: 1GB)</p>
              </div>
            </div>
            <input
              type="file"
              className="absolute left-0 top-0 size-full cursor-pointer opacity-0"
              {...getInputProps()}
            />
          </>
        )}
        {videoPreview && (
          <video
            className="size-full rounded-3xl object-cover"
            src={videoPreview}
            controls
            autoPlay
            muted
            loop
          />
        )}
      </div>
    </>
  );
};
export default VideoUploadTab;
