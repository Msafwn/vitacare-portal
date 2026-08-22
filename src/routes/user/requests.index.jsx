import { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { formatDate } from "@/data/mock";
import { useGetMyRequestsQuery } from "@/features/requests/requestApiSlice";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    if (inputValue === query) return;

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        if (inputValue) prev.set("query", inputValue);
        else prev.delete("query");
        prev.set("page", "1"); // reset page on search change
        return prev;
      }, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams, query]);
  const { data: response, isLoading } = useGetMyRequestsQuery();

  const requests = response?.data?.sent || [];

  const rows = useMemo(
    () =>
      requests.filter(
        (r) =>
          (!query ||
            (r.patientName && r.patientName.toLowerCase().includes(query.toLowerCase())) ||
            (r.id && r.id.toLowerCase().includes(query.toLowerCase()))) &&
          (!status || r.status === status),
      ),
    [query, status, requests],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const renderCell = useCallback((row, key) => {
    if (key === "id") return <span className="font-medium uppercase">{row.id}</span>;
    if (key === "patient") return row.patientName;
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "neededOn") return formatDate(row.requiredBy);
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "units") return row.unitsRequired;
    if (key === "actions")
      return (
        <Link
          to={`/requests/${row.id}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View
        </Link>
      );
    return row[key];
  }, []);

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </UserLayout>
    );
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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Select
          options={["pending", "accepted", "declined", "fulfilled", "cancelled"]}
          placeholder="All statuses"
          value={status}
          onChange={(e) => {
            setSearchParams((prev) => {
              if (e.target.value) prev.set("status", e.target.value);
              else prev.delete("status");
              prev.set("page", "1");
              return prev;
            }, { replace: true });
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
        onChange={(newPage) => {
          setSearchParams((prev) => {
            prev.set("page", newPage.toString());
            return prev;
          }, { replace: true });
        }}
      />
    </UserLayout>
  );
}

export default MyRequests;
