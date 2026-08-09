import { cn } from "@/lib/utils";

const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-lg" };

export default function Avatar({ name = "", src, size = "md", className }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-soft font-semibold text-primary",
        sizes[size],
        className,
      )}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials || "?"}
    </span>
  );
}
