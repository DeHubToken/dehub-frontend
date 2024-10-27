import Image from "next/image";
import ImagePlacehoder from "@/assets/image-placeholder.png";

export function FeedContent() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-theme-monochrome-300 text-base">
        Post Description here, text will be shown here, this is just a dummy description that is
        being used here to show scale ability.{" "}
      </p>
    </div>
  );
}
