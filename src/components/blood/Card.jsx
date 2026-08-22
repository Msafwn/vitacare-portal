import { cn } from "@/lib/utils";

export default function Card({ className, children, ...props }) {
  return (
    <div className={cn("surface p-5 min-w-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, delta, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    info: "bg-info-soft text-info",
  };
  return (
    <div className="surface p-5 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && (
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tones[tone])}>
            <Icon className="h-4.5 w-4.5" />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {delta && <p className="mt-1 text-xs text-muted-foreground">{delta}</p>}
    </div>
  );
}
