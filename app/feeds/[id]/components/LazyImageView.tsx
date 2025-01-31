"use client";

import React from "react";

import { LazyImage } from "@/components/image";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getImageUrlApi } from "@/web3/utils/url";

type Props = {
  item: any;
};

const LazyImageView = (props: Props) => {
  const { item } = props;
  const { account } = useActiveWeb3React();
  return (
    <LazyImage
      src={getImageUrlApi(item.tokenId.toString(), account, 256, 256)}
      alt={item.name || "Upload"}
      className="size-full object-cover"
    />
  );
};

export default LazyImageView;
