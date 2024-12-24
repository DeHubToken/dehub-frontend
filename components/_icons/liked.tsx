import type { SVGProps } from "react";

import * as React from "react";

const Liked = (props: SVGProps<SVGSVGElement>) => (
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
        d="M13.917 5.433c.328 0 .618.127.87.38.253.252.38.543.38.87v1.3c0 .078-.007.16-.021.246a1.186 1.186 0 0 1-.063.238l-1.966 4.583a1.247 1.247 0 0 1-.488.558 1.29 1.29 0 0 1-.712.225H6.5c-.344 0-.639-.122-.883-.366a1.204 1.204 0 0 1-.367-.884V5.95c0-.167.033-.326.1-.48.067-.152.158-.287.275-.403L9.05 1.65c.178-.172.383-.276.617-.312a1.005 1.005 0 0 1 1.083.62c.089.217.106.442.05.675l-.683 2.8h3.8Zm-11.159 8.4c-.344 0-.637-.12-.879-.362a1.197 1.197 0 0 1-.362-.88V6.676c0-.344.12-.637.362-.88.242-.24.535-.362.88-.362.344 0 .637.121.879.363.241.242.362.535.362.879v5.917c0 .344-.12.637-.362.879a1.197 1.197 0 0 1-.88.362Z"
      />
    </g>
  </svg>
);
export default Liked;
