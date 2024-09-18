import type { SVGProps } from "react";

import * as React from "react";

const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={6} height={7} fill="none" {...props}>
    <mask
      id="a"
      width={6}
      height={7}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha"
      }}
    >
      <path fill="#D9D9D9" d="M0 .5h6v6H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill="#9B9C9E"
        d="M2.609 4.853.109 2.57A.3.3 0 0 1 0 2.338c0-.086.035-.164.104-.234C.173 2.034.263 2 .374 2h5.248a.37.37 0 0 1 .274.104c.07.069.104.148.104.236 0 .02-.037.098-.11.233L3.39 4.853a.537.537 0 0 1-.185.112.622.622 0 0 1-.412 0 .537.537 0 0 1-.185-.112Z"
      />
    </g>
  </svg>
);
export default ChevronDown;
