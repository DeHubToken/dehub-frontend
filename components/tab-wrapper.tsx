import { cn } from "@/libs/utils";

export function TabContentWrapper(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "size-full overflow-hidden rounded-3xl border border-theme-neutrals-800 p-3",
        props.className
      )}
    />
  );
}
