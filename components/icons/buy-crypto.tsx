import type { SVGProps } from "react";
import * as React from "react";

const BuyCrypto = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    {/* Coin circle */}
    <circle
      cx="8"
      cy="8"
      r="7"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Vertical line of plus sign */}
    <line
      x1="8"
      y1="5"
      x2="8"
      y2="11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Horizontal line of plus sign */}
    <line
      x1="5"
      y1="8"
      x2="11"
      y2="8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default BuyCrypto;
