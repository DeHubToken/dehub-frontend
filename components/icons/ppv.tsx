import type { SVGProps } from "react";

import * as React from "react";

const PPV = (props: SVGProps<SVGSVGElement>) => (
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
        d="M7.342 9.983V8.667h1.316v1.316H7.342ZM6.683 4h2.634V2.75H6.683V4ZM2.75 13.833c-.344 0-.638-.122-.883-.367a1.203 1.203 0 0 1-.367-.883V9.95h4.592v.658c0 .173.06.32.183.442.122.122.27.183.442.183h2.566c.173 0 .32-.06.442-.183a.602.602 0 0 0 .183-.442V9.95H14.5v2.633c0 .344-.122.638-.367.883a1.204 1.204 0 0 1-.883.367H2.75ZM1.5 8.7V5.25c0-.344.122-.638.367-.883S2.407 4 2.75 4h2.683V2.75c0-.345.123-.639.368-.883.244-.245.539-.367.882-.367h2.634c.343 0 .638.122.883.367.244.245.367.54.367.883V4h2.683c.344 0 .638.122.883.367s.367.54.367.883V8.7H9.908v-.658a.602.602 0 0 0-.183-.442.602.602 0 0 0-.442-.183H6.717a.602.602 0 0 0-.442.183.602.602 0 0 0-.183.442V8.7H1.5Z"
      />
    </g>
  </svg>
);
export default PPV;
