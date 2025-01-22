"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

import { useActiveWeb3React } from "@/hooks/web3-connect";

import { getImageUrlApiSimple } from "@/web3/utils/url";
import { getSignInfo } from "@/web3/utils/web3-actions";

// Adjust the import path
interface Props {
  images: string[];
}
const ImageCarousel = ({ images }: Props) => {
  const [signData, setSignData] = useState<{ sig: string; timestamp: string }>({
    timestamp: "",
    sig: ""
  });
  const { account, library, chainId } = useActiveWeb3React();
  useEffect(() => {
    const storedAccount = sessionStorage.getItem("storedAccount");
    // If no stored account, this is the first time, so just store the account and do nothing else
    if (!storedAccount && account) {
      sessionStorage.setItem("storedAccount", account);
    } else if (account && account !== storedAccount) {
      sessionStorage.setItem("storedAccount", account);
      window.location.reload();
      return;
    }
    if (storedAccount !== account) {
      syncSigData();
    }
  }, [account]);

  const syncSigData = async () => {
    if (!account) {
      setSignData({ sig: "", timestamp: "" });
      return;
    }
    const result = await getSignInfo(library, account);
    if (result && result.sig && result.timestamp) {
      setSignData({ sig: result.sig, timestamp: result.timestamp });
    } else {
      setSignData({ sig: "", timestamp: "" });
    }
  };

  return (
    <Carousel className="relative mx-auto h-auto w-full max-w-4xl" opts={{ loop: true }}>
      {/* Carousel content */}
      <CarouselContent className="flex h-auto space-x-4">
        {images.map((image, index) => (
          <CarouselItem key={index} className="relative w-full">
            <img
              src={`${getImageUrlApiSimple(image)}?address=${account}&sig=${signData?.sig}&timestamp=${signData?.timestamp}`}
              alt={`Slide ${index + 1}`}
              className="h-auto w-full rounded-lg object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation buttons */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <CarouselPrevious />
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <CarouselNext />
      </div>
    </Carousel>
  );
};

export default ImageCarousel;
