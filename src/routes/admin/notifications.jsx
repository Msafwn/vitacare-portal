import { useState } from "react";
import { Megaphone } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Modal from "@/components/blood/Modal";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import StatusBadge from "@/components/blood/StatusBadge";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, CITIES, notifications } from "@/data/mock";

function AdminNotifications() {
  const [open, setOpen] = useState(false);

  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        description="System activity and donor broadcasts."
        actions={
          <Button onClick={() => setOpen(true)}>
            <Megaphone className="h-4 w-4" /> New broadcast
          </Button>
        }
      />

      <Card>
        <h2 className="text-base font-semibold text-foreground">Recent activity</h2>
        <div className="mt-4 divide-y divide-border">
          {notifications.map((n) => (
            <div key={n.id} className="flex flex-wrap items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </div>
              <StatusBadge
                status={n.type === "error" ? "critical" : n.type === "warning" ? "low" : "completed"}
              />
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Send broadcast"
        description="Reach donors filtered by blood group and city."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Broadcast queued", { description: "Donors will be notified shortly." });
              }}
            >
              Send
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Title" required>
            <Input placeholder="Urgent: O- needed in Karachi" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Blood group">
              <Select options={BLOOD_GROUPS} placeholder="All groups" />
            </Field>
            <Field label="City">
              <Select options={CITIES} placeholder="All cities" />
            </Field>
          </div>
          <Field label="Message" required>
            <Textarea placeholder="Write the notification body…" />
          </Field>
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default AdminNotifications;
