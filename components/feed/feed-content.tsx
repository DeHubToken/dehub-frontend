import Image from "next/image";
import ImagePlacehoder from "@/assets/image-placeholder.png";

interface Props {
  description: string;
  name: string;
}
export function FeedContent({ name, description }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p>{name}</p>
      <p className="text-theme-monochrome-300 text-base max-h-40 overflow-scroll">{description}</p>
    </div>
  );
}
