import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Table from "@/components/blood/Table";
import SearchBar from "@/components/blood/SearchBar";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import { toast } from "@/components/blood/Toast";
import { donations, formatDate } from "@/data/mock";

export const Route = createFileRoute("/admin/donations")({
  head: () => ({
    meta: [
      { title: "Donations Log — LifeDrop Admin" },
      {
        name: "description",
        content: "Every recorded blood donation with center, units, donor and verification status.",
      },
      { property: "og:title", content: "Donations Log — LifeDrop Admin" },
      { property: "og:description", content: "Full donation log with verification status." },
    ],
  }),
  component: AdminDonations,
});

const columns = [
  { key: "id", label: "Reference" },
  { key: "donor", label: "Donor" },
  { key: "bloodGroup", label: "Group" },
  { key: "units", label: "Units" },
  { key: "center", label: "Center" },
  { key: "city", label: "City" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];

function AdminDonations() {
  const [query, setQuery] = useState("");
  const rows = donations.filter((d) => d.donor.toLowerCase().includes(query.toLowerCase()));

  function renderCell(row, key) {
    if (key === "id") return <span className="font-medium uppercase">{row.id}</span>;
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "date") return formatDate(row.date);
    if (key === "status") return <StatusBadge status={row.status} />;
    return row[key];
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Donations"
        description={`${donations.length} donation records`}
        actions={
          <Button variant="secondary" onClick={() => toast.success("CSV export started")}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="surface mb-6 p-4">
        <SearchBar
          placeholder="Search by donor name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        renderCell={renderCell}
        empty={<EmptyState title="No donations" description="No records match this search." />}
      />
    </AdminLayout>
  );
}
