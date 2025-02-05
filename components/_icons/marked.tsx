import type { SVGProps } from "react";

import * as React from "react";

const Marked = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M6.813 16.6 2.3 18.85a.89.89 0 0 1-.912-.03q-.45-.27-.45-.807V5.65q0-.774.55-1.325t1.325-.55h8q.775 0 1.324.55.55.55.55 1.325v12.363q0 .537-.45.806-.45.27-.912.032zm8.687-.975a.9.9 0 0 1-.662-.274.9.9 0 0 1-.275-.663V1.9H4.8a.9.9 0 0 1-.662-.275.9.9 0 0 1-.276-.662q0-.388.276-.663A.9.9 0 0 1 4.8.025h9.763q.775 0 1.324.55.55.55.55 1.325v12.788q0 .388-.274.662a.9.9 0 0 1-.663.276"
      fill="currentColor"
    />
  </svg>
);
export default Marked;
