import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-brand-2",
  secondary: "bg-card text-foreground border border-border hover:bg-muted",
  soft: "bg-primary-soft text-primary hover:bg-primary-soft/70",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  success: "bg-success text-success-foreground hover:opacity-90",
};

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  as,
  loading = false,
  children,
  ...props
}) {
  const Comp = as === "link" ? Link : as === "a" ? "a" : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={Comp === "button" ? props.disabled || loading : undefined}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Comp>
  );
}
