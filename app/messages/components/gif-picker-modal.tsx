import React from "react";
import dynamic from "next/dynamic";
import { TenorImage, Theme } from "gif-picker-react";
import { CircleX } from "lucide-react";

import { env } from "@/configs";

import { useMessage } from "./provider";
import { useTheme } from "next-themes";

// Dynamically import GifPicker with no server-side rendering
const GifPicker = dynamic(() => import("gif-picker-react"), { ssr: false });

export function GifPickerModal() {
  const { input, setInput, toggleGif, handleToggleGif, sendMessage }: any =
    useMessage("GifPickerModal");
  const {theme} =   useTheme()
  return (
    toggleGif && (
      <div className="Gif-Modal">
        <button  onClick={handleToggleGif}>
          <CircleX />
        </button>
        <GifPicker
          width={"100%"}
          height={256}
          theme={theme=="dark"?Theme.DARK:theme=="light"?Theme.LIGHT:Theme.AUTO}
          onGifClick={({ url }: { url: string }) => {
            sendMessage(input, url, "gif");
            handleToggleGif(false);
            setInput("");
          }}
          tenorApiKey={env.tenor_api_key || ""}
        />
      </div>
    )
  );
}
