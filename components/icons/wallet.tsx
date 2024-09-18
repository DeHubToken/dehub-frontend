import type { SVGProps } from "react";

import * as React from "react";

const Wallet = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <mask
      id="a"
      width={16}
      height={16}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha"
      }}
    >
      <path fill="currentColor" d="M0 0h16v16H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill="currentColor"
        d="M4.125 13.319c-.768 0-1.42-.268-1.956-.805a2.662 2.662 0 0 1-.804-1.956V5.442c0-.768.268-1.42.804-1.956a2.663 2.663 0 0 1 1.956-.805h7.75c.768 0 1.42.268 1.956.805.536.536.805 1.188.805 1.956v5.116c0 .768-.269 1.42-.805 1.956a2.662 2.662 0 0 1-1.956.805h-7.75Zm.098-7.887h7.586c.255 0 .5.031.736.095s.455.157.657.28v-.365c0-.367-.13-.68-.388-.94a1.28 1.28 0 0 0-.939-.388h-7.75c-.367 0-.68.13-.939.389a1.28 1.28 0 0 0-.388.939v.384a2.67 2.67 0 0 1 1.425-.394ZM2.985 7.737l7.043 1.777c.11.028.221.028.333.002a.773.773 0 0 0 .305-.147l2.251-1.888a1.456 1.456 0 0 0-.469-.445 1.22 1.22 0 0 0-.639-.171H4.223c-.286 0-.54.08-.76.238-.222.158-.38.37-.478.634Z"
      />
    </g>
  </svg>
);
export default Wallet;
