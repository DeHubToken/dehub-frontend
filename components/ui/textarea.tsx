import * as React from "react";

import { cn } from "@/libs/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "rounded-m flex min-h-36 w-full resize-none border-0 bg-theme-neutrals-800 px-3 py-2 text-base shadow-sm placeholder:text-theme-neutrals-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
