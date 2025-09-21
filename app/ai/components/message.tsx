import React from "react";

import { cn } from "@/libs/utils";

export function UserMessage(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "admin ml-auto w-full max-w-[90%] rounded-t-[20px] rounded-bl-[20px] rounded-br-[2px] bg-neutral-700 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BotMessage(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, children, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "bot w-full max-w-[90%] rounded-t-[20px] rounded-bl-[2px] rounded-br-[20px] bg-neutral-800 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function UserChatImage(
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  }
) {
  const { wrapperProps, ...rest } = props;
  return (
    <div
      {...wrapperProps}
      className={cn(
        "size-[180px] rounded-t-2xl rounded-bl-full rounded-br-[2px]",
        wrapperProps?.className
      )}
    >
      <img {...rest} className={cn("h-full w-full rounded-2xl object-cover", rest.className)} />
    </div>
  );
}

export function BotChatImage(
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  }
) {
  const { wrapperProps, ...rest } = props;
  return (
    <div
      {...wrapperProps}
      className={cn(
        "size-[180px] rounded-t-2xl rounded-bl-[2px] rounded-br-2xl bg-neutral-800 p-2",
        wrapperProps?.className
      )}
    >
      <img {...rest} className={cn("h-full w-full rounded-2xl object-cover", rest.className)} />
    </div>
  );
}
