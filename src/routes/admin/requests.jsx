import { useMemo, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Table from "@/components/blood/Table";
import SearchBar from "@/components/blood/SearchBar";
import Select from "@/components/blood/Select";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Modal from "@/components/blood/Modal";
import { toast } from "@/components/blood/Toast";
import { formatDate, requests } from "@/data/mock";

const columns = [
  { key: "id", label: "Request" },
  { key: "patient", label: "Patient" },
  { key: "bloodGroup", label: "Group" },
  { key: "units", label: "Units" },
  { key: "hospital", label: "Hospital" },
  { key: "urgency", label: "Urgency" },
  { key: "neededOn", label: "Needed" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

function AdminRequests() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const rows = useMemo(
    () =>
      requests.filter(
        (r) =>
          (!query || r.patient.toLowerCase().includes(query.toLowerCase())) &&
          (!status || r.status === status),
      ),
    [query, status],
  );

  function renderCell(row, key) {
    if (key === "id") return <span className="font-medium uppercase">{row.id}</span>;
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "neededOn") return formatDate(row.neededOn);
    if (key === "urgency") return <StatusBadge status={row.urgency} />;
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "actions")
      return (
        <Button size="sm" variant="secondary" onClick={() => setSelected(row)}>
          Review
        </Button>
      );
    return row[key];
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Blood requests"
        description={`${requests.filter((r) => r.status === "pending").length} awaiting approval`}
      />

      <div className="surface mb-6 grid gap-3 p-4 sm:grid-cols-[2fr_1fr]">
        <SearchBar
          placeholder="Search by patient"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          options={["pending", "approved", "fulfilled", "cancelled"]}
          placeholder="All statuses"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        renderCell={renderCell}
        empty={<EmptyState title="No requests" description="Nothing matches these filters." />}
      />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Review ${selected.id.toUpperCase()}` : ""}
        description="Approve to notify matching donors immediately."
        footer={
          <>
            <Button
              variant="danger"
              onClick={() => {
                setSelected(null);
                toast.error("Request rejected");
              }}
            >
              Reject
            </Button>
            <Button
              variant="success"
              onClick={() => {
                setSelected(null);
                toast.success("Request approved", { description: "Matching donors notified." });
              }}
            >
              Approve
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <p className="text-foreground">
              <span className="text-muted-foreground">Patient:</span> {selected.patient}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Requirement:</span> {selected.units} unit(s) of{" "}
              {selected.bloodGroup}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Hospital:</span> {selected.hospital},{" "}
              {selected.city}
            </p>
            <p className="rounded-xl bg-muted p-3 text-muted-foreground">{selected.notes}</p>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

export default AdminRequests;
