import { cn } from "@/libs/utils";

type Props = React.SVGAttributes<SVGSVGElement> & {
  trackProps?: React.SVGAttributes<SVGCircleElement>;
};

export function Spinner(props: Props) {
  const { className, trackProps, ...rest } = props;
  return (
    <svg
      className={cn("size-5 animate-spin text-gray-500", className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...rest}
    >
      <circle
        {...trackProps}
        className={trackProps?.className} // Opacity/25
        cx="12"
        cy="12"
        r="10"
        stroke={cn("#860C93", trackProps?.stroke)}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8 8 0 0012"
      />
    </svg>
  );
}
