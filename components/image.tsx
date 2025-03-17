"use client";

import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

type Props = React.ComponentProps<typeof LazyLoadImage>;

function _LazyImage(props: Props) {
  return <LazyLoadImage {...props} />;
}

export const LazyImage = memo(_LazyImage, (prev, next) => prev.src === next.src);
