import { XCircleIcon } from "lucide-react";

import { cn } from "@/libs/utils";

import { env } from "@/configs";

type ErrorProps = {
  title?: string;
  error: string;
};

/**
 * Error component to display error messages from the APIs.
 * **Note**: This component is only used in the server-side rendering.
 */
export function Error({ error, title }: ErrorProps) {
  return (
    <div className="max-w-[600px] rounded-lg bg-theme-mine-shaft-dark p-4 dark:bg-theme-mine-shaft-dark">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon className="size-10 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="font-medium text-red-600">{title || "Error loading resources"}</h3>
          <div className="mt-2 text-sm text-slate-400">
            <p>
              This resource doesn&apos;t exist or you don&apos;t have the neccessary rights to
              access it.
            </p>

            {env.NODE_ENV === "development" && (
              <div className="my-4 rounded border border-gray-200 bg-theme-mine-shaft-dark p-3 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark">
                <pre className="text-xs text-red-600">{error}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorBanner(
  props: ErrorProps & {
    containerProps?: React.HTMLProps<HTMLDivElement>;
    contentProps?: React.HTMLProps<HTMLDivElement>;
  }
) {
  const { error, title, containerProps, contentProps } = props;

  return (
    <div
      {...containerProps}
      className={cn(
        "flex rounded-lg border border-gray-200 p-2 dark:border-theme-mine-shaft dark:bg-theme-mine-shaft-dark",
        containerProps?.className
      )}
    >
      <div className="shrink-0">
        <XCircleIcon className="size-6 text-red-400" aria-hidden="true" />
      </div>
      <div {...contentProps} className={cn("ml-3", contentProps?.className)}>
        {title && <h1 className="font-medium text-red-600">{title}</h1>}
        <p className="mt-2 text-sm text-slate-400">{error}</p>
      </div>
    </div>
  );
}
