import type { SVGProps } from "react";

import * as React from "react";

const Scroll = (props: SVGProps<SVGSVGElement>) => (
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
        d="M5.4 13.183a.595.595 0 0 1-.437-.179.595.595 0 0 1-.18-.437V3.433c0-.172.06-.318.18-.437.119-.12.265-.18.437-.18h5.2c.172 0 .318.06.438.18.119.12.179.265.179.437v9.134c0 .172-.06.318-.18.437a.595.595 0 0 1-.437.18H5.4Zm-3.2-1.925V4.725c0-.172.061-.317.183-.433a.617.617 0 0 1 .442-.175c.172 0 .32.06.442.183.122.122.183.27.183.442v6.533a.575.575 0 0 1-.183.433.617.617 0 0 1-.442.175.602.602 0 0 1-.442-.183.602.602 0 0 1-.183-.442Zm10.35 0V4.725c0-.172.061-.317.183-.433a.617.617 0 0 1 .442-.175c.172 0 .32.06.442.183.122.122.183.27.183.442v6.533a.575.575 0 0 1-.183.433.617.617 0 0 1-.442.175.602.602 0 0 1-.442-.183.602.602 0 0 1-.183-.442Z"
      />
    </g>
  </svg>
);
export default Scroll;
