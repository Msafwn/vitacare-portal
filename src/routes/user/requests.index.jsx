import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FilePlus2 } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Table from "@/components/blood/Table";
import SearchBar from "@/components/blood/SearchBar";
import Select from "@/components/blood/Select";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Pagination from "@/components/blood/Pagination";
import { formatDate, requests } from "@/data/mock";

const columns = [
  { key: "id", label: "Request" },
  { key: "patient", label: "Patient" },
  { key: "bloodGroup", label: "Group" },
  { key: "units", label: "Units" },
  { key: "hospital", label: "Hospital" },
  { key: "neededOn", label: "Needed on" },
  { key: "status", label: "Status" },
  { key: "actions", label: "" },
];

const PAGE_SIZE = 5;

function MyRequests() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      requests.filter(
        (r) =>
          (!query ||
            r.patient.toLowerCase().includes(query.toLowerCase()) ||
            r.id.includes(query)) &&
          (!status || r.status === status),
      ),
    [query, status],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function renderCell(row, key) {
    if (key === "id") return <span className="font-medium uppercase">{row.id}</span>;
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "neededOn") return formatDate(row.neededOn);
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "actions")
      return (
        <Link
          to="/requests/$requestId"
          params={{ requestId: row.id }}
          className="text-sm font-medium text-primary hover:underline"
        >
          View
        </Link>
      );
    return row[key];
  }

  return (
    <UserLayout>
      <PageHeader
        title="My requests"
        description="All blood requests you have raised, with live status."
        actions={
          <Button as="link" to="/requests/new">
            New request
          </Button>
        }
      />

      <div className="surface mb-6 grid gap-3 p-4 sm:grid-cols-[2fr_1fr]">
        <SearchBar
          placeholder="Search by patient or request ID"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={["pending", "approved", "fulfilled", "cancelled"]}
          placeholder="All statuses"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Table
        columns={columns}
        rows={current}
        renderCell={renderCell}
        empty={
          <EmptyState
            icon={FilePlus2}
            title="No requests found"
            description="You have not raised any request matching these filters."
            action={
              <Button as="link" to="/requests/new" variant="soft">
                Create request
              </Button>
            }
          />
        }
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        total={rows.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </UserLayout>
  );
}

export default MyRequests;
