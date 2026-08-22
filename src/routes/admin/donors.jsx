import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
import { BLOOD_GROUPS, formatDate } from "@/data/mock";
import {
  useGetAdminDonorsQuery,
  useVerifyDonorMutation
} from "@/features/admin/adminApiSlice";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get("query") || "";
  const groupParam = searchParams.get("group") || "";
  const pageParam = parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(queryParam);
  const [group, setGroup] = useState(groupParam);
  const [page, setPage] = useState(pageParam);

  // Sync state with URL params on back/forward browser navigation
  useEffect(() => {
    setQuery(queryParam);
    setGroup(groupParam);
    setPage(pageParam);
  }, [queryParam, groupParam, pageParam]);

  // Debounced search query to update URL params
  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = {};
      if (query) newParams.query = query;
      if (group) newParams.group = group;
      if (page > 1) newParams.page = page.toString();

      // Avoid infinite search loop by checking if values actually changed
      const currentQuery = searchParams.get("query") || "";
      const currentGroup = searchParams.get("group") || "";
      const currentPage = searchParams.get("page") || "1";

      const hasChanged = 
        (newParams.query || "") !== currentQuery ||
        (newParams.group || "") !== currentGroup ||
        (newParams.page || "1") !== currentPage;

      if (hasChanged) {
        setSearchParams(newParams, { replace: true });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query, group, page, setSearchParams, searchParams]);

  const { data: response, isLoading } = useGetAdminDonorsQuery({
    query: queryParam || undefined,
    group: groupParam || undefined,
    page: pageParam,
    limit: PAGE_SIZE,
  });

  const [verifyDonor, { isLoading: isVerifying }] = useVerifyDonorMutation();

  const totalDonorsCount = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;
  const currentDonors = response?.data?.donors || [];

  const handleGroupChange = (e) => {
    const newGroup = e.target.value;
    setGroup(newGroup);
    setPage(1);

    const newParams = {};
    if (query) newParams.query = query;
    if (newGroup) newParams.group = newGroup;
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);

    const newParams = {};
    if (query) newParams.query = query;
    if (group) newParams.group = group;
    if (newPage > 1) newParams.page = newPage.toString();
    setSearchParams(newParams);
  };

  const renderCell = useCallback((row, key) => {
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
    if (key === "donations") return row.totalDonations || 0;
    if (key === "lastDonation") return row.lastDonationDate ? formatDate(row.lastDonationDate) : "Never";
    if (key === "status") return <StatusBadge status={row.availability || "Unavailable"} />;
    if (key === "actions")
      return (
        <Button
          size="sm"
          variant="secondary"
          disabled={isVerifying}
          onClick={async () => {
            try {
              const res = await verifyDonor(row.id).unwrap();
              const isNowVerified = res.data?.verified;
              toast.success(`${row.name} marked ${isNowVerified ? "verified" : "unverified"}`);
            } catch (err) {
              toast.error("Failed to update verification status");
            }
          }}
        >
          {row.verified ? "Unverify" : "Verify"}
        </Button>
      );
    return row[key];
  }, [verifyDonor, isVerifying]);

  return (
    <AdminLayout>
      <PageHeader title="Donors" description={`${totalDonorsCount} donors in the registry`} />

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
          onChange={handleGroupChange}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12 surface">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            rows={currentDonors}
            renderCell={renderCell}
            empty={<EmptyState title="No donors found" description="Try a different filter." />}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalDonorsCount}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
          />
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDonors;
