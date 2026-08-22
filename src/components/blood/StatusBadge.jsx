import { cn } from "@/lib/utils";

const tones = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  error: "bg-primary-soft text-primary",
  info: "bg-info-soft text-info",
  neutral: "bg-muted text-muted-foreground",
};

const map = {
  active: "success",
  approved: "success",
  completed: "success",
  fulfilled: "success",
  available: "success",
  verified: "success",
  pending: "warning",
  processing: "warning",
  low: "warning",
  scheduled: "info",
  critical: "error",
  urgent: "error",
   rejected: "error",
  suspended: "error",
  cancelled: "neutral",
  expired: "neutral",
  inactive: "neutral",
  unavailable: "neutral",
};

export default function StatusBadge({ status = "pending", tone, className, children }) {
  const key = String(status).toLowerCase();
  const t = tone || map[key] || "neutral";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
        tones[t],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children || status}
    </span>
  );
}
