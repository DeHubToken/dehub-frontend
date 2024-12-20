"use client";

import React from "react";

import CustomEmojiPicker from "./custom-emoji-picker";
import { GifPickerModal } from "./gif-picker-modal";
import { MediaUploader } from "./media-uploader";
import { useMessage } from "./provider";

type Props = {};

const ExtraInputs = (props: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <CustomEmojiPicker />
      <GifPickerModal />
      <MediaUploader />
    </div>
  );
};

export default ExtraInputs;
