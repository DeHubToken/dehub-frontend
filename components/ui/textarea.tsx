import * as React from "react";

import { cn } from "@/libs/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-36 w-full resize-none rounded-md border border-gray-200 border-theme-mine-shaft bg-theme-mine-shaft-dark px-3 py-2 text-base shadow-sm placeholder:text-theme-titan-white/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
