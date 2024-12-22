import type { SVGProps } from "react";

import * as React from "react";

const XA = (props: SVGProps<SVGSVGElement>) => (
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
        d="M5.275 13.958a1.212 1.212 0 0 1-1.075-.625L1.475 8.625A1.223 1.223 0 0 1 1.3 8c0-.217.058-.425.175-.625L4.2 2.667a1.211 1.211 0 0 1 1.075-.625h5.45a1.212 1.212 0 0 1 1.075.625l2.725 4.708c.117.2.175.408.175.625 0 .217-.058.425-.175.625L11.8 13.333a1.212 1.212 0 0 1-1.075.625h-5.45Z"
      />
    </g>
  </svg>
);
export default XA;
