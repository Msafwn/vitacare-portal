import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Table from "@/components/blood/Table";
import SearchBar from "@/components/blood/SearchBar";
import Select from "@/components/blood/Select";
import Avatar from "@/components/blood/Avatar";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Pagination from "@/components/blood/Pagination";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, donors, formatDate } from "@/data/mock";

const columns = [
  { key: "name", label: "Donor" },
  { key: "bloodGroup", label: "Group" },
  { key: "city", label: "City" },
  { key: "donations", label: "Donations" },
  { key: "lastDonation", label: "Last donation" },
  { key: "status", label: "Availability" },
  { key: "actions", label: "" },
];

const PAGE_SIZE = 6;

function AdminDonors() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      donors.filter(
        (d) =>
          (!query || d.name.toLowerCase().includes(query.toLowerCase())) &&
          (!group || d.bloodGroup === group),
      ),
    [query, group],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function renderCell(row, key) {
    if (key === "name")
      return (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              {row.name}
              {row.verified && <ShieldCheck className="h-3.5 w-3.5 text-success" />}
            </p>
            <p className="text-xs text-muted-foreground">{row.phone}</p>
          </div>
        </div>
      );
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "lastDonation") return formatDate(row.lastDonation);
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "actions")
      return (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => toast.success(`${row.name} marked verified`)}
        >
          Verify
        </Button>
      );
    return row[key];
  }

  return (
    <AdminLayout>
      <PageHeader title="Donors" description={`${donors.length} donors in the registry`} />

      <div className="surface mb-6 grid gap-3 p-4 sm:grid-cols-[2fr_1fr]">
        <SearchBar
          placeholder="Search donors"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={BLOOD_GROUPS}
          placeholder="All blood groups"
          value={group}
          onChange={(e) => {
            setGroup(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Table
        columns={columns}
        rows={current}
        renderCell={renderCell}
        empty={<EmptyState title="No donors found" description="Try a different filter." />}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={rows.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </AdminLayout>
  );
}

export default AdminDonors;
