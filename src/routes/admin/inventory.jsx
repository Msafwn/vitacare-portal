import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import Modal from "@/components/blood/Modal";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, formatDate } from "@/data/mock";
import { useGetAdminInventoryQuery, useUpdateAdminInventoryMutation } from "@/features/admin/adminApiSlice";

function AdminInventory() {
  const [open, setOpen] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("");
  const [movement, setMovement] = useState("Received");
  const [units, setUnits] = useState(1);

  const { data: inventoryData, isLoading, isError, refetch } = useGetAdminInventoryQuery();
  const [updateInventory, { isLoading: isUpdating }] = useUpdateAdminInventoryMutation();

  const inventory = inventoryData?.data || [];
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

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <AlertTriangle className="mb-2 h-8 w-8 text-destructive" />
          <p className="text-foreground">Failed to load inventory data</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
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
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Update stock"
        description="Record units received or issued for a blood group."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              disabled={isUpdating || !bloodGroup}
              onClick={async () => {
                try {
                  await updateInventory({ bloodGroup, movement, units }).unwrap();
                  toast.success("Inventory updated successfully");
                  setOpen(false);
                  setBloodGroup("");
                  setUnits(1);
                  setMovement("Received");
                } catch (err) {
                  toast.error(err?.data?.message || "Failed to update inventory");
                }
              }}
            >
              {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Blood group">
            <Select 
              options={BLOOD_GROUPS} 
              placeholder="Select" 
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Movement">
              <Select 
                options={["Received", "Issued", "Expired"]} 
                value={movement}
                onChange={(e) => setMovement(e.target.value)}
              />
            </Field>
            <Field label="Units">
              <Input 
                type="number" 
                min="1" 
                value={units}
                onChange={(e) => setUnits(e.target.value)}
              />
            </Field>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

export default AdminInventory;
