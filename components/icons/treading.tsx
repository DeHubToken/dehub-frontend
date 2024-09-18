import type { SVGProps } from "react";

import * as React from "react";

const Treading = (props: SVGProps<SVGSVGElement>) => (
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
        d="M1.942 11.642a.612.612 0 0 1 0-.883l3.466-3.5c.24-.24.535-.359.888-.359s.648.12.887.358L8.908 9l3.475-3.425h-1.125a.602.602 0 0 1-.441-.183.602.602 0 0 1-.184-.442c0-.172.061-.32.184-.442a.602.602 0 0 1 .441-.183h2.617c.172 0 .32.061.442.183.122.123.183.27.183.442v2.617c0 .172-.061.32-.183.441a.602.602 0 0 1-.442.184.602.602 0 0 1-.442-.184.602.602 0 0 1-.183-.441V6.442L9.8 9.892a1.205 1.205 0 0 1-.888.358c-.352 0-.648-.12-.887-.358L6.3 8.167l-3.475 3.466a.602.602 0 0 1-.442.184.617.617 0 0 1-.441-.175Z"
      />
    </g>
  </svg>
);
export default Treading;
