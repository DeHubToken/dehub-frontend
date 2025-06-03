import type { SVGProps } from "react";

import * as React from "react";

const Profile = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8 8.44q-1.613 0-2.744-1.131-1.13-1.132-1.13-2.744t1.13-2.744T8 .69q1.613 0 2.744 1.131t1.131 2.744-1.131 2.744Q9.613 8.439 8 8.439M.225 14.215v-.776q0-.825.419-1.505.418-.681 1.132-1.044 1.524-.75 3.08-1.131a13.2 13.2 0 0 1 6.288 0q1.556.38 3.08 1.13.714.364 1.132 1.045.42.681.42 1.505v.776q0 .774-.552 1.324-.55.55-1.324.55H2.1q-.774 0-1.324-.55a1.8 1.8 0 0 1-.55-1.324"
      fill="currentColor"
    />
  </svg>
);
export default Profile;
