import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({ page = 1, totalPages = 1, onChange, total, pageSize }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        {total != null
          ? `Showing ${Math.min((page - 1) * pageSize + 1, total)}–${Math.min(page * pageSize, total)} of ${total}`
          : `Page ${page} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange?.(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - pages[i - 1] > 1 && (
              <span className="px-1 text-muted-foreground">…</span>
            )}
            <button
              onClick={() => onChange?.(p)}
              className={cn(
                "h-9 min-w-9 rounded-lg border px-2 text-sm transition-colors",
                p === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted",
              )}
            >
              {p}
            </button>
          </span>
        ))}
        <button
          onClick={() => onChange?.(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
