import type { SVGProps } from "react";

import * as React from "react";

const Contact = (props: SVGProps<SVGSVGElement>) => (
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
        d="M6.3 11.867H2.75c-.344 0-.638-.123-.883-.368a1.204 1.204 0 0 1-.367-.882V2.75c0-.344.122-.638.367-.883s.54-.367.883-.367h10.5c.344 0 .638.122.883.367s.367.54.367.883v7.867c0 .343-.122.638-.367.882a1.204 1.204 0 0 1-.883.368H9.7l-1.183 1.791a.594.594 0 0 1-.517.284.594.594 0 0 1-.517-.284L6.3 11.867Z"
      />
    </g>
  </svg>
);
export default Contact;
