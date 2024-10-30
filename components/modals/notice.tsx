"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function NoticeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("notice")) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleAccept = () => {
    localStorage.setItem("notice", "true");
    setShow(false);
  };

  return (
    <div className="fixed left-0 top-0 z-[1000] grid size-full place-items-center">
      {/* content */}
      <div className="relative z-10 flex size-auto max-w-full flex-col items-center justify-center gap-10 rounded-2xl bg-background p-10 text-center sm:max-w-xl">
        <h1 className="text-3xl text-blue-300">Important Notice</h1>
        <h1 className="text-xl leading-10">
          DeHub is in public test beta and constantly shipping updates, so users may experience
          temporary UIX issues. All core developments are scheduled to complete by Q1 2025
        </h1>
        <Button variant="gradientOne" className="w-full" onClick={handleAccept}>
          I Understand
        </Button>
      </div>

      {/* overlay */}
      <div className="absolute left-0 top-0 z-0 size-full bg-black/25 backdrop-blur-sm"></div>
    </div>
  );
}
