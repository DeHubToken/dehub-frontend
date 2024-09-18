import { CircleOff } from "lucide-react";

import { Button } from "./ui/button";

export function OnlyDesktop() {
  return (
    <div className="fixed left-0 top-0 z-10 size-full flex-col items-center justify-center gap-4 p-5 2xs:flex lg:hidden">
      <CircleOff className="size-10 text-theme-orange-400" />
      <p className="text-center text-xl">
        This site is optimized for desktop. Please visit on a larger screen for the best experience.
      </p>
      <Button asChild variant="gradientOne" size="md">
        <a href="https://home.blockjerk.com">Home</a>
      </Button>
    </div>
  );
}
