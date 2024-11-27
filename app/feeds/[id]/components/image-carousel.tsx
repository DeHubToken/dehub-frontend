"use client";

import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { getImageUrlApiSimple } from "@/web3/utils/url";
import Image from "next/image";

// Adjust the import path
interface Props{
  images: string[];
}
const ImageCarousel = ({ images }:Props) => {
  return (
    <Carousel className="relative mx-auto h-auto w-full max-w-4xl" opts={{ loop: true }}>
      {/* Carousel content */}
      <CarouselContent className="flex h-auto space-x-4">
        {images.map((image, index) => (
          <CarouselItem key={index} className="relative w-full">
            <img
              src={`${getImageUrlApiSimple(image)}`}
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
