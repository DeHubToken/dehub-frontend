import * as React from "react";

import { cn } from "@/libs/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border-none bg-theme-neutrals-800 text-base text-theme-neutrals-500 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-none focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-theme-neutrals-800 dark:text-theme-neutrals-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
