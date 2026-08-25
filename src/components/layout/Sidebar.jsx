import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "../blood/Logo";

export default function Sidebar({ items, open, onClose, footer }) {
  const { pathname } = useLocation();

  const nav = (
    <nav className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <Logo />
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {items.map((item) =>
        item.section ? (
          <p
            key={item.section}
            className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            {item.section}
          </p>
        ) : (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === item.to.split('?')[0] || (item.match && pathname.startsWith(item.match))
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4.5 w-4.5" />
            <span className="flex-1">{item.label}</span>
            {item.badge != null && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                {item.badge}
              </span>
            )}
          </Link>
        ),
      )}
      {footer && <div className="mt-auto pt-6">{footer}</div>}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar lg:block">
        {nav}
      </aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={onClose} aria-hidden />
          <aside className="absolute left-0 top-0 h-full w-64 overflow-y-auto bg-sidebar shadow-card">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
