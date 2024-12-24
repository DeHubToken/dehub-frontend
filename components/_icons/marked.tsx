import type { SVGProps } from "react";

import * as React from "react";

const Marked = (props: SVGProps<SVGSVGElement>) => (
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
        d="m6.75 12.55-3.008 1.5a.591.591 0 0 1-.609-.02.586.586 0 0 1-.3-.538V5.25c0-.344.123-.639.367-.883.244-.245.539-.367.883-.367h5.334c.344 0 .639.122.883.367.244.244.367.539.367.883v8.242c0 .239-.1.418-.3.537a.59.59 0 0 1-.609.021l-3.008-1.5Zm5.792-.65a.602.602 0 0 1-.442-.183.602.602 0 0 1-.183-.442V2.75H5.408a.602.602 0 0 1-.441-.183.602.602 0 0 1-.184-.442c0-.172.061-.32.184-.442a.602.602 0 0 1 .441-.183h6.509c.344 0 .639.122.883.367.244.244.367.539.367.883v8.525c0 .172-.061.32-.184.442a.602.602 0 0 1-.441.183Z"
      />
    </g>
  </svg>
);
export default Marked;
