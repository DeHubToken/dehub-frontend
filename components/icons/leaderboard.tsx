import type { SVGProps } from "react";

import * as React from "react";

const LeaderBoard = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1.188 18.375a.9.9 0 0 1-.663-.275.9.9 0 0 1-.275-.663V7.813q0-.387.275-.662a.9.9 0 0 1 .663-.275H4.5q.388 0 .662.275a.9.9 0 0 1 .276.662v9.625q0 .389-.276.663a.9.9 0 0 1-.662.275zm7.15 0a.9.9 0 0 1-.663-.275.9.9 0 0 1-.275-.663V1.813q0-.387.275-.662a.9.9 0 0 1 .663-.275h3.325q.387 0 .662.275a.9.9 0 0 1 .275.663v15.625q0 .387-.275.662a.9.9 0 0 1-.662.275zm7.162 0a.9.9 0 0 1-.662-.275.9.9 0 0 1-.275-.663V9.813q0-.387.274-.662a.9.9 0 0 1 .663-.275h3.313q.387 0 .662.275a.9.9 0 0 1 .275.662v7.626q0 .387-.275.662a.9.9 0 0 1-.663.275z"
      fill="currentColor"
    />
  </svg>
);
export default LeaderBoard;
