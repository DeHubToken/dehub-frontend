import * as React from "react";

import { cn } from "@/libs/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "shadow-sm  flex min-h-36 w-full resize-none rounded-md border border-gray-200 bg-theme-mine-shaft-dark px-3 py-2 text-base focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark placeholder:dark:text-theme-titan-white/40",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
