"use client";

import { forwardRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

type InfiniteScrollScreenOffsetProps = React.HTMLAttributes<HTMLDivElement>;
export const InfiniteScrollScreenOffset = forwardRef<
  HTMLDivElement,
  InfiniteScrollScreenOffsetProps
>((props, ref) => <div {...props} ref={ref} className="pointer-events-none h-px w-px opacity-0" />);

interface Props {
  fetchMore: () => Promise<void> | void;
  canFetchMore: boolean;
}

export function useInfiniteScroll(props: Props) {
  const { fetchMore, canFetchMore } = props;
  const { ref: infiniteScrollRef, inView } = useInView({ rootMargin: "20px", threshold: 1 });

  useEffect(() => {
    if (inView && canFetchMore) {
      fetchMore();
    }
  }, [inView, canFetchMore]);

  return { infiniteScrollRef };
}
