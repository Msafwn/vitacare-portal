import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
import { CITIES, formatDate } from "@/data/mock";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation
} from "@/features/admin/adminApiSlice";

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
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get("query") || "";
  const cityParam = searchParams.get("city") || "";
  const pageParam = parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(queryParam);
  const [city, setCity] = useState(cityParam);
  const [page, setPage] = useState(pageParam);

  // Sync state with URL params on back/forward browser navigation
  useEffect(() => {
    setQuery(queryParam);
    setCity(cityParam);
    setPage(pageParam);
  }, [queryParam, cityParam, pageParam]);

  // Debounced search query to update URL params
  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = {};
      if (query) newParams.query = query;
      if (city) newParams.city = city;
      if (page > 1) newParams.page = page.toString();

      // Avoid infinite search loop by checking if values actually changed
      const currentQuery = searchParams.get("query") || "";
      const currentCity = searchParams.get("city") || "";
      const currentPage = searchParams.get("page") || "1";

      const hasChanged = 
        (newParams.query || "") !== currentQuery ||
        (newParams.city || "") !== currentCity ||
        (newParams.page || "1") !== currentPage;

      if (hasChanged) {
        setSearchParams(newParams, { replace: true });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query, city, page, setSearchParams, searchParams]);

  const { data: response, isLoading } = useGetAdminUsersQuery({
    query: queryParam || undefined,
    city: cityParam || undefined,
    page: pageParam,
    limit: PAGE_SIZE,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setCity(newCity);
    setPage(1);

    const newParams = {};
    if (query) newParams.query = query;
    if (newCity) newParams.city = newCity;
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);

    const newParams = {};
    if (query) newParams.query = query;
    if (city) newParams.city = city;
    if (newPage > 1) newParams.page = newPage.toString();
    setSearchParams(newParams);
  };

  const totalUsersCount = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;
  const currentUsers = response?.data?.users || [];

  const renderCell = useCallback((row, key) => {
    if (key === "name")
      return (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="text-sm font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.phone}</p>
          </div>
        </div>
      );
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup || "N/A"}</span>;
    if (key === "joined") return formatDate(row.createdAt);
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "actions")
      return (
        <Dropdown trigger={<span className="px-2 text-muted-foreground cursor-pointer">•••</span>}>
          {row.status === "active" ? (
            <DropdownItem
              className="text-primary"
              onClick={async () => {
                try {
                  await updateUserStatus({ id: row.id, status: "suspended" }).unwrap();
                  toast.success(`${row.name} suspended`);
                } catch (e) {
                  toast.error("Failed to suspend user");
                }
              }}
            >
              Suspend
            </DropdownItem>
          ) : (
            <DropdownItem
              className="text-success"
              onClick={async () => {
                try {
                  await updateUserStatus({ id: row.id, status: "active" }).unwrap();
                  toast.success(`${row.name} activated`);
                } catch (e) {
                  toast.error("Failed to activate user");
                }
              }}
            >
              Activate
            </DropdownItem>
          )}
          <DropdownItem
            className="text-destructive hover:bg-destructive/10"
            onClick={async () => {
              if (window.confirm(`Are you sure you want to permanently delete ${row.name}?`)) {
                try {
                  await deleteUser(row.id).unwrap();
                  toast.success(`${row.name} deleted`);
                } catch (e) {
                  toast.error("Failed to delete user");
                }
              }
            }}
          >
            Delete Account
          </DropdownItem>
        </Dropdown>
      );
    return row[key];
  }, [updateUserStatus, deleteUser]);

  return (
    <AdminLayout>
      <PageHeader
        title="Users"
        description={`${totalUsersCount} registered accounts`}
        actions={
          <Button
            onClick={() => {
              const registerUrl = `${window.location.origin}/register`;
              navigator.clipboard.writeText(registerUrl);
              toast.success("Registration link copied to clipboard!");
            }}
          >
            Invite user
          </Button>
        }
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
          onChange={handleCityChange}
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
            rows={currentUsers}
            renderCell={renderCell}
            empty={<EmptyState icon={UserPlus} title="No users found" description="Adjust your filters." />}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalUsersCount}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
          />
        </>
      )}
    </AdminLayout>
  );
}

export default AdminUsers;
