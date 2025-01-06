"use client";

import React from "react";

import BlockModal from "./block-modal";
import ConversationMoreOptionsModal from "./conversation-more-options-modal";
import CustomEmojiPicker from "./custom-emoji-picker";
import { GifPickerModal } from "./gif-picker-modal";
import { MediaUploader } from "./media-uploader";
import TipModal from "./tip-modal";

type Props = {};

const ExtraInputsAndNotice = (props: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <CustomEmojiPicker />
      <GifPickerModal />
      <MediaUploader />
      <BlockModal />
      <TipModal />
      <ConversationMoreOptionsModal />
    </div>
  );
};

export default ExtraInputsAndNotice;
