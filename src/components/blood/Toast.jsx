import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "!rounded-xl !border !border-border !bg-card !text-foreground !shadow-card !font-sans",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground !rounded-lg",
        },
      }}
    />
  );
}

export const toast = {
  success: (msg, opts) => sonnerToast.success(msg, opts),
  error: (msg, opts) => sonnerToast.error(msg, opts),
  warning: (msg, opts) => sonnerToast.warning(msg, opts),
  info: (msg, opts) => sonnerToast(msg, opts),
};

export default toast;
