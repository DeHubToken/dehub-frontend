import type { ReactNode } from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning" | "loading";

type Position =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const toastFunctions = {
  success: toast.success,
  error: toast.error,
  info: toast.info,
  warning: toast.warning,
  loading: toast.loading
} as const;

export const showToast = (
  type: ToastType,
  message: ReactNode,
  position: Position = "top-right"
) => {
  toast.dismiss(); // Dismiss all current toasts
  const t = toastFunctions[type];
  t(message, { position });
};
