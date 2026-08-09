import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
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
import Dropdown, { DropdownItem } from "@/components/blood/Dropdown";
import { toast } from "@/components/blood/Toast";
import { CITIES, formatDate, users } from "@/data/mock";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Manage Users — LifeDrop Admin" },
      {
        name: "description",
        content: "Review, filter and manage every registered donor and recipient account.",
      },
      { property: "og:title", content: "Manage Users — LifeDrop Admin" },
      { property: "og:description", content: "Search and moderate registered accounts." },
    ],
  }),
  component: AdminUsers,
});

const columns = [
  { key: "name", label: "User" },
  { key: "role", label: "Role" },
  { key: "bloodGroup", label: "Group" },
  { key: "city", label: "City" },
  { key: "joined", label: "Joined" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const PAGE_SIZE = 6;

function AdminUsers() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      users.filter(
        (u) =>
          (!query ||
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.includes(query.toLowerCase())) &&
          (!city || u.city === city),
      ),
    [query, city],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function renderCell(row, key) {
    if (key === "name")
      return (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      );
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "joined") return formatDate(row.joined);
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "actions")
      return (
        <Dropdown trigger={<span className="px-2 text-muted-foreground">•••</span>}>
          <DropdownItem onClick={() => toast.success(`${row.name} verified`)}>Verify</DropdownItem>
          <DropdownItem onClick={() => toast.info(`Message sent to ${row.name}`)}>
            Send message
          </DropdownItem>
          <DropdownItem
            className="text-primary"
            onClick={() => toast.error(`${row.name} suspended`)}
          >
            Suspend
          </DropdownItem>
        </Dropdown>
      );
    return row[key];
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        description={`${users.length} registered accounts`}
        actions={<Button onClick={() => toast.info("Invite link copied")}>Invite user</Button>}
      />

      <div className="surface mb-6 grid gap-3 p-4 sm:grid-cols-[2fr_1fr]">
        <SearchBar
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={CITIES}
          placeholder="All cities"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Table
        columns={columns}
        rows={current}
        renderCell={renderCell}
        empty={<EmptyState icon={UserPlus} title="No users found" description="Adjust your filters." />}
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
