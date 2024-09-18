"use client";

import { useEffect, useState } from "react";

export function TailwindIndicator() {
  const [currentWidth, setCurrentWidth] = useState<number>(0);
  useEffect(() => {
    const handleResize = () => setCurrentWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="font-mono fixed right-28 top-1/2 z-50 flex size-16 -translate-y-1/2 items-center justify-center rounded-full bg-gray-800 p-3 text-lg text-white">
      <div className="block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block 3xl:hidden">2xl</div>
      <div className="hidden 3xl:block 4xl:hidden">3xl</div>
      <div className="hidden 4xl:block 5xl:hidden">4xl</div>
      <div className="hidden 5xl:block">5xl</div>
      <div className="absolute left-20 w-max text-sm">Width: {currentWidth}px</div>
    </div>
  );
}
