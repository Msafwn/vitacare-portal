import { useState } from "react";
import { AlertTriangle, BellOff, CheckCircle2, Info } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import EmptyState from "@/components/blood/EmptyState";
import { toast } from "@/components/blood/Toast";
import { notifications as seed } from "@/data/mock";
import { cn } from "@/lib/utils";

const icons = {
  success: { icon: CheckCircle2, cls: "bg-success-soft text-success" },
  error: { icon: AlertTriangle, cls: "bg-primary-soft text-primary" },
  warning: { icon: AlertTriangle, cls: "bg-warning-soft text-warning" },
  info: { icon: Info, cls: "bg-info-soft text-info" },
};

function Notifications() {
  const [items, setItems] = useState(seed);

  return (
    <UserLayout>
      <PageHeader
        title="Notifications"
        description={`${items.filter((i) => i.unread).length} unread updates`}
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setItems(items.map((i) => ({ ...i, unread: false })));
                toast.success("All notifications marked as read");
              }}
            >
              Mark all read
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setItems([]);
                toast.info("Notifications cleared");
              }}
            >
              Clear
            </Button>
          </>
        }
      />

      {items.length === 0 ? (
        <div className="surface">
          <EmptyState
            icon={BellOff}
            title="You are all caught up"
            description="New donor matches and request updates will appear here."
          />
        </div>
      ) : (
        <div className="surface divide-y divide-border">
          {items.map((n) => {
            const meta = icons[n.type] || icons.info;
            return (
              <div
                key={n.id}
                className={cn("flex gap-4 p-5", n.unread && "bg-primary-soft/40")}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    meta.cls,
                  )}
                >
                  <meta.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{n.time}</p>
                </div>
                {n.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
      )}
    </UserLayout>
  );
}

export default Notifications;
