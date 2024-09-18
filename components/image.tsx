"use client";

import { LazyLoadImage } from "react-lazy-load-image-component";

type Props = React.ComponentProps<typeof LazyLoadImage>;

export function LazyImage(props: Props) {
  return <LazyLoadImage {...props} />;
}
