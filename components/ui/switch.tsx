"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/libs/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "shadow-sm peer inline-flex h-8 w-16 shrink-0 cursor-pointer items-center rounded-full border-2 border-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-600 data-[state=unchecked]:bg-theme-mine-shaft-dark dark:border-theme-mine-shaft dark:data-[state=unchecked]:bg-theme-mine-shaft-dark",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "shadow-lg pointer-events-none block h-8 w-8 rounded-full border border-blue-600 bg-blue-500 ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
