import React, { memo, useEffect } from "react";
import dynamic from "next/dynamic";

import { useMessage } from "./provider";
import { CircleX } from "lucide-react";
import { useTheme } from "next-themes";

// Dynamically import EmojiPicker with suspense support
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const CustomEmojiPicker = memo(() => {
  const { setInput, toggleEmoji, handleToggleEmoji }: any = useMessage("CustomEmojiPicker");
  const { theme = "dark" } = useTheme();
const pickerTheme = theme === "light" || theme === "dark" ? theme : "auto";
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleToggleEmoji();
      }
    };

    if (toggleEmoji) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Cleanup the event listener on component unmount or when `open` changes
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleEmoji]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div>
        {toggleEmoji && (
           <button  onClick={handleToggleEmoji}>
          <CircleX />
        </button>
        )}
        <EmojiPicker
          open={toggleEmoji}
          style={{ width: "100%" }}
          searchDisabled={true}
          lazyLoadEmojis={true}
          autoFocusSearch={false}
          //@ts-ignore
          theme={pickerTheme}
          onEmojiClick={(data) => {
            setInput((inp: string) => inp + data.emoji);
          }}
        />
      </div>
    </div>
  );
});

export default CustomEmojiPicker;
