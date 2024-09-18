import * as React from "react";

import { cn } from "@/libs/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "shadow-sm flex h-9 w-full rounded-md border border-gray-200 bg-theme-mine-shaft-dark px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
