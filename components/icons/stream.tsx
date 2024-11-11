import type { SVGProps } from "react";

import * as React from "react";

const Stream = (props: SVGProps<SVGSVGElement>) => (
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
        d="m7.35 9.625 2.733-1.75a.602.602 0 0 0 .284-.525.602.602 0 0 0-.284-.525L7.35 5.075a.595.595 0 0 0-.637-.03.573.573 0 0 0-.33.547v3.516c0 .25.11.432.33.546.219.114.431.104.637-.029Zm-4.6 2.908c-.344 0-.639-.122-.883-.366a1.204 1.204 0 0 1-.367-.884V3.4c0-.344.122-.639.367-.883.244-.245.539-.367.883-.367h10.5c.344 0 .639.122.883.367.245.244.367.539.367.883v7.883c0 .345-.122.64-.367.884a1.204 1.204 0 0 1-.883.366h-2.683v.692c0 .172-.061.32-.184.442a.602.602 0 0 1-.441.183H6.058a.602.602 0 0 1-.441-.183.602.602 0 0 1-.184-.442v-.692H2.75Z"
      />
    </g>
  </svg>
);
export default Stream;
