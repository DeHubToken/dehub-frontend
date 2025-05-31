"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Copy, CopyCheck } from "lucide-react";
import { useCopyToClipboard } from "react-use";
import { LIVEPEER_RTMP_SERVER } from "@/configs";

export function StreamExternalSetup({
  streamKey,
  isStreamingExternal,
  setIsStreamingExternal,
  minimal = false
}: {
  streamKey: string;
  isStreamingExternal?: boolean;
  setIsStreamingExternal?: React.Dispatch<React.SetStateAction<boolean>>;
  minimal?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [copiedURL, setCopiedURL] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();

  const handleCopy = (key: string, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    copyToClipboard(key);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  if (minimal) {
    return (
      <div className="flex flex-col items-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-[90px] text-right text-theme-neutrals-400">Stream Key:</span>
          <button
            onClick={() => handleCopy(streamKey, setCopied)}
            className="flex items-center gap-1 text-theme-neutrals-200 hover:text-theme-neutrals-100"
          >
            <span>
              {copied
                ? "Copied!"
                : `${streamKey.slice(0, 3)}••••${streamKey.slice(-3)}`}
            </span>
            {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-[90px] text-right text-theme-neutrals-400">Server URL:</span>
          <button
            onClick={() => handleCopy(LIVEPEER_RTMP_SERVER, setCopiedURL)}
            className="flex items-center gap-1 text-theme-neutrals-200 hover:text-theme-neutrals-100"
          >
            <span>{copiedURL ? "Copied!" : LIVEPEER_RTMP_SERVER}</span>
            {copiedURL ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setIsStreamingExternal?.((prev) => !prev)}
        className="flex items-center gap-2 text-theme-neutrals-200 transition-colors hover:text-theme-neutrals-100"
      >
        <span>Stream External Setup</span>
        {isStreamingExternal ? (
          <ChevronUp className="h-4 w-4 transition-transform duration-300" />
        ) : (
          <ChevronDown className="h-4 w-4 transition-transform duration-300" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isStreamingExternal && (
          <motion.div
            key="external-info"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-theme-border mt-2 flex flex-col gap-2 overflow-hidden rounded-md border p-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="min-w-[90px] text-theme-neutrals-400">Stream Key:</span>
              <button
                onClick={() => handleCopy(streamKey, setCopied)}
                className="flex items-center gap-1 text-theme-neutrals-200 hover:text-theme-neutrals-100"
              >
                <span>
                  {copied
                    ? "Copied!"
                    : `${streamKey.slice(0, 3)}••••${streamKey.slice(-3)}`}
                </span>
                {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="min-w-[90px] text-theme-neutrals-400">Server URL:</span>
              <button
                onClick={() => handleCopy(LIVEPEER_RTMP_SERVER, setCopiedURL)}
                className="flex items-center gap-1 text-theme-neutrals-200 hover:text-theme-neutrals-100"
              >
                <span>{copiedURL ? "Copied!" : LIVEPEER_RTMP_SERVER}</span>
                {copiedURL ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
