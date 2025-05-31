"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/libs/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex w-fit items-center rounded-full p-1 text-muted-foreground dark:border dark:border-theme-neutrals-800",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

<div className="bg-color-neutrals-700 inline-flex items-center justify-center gap-2.5 self-stretch rounded-[999px] px-4 py-3 shadow-[0px_0px_20px_0px_rgba(56,58,61,1.00)]">
  <div className="text-color-neutrals-400 justify-start text-center font-['Exo_2'] text-xs font-semibold leading-[10.40px]">
    Videos
  </div>
</div>;
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center gap-2.5 self-stretch whitespace-nowrap rounded-full px-4 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-theme-neutrals-800 data-[state=active]:text-theme-neutrals-400 data-[state=active]:ring-offset-background data-[state=active]:dark:bg-theme-neutrals-700 data-[state=active]:dark:shadow-[0px_0px_20px_0px_rgba(56,58,61,1.00)]",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
