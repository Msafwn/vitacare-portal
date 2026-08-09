import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Droplet, HeartHandshake } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import { StatCard } from "@/components/blood/Card";
import Table from "@/components/blood/Table";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Modal from "@/components/blood/Modal";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { CITIES, currentUser, donations, formatDate } from "@/data/mock";

export const Route = createFileRoute("/donations")({
  head: () => ({
    meta: [
      { title: "My Donation History — LifeDrop" },
      {
        name: "description",
        content: "See every blood donation you have made, where it was donated and its verification status.",
      },
      { property: "og:title", content: "My Donation History — LifeDrop" },
      { property: "og:description", content: "Your complete, verified blood donation record." },
    ],
  }),
  component: DonationHistory,
});

const columns = [
  { key: "id", label: "Reference" },
  { key: "center", label: "Center" },
  { key: "city", label: "City" },
  { key: "units", label: "Units" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

function DonationHistory() {
  const [open, setOpen] = useState(false);
  const rows = donations.filter((d) => d.donor === currentUser.name);

  function renderCell(row, key) {
    if (key === "id") return <span className="font-medium uppercase">{row.id}</span>;
    if (key === "date") return formatDate(row.date);
    if (key === "status") return <StatusBadge status={row.status} />;
    return row[key];
  }

  return (
    <UserLayout>
      <PageHeader
        title="Donation history"
        description="Every verified donation linked to your account."
        actions={<Button onClick={() => setOpen(true)}>Log donation</Button>}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total donations" value={currentUser.totalDonations} icon={Droplet} />
        <StatCard
          label="Lives impacted"
          value={currentUser.livesSaved}
          icon={HeartHandshake}
          tone="success"
        />
        <StatCard
          label="Last donation"
          value={formatDate(currentUser.lastDonation)}
          icon={Droplet}
          tone="info"
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        renderCell={renderCell}
        empty={<EmptyState title="No donations yet" description="Your donations will appear here." />}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Log a donation"
        description="Add a donation you made outside LifeDrop for verification."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Donation submitted for verification");
              }}
            >
              Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Donation center" required>
            <Input placeholder="e.g. Fatimid Foundation" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <Select options={CITIES} placeholder="Select" />
            </Field>
            <Field label="Date">
              <Input type="date" />
            </Field>
          </div>
        </div>
      </Modal>
    </UserLayout>
  );
}
