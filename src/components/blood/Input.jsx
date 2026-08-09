import { cn } from "@/lib/utils";

export function Field({ label, hint, error, required, children, className }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-primary">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputBase =
  "w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-soft transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-60";

export default function Input({ className, icon: Icon, ...props }) {
  if (Icon) {
    return (
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input className={cn(inputBase, "pl-10", className)} {...props} />
      </div>
    );
  }
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(inputBase, "min-h-28 resize-y", className)} {...props} />;
}
