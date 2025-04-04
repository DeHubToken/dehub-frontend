import type { SVGProps } from "react";
import * as React from "react";

const SwapCrypto = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <defs>
      <marker
        id="arrowhead"
        markerWidth="5"
        markerHeight="5"
        refX="4"
        refY="2.5"
        orient="auto"
      >
        <polygon points="0 0, 5 2.5, 0 5" fill="currentColor" />
      </marker>
    </defs>
    {/* Top arrow: representing swap from ETH to DHB */}
    <path
      d="M2,6 C4,2 12,2 14,6"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd="url(#arrowhead)"
    />
    {/* Bottom arrow: representing swap from DHB back to ETH */}
    <path
      d="M14,10 C12,14 4,14 2,10"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      markerEnd="url(#arrowhead)"
    />
  </svg>
);

export default SwapCrypto;
