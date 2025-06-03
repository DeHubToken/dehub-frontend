import type { SVGProps } from "react";

import * as React from "react";

const Home = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M.225 15.175V6.3q0-.45.194-.844A1.76 1.76 0 0 1 .975 4.8l5.9-4.425Q7.375 0 8 0q.626 0 1.125.375l5.9 4.425q.363.263.556.656.195.394.194.844v8.875q0 .775-.55 1.325t-1.325.55H11a.9.9 0 0 1-.662-.275.9.9 0 0 1-.275-.662v-5.025a.9.9 0 0 0-.275-.663.9.9 0 0 0-.663-.275h-2.25a.9.9 0 0 0-.662.275.9.9 0 0 0-.275.662v5.026q0 .387-.275.662A.9.9 0 0 1 5 17.05H2.1q-.775 0-1.325-.55a1.8 1.8 0 0 1-.55-1.325"
      fill="currentColor"
    />
  </svg>
);
export default Home;
