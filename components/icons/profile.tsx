import type { SVGProps } from "react";

import * as React from "react";

const Profile = (props: SVGProps<SVGSVGElement>) => (
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
        d="M8 8.017a2.49 2.49 0 0 1-1.83-.755 2.49 2.49 0 0 1-.753-1.829c0-.716.251-1.326.754-1.829A2.49 2.49 0 0 1 8 2.85a2.49 2.49 0 0 1 1.83.754 2.49 2.49 0 0 1 .753 1.83 2.49 2.49 0 0 1-.754 1.828A2.49 2.49 0 0 1 8 8.017Zm-5.183 3.85v-.518c0-.366.093-.7.279-1.003.186-.303.437-.535.754-.696a10.087 10.087 0 0 1 2.054-.754 8.777 8.777 0 0 1 4.192 0c.691.17 1.376.42 2.054.754.316.161.568.393.754.696.186.303.28.637.28 1.004v.517c0 .343-.123.638-.368.882a1.204 1.204 0 0 1-.883.368H4.067c-.344 0-.638-.123-.883-.368a1.204 1.204 0 0 1-.367-.882Z"
      />
    </g>
  </svg>
);
export default Profile;
