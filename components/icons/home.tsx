import type { SVGProps } from "react";

import * as React from "react";

const Home = (props: SVGProps<SVGSVGElement>) => (
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
      <path fill="#D9D9D9" d="M0 0h16v16H0z" />
    </mask>
    <g mask="url(#a)">
      <path
        fill="#CDCECF"
        d="M2.817 11.933V6.017c0-.2.043-.388.129-.563.086-.175.21-.32.37-.437l3.934-2.95c.222-.167.472-.25.75-.25s.528.083.75.25l3.933 2.95c.161.116.285.262.371.437.086.175.13.363.13.563v5.916c0 .345-.123.64-.367.884a1.204 1.204 0 0 1-.884.366H10A.602.602 0 0 1 9.558 13a.602.602 0 0 1-.183-.442v-3.35a.602.602 0 0 0-.183-.441.602.602 0 0 0-.442-.184h-1.5a.602.602 0 0 0-.442.184.602.602 0 0 0-.183.441v3.35c0 .172-.061.32-.183.442a.602.602 0 0 1-.442.183H4.067c-.345 0-.64-.122-.884-.366a1.204 1.204 0 0 1-.366-.884Z"
      />
    </g>
  </svg>
);
export default Home;
