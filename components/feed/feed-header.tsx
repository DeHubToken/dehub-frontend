import { cn } from "@/libs/utils";

export function FeedHeader(props: React.ComponentProps<"div">) {
  const { children, ...rest } = props;
  return (
    <div {...rest} className={cn("flex items-center justify-between", rest.className)}>
      {children}
    </div>
  );
}
