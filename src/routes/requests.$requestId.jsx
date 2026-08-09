import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Building2, CalendarClock, Droplet, MapPin, User } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import Avatar from "@/components/blood/Avatar";
import Modal from "@/components/blood/Modal";
import EmptyState from "@/components/blood/EmptyState";
import { toast } from "@/components/blood/Toast";
import { donors, formatDate, requests } from "@/data/mock";

export const Route = createFileRoute("/requests/$requestId")({
  head: () => ({
    meta: [
      { title: "Blood Request Details — LifeDrop" },
      {
        name: "description",
        content:
          "Review a blood request's patient details, hospital, urgency, matched donors and current status.",
      },
      { property: "og:title", content: "Blood Request Details — LifeDrop" },
      { property: "og:description", content: "Request status, matched donors and hospital details." },
    ],
  }),
  component: RequestDetails,
});

function RequestDetails() {
  const { requestId } = useParams({ from: "/requests/$requestId" });
  const request = requests.find((r) => r.id === requestId);
  const [open, setOpen] = useState(false);

  if (!request) {
    return (
      <UserLayout>
        <div className="surface">
          <EmptyState title="Request not found" description="This request no longer exists." />
        </div>
      </UserLayout>
    );
  }

  const matches = donors.filter((d) => d.bloodGroup === request.bloodGroup).slice(0, 4);

  const facts = [
    { icon: User, label: "Patient", value: request.patient },
    { icon: Droplet, label: "Blood group", value: `${request.bloodGroup} · ${request.units} unit(s)` },
    { icon: Building2, label: "Hospital", value: request.hospital },
    { icon: MapPin, label: "City", value: request.city },
    { icon: CalendarClock, label: "Needed by", value: formatDate(request.neededOn) },
    { icon: CalendarClock, label: "Created", value: formatDate(request.createdAt) },
  ];

  return (
    <UserLayout>
      <PageHeader
        title={`Request ${request.id.toUpperCase()}`}
        description={`Raised by ${request.requester}`}
        actions={
          <>
            <StatusBadge status={request.urgency} />
            <StatusBadge status={request.status} />
            <Button variant="secondary" onClick={() => setOpen(true)}>
              Cancel request
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground">Request details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <f.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">Notes</p>
            <p className="mt-1 text-sm text-foreground">{request.notes}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-foreground">Matched donors</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {matches.length} donors with {request.bloodGroup}
          </p>
          <div className="mt-4 space-y-3">
            {matches.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <Avatar name={d.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.city}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-base font-semibold text-foreground">Activity timeline</h2>
        <ol className="mt-5 space-y-5 border-l border-border pl-5">
          {[
            ["Request created", formatDate(request.createdAt)],
            ["Donors notified", formatDate(request.createdAt)],
            ["Under review by blood bank", formatDate(request.neededOn)],
          ].map(([title, date]) => (
            <li key={title} className="relative">
              <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{date}</p>
            </li>
          ))}
        </ol>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cancel this request?"
        description="Donors who already accepted will be informed. This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep request
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false);
                toast.success("Request cancelled");
              }}
            >
              Cancel request
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Request {request.id.toUpperCase()} for {request.patient} will be marked as cancelled.
        </p>
      </Modal>
    </UserLayout>
  );
}
