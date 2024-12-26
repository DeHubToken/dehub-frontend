"use client";

import React from "react";

import TipModal from "@/app/stream/[id]/components/tip-modal";

import BlockModal from "./block-modal";
import CustomEmojiPicker from "./custom-emoji-picker";
import { GifPickerModal } from "./gif-picker-modal";
import { MediaUploader } from "./media-uploader";
import { useMessage } from "./provider";

type Props = {};

const ExtraInputsAndNotice = (props: Props) => {
  const {  blockState }:any = useMessage("ExtraInputsAndNotice");
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>
      <CustomEmojiPicker />
      <GifPickerModal />
      <MediaUploader />
      <BlockModal />
      {/* <UnBlockModal/> */}
      <div className="text-center">
        {true && <h4>Please Unblock to send Messages</h4>}
        {true && <h4>You Blocked</h4>}
      </div>
    </div>
  );
};

export default ExtraInputsAndNotice;
