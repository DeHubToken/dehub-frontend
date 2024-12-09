import type { VariantProps } from "class-variance-authority";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/libs/utils";

const buttonVariants = cva(
  "inline-flex items-center relative justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-theme-mine-shaft dark:bg-theme-mine-shaft bg-theme-mine-shaft-dark dark:text-theme-titan-white",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-gray-200 bg-transparent shadow-sm hover:bg-gray-100 dark:border-theme-mine-shaft dark:hover:bg-theme-mine-shaft-dark",
        secondary:
          "bg-theme-monochrome-700 text-theme-monochrome-400 shadow-sm hover:bg-theme-monochrome-400 hover:text-theme-monochrome-200",
        ghost:
          "text-theme-mine-shaft dark:text-theme-titan-white hover:bg-theme-mine-shaft-dark dark:hover:bg-theme-mine-shaft hover:text-theme-titan-white",
        link: "text-theme-mine-shaft underline-offset-4 hover:underline",
        gradientOne:
          "bg-gradient-to-r from-blue-500 to-blue-300 shadow-default hover:from-theme-orange-200 hover:to-theme-orange-500 rounded-full"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-6 rounded-md px-2 text-sm",
        md: "h-8 px-3 py-2",
        lg: "h-12 px-8",
        sratch: "sm:h-10 sm:px-6 px-4 py-2 h-6 text-xs sm:text-sm",
        icon: "size-10 min-w-10 min-h-10",
        icon_sm: "size-8 min-w-8 min-h-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
