import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import Modal from "@/components/blood/Modal";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, formatDate, inventory } from "@/data/mock";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Blood Inventory — LifeDrop Admin" },
      {
        name: "description",
        content: "Live stock levels per blood group with low and critical threshold alerts.",
      },
      { property: "og:title", content: "Blood Inventory — LifeDrop Admin" },
      { property: "og:description", content: "Live stock levels and threshold alerts." },
    ],
  }),
  component: AdminInventory,
});

function AdminInventory() {
  const [open, setOpen] = useState(false);
  const low = inventory.filter((i) => i.status !== "available");

  return (
    <AdminLayout>
      <PageHeader
        title="Blood inventory"
        description="Stock levels across partner blood banks."
        actions={<Button onClick={() => setOpen(true)}>Update stock</Button>}
      />

      {low.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-border bg-warning-soft p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {low.length} blood groups below the safety threshold
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {low.map((l) => l.group).join(", ")} need urgent replenishment.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {inventory.map((i) => (
          <Card key={i.group}>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-primary">{i.group}</span>
              <StatusBadge status={i.status} />
            </div>
            <p className="mt-4 text-3xl font-semibold text-foreground">{i.units}</p>
            <p className="text-xs text-muted-foreground">of {i.capacity} unit capacity</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={
                  i.status === "critical"
                    ? "h-full rounded-full bg-destructive"
                    : i.status === "low"
                      ? "h-full rounded-full bg-warning"
                      : "h-full rounded-full bg-success"
                }
                style={{ width: `${Math.min(100, (i.units / i.capacity) * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Updated {formatDate(i.updated)}</p>
          </Card>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Update stock"
        description="Record units received or issued for a blood group."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Inventory updated");
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Blood group">
            <Select options={BLOOD_GROUPS} placeholder="Select" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Movement">
              <Select options={["Received", "Issued", "Expired"]} />
            </Field>
            <Field label="Units">
              <Input type="number" min="1" defaultValue="1" />
            </Field>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
