import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Table from "@/components/blood/Table";
import Pagination from "@/components/blood/Pagination";
import SearchBar from "@/components/blood/SearchBar";
import Select from "@/components/blood/Select";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Modal from "@/components/blood/Modal";
import { toast } from "@/components/blood/Toast";
import { formatDate } from "@/data/mock";
import {
  useGetAdminRequestsQuery,
  useReviewRequestMutation,
  useFulfillRequestFromStockMutation,
} from "@/features/admin/adminApiSlice";

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

const PAGE_SIZE = 6;

function AdminRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const statusParam = searchParams.get("status") || "";
  const pageParam = parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(queryParam);
  const [status, setStatus] = useState(statusParam);
  const [page, setPage] = useState(pageParam);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setQuery(queryParam);
    setStatus(statusParam);
    setPage(pageParam);
  }, [queryParam, statusParam, pageParam]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = {};
      if (query) newParams.query = query;
      if (status) newParams.status = status;
      if (page > 1) newParams.page = page.toString();

      // Avoid infinite search loop by checking if values actually changed
      const currentQuery = searchParams.get("query") || "";
      const currentStatus = searchParams.get("status") || "";
      const currentPage = searchParams.get("page") || "1";

      const hasChanged = 
        (newParams.query || "") !== currentQuery ||
        (newParams.status || "") !== currentStatus ||
        (newParams.page || "1") !== currentPage;

      if (hasChanged) {
        setSearchParams(newParams, { replace: true });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query, status, page, setSearchParams, searchParams]);

  const { data: response, isLoading } = useGetAdminRequestsQuery({
    query: queryParam || undefined,
    status: statusParam || undefined,
    page: pageParam,
    limit: PAGE_SIZE,
  });

  const [reviewRequest, { isLoading: isReviewing }] = useReviewRequestMutation();
  const [fulfillFromStock, { isLoading: isFulfilling }] = useFulfillRequestFromStockMutation();

  const totalRequestsCount = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;
  const currentRequests = response?.data?.requests || [];
  const pendingCount = response?.data?.pendingCount || 0;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setPage(1);

    const newParams = {};
    if (query) newParams.query = query;
    if (newStatus) newParams.status = newStatus;
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);

    const newParams = {};
    if (query) newParams.query = query;
    if (status) newParams.status = status;
    if (newPage > 1) newParams.page = newPage.toString();
    setSearchParams(newParams);
  };

  const renderCell = useCallback((row, key) => {
    if (key === "id") return <span className="font-medium uppercase">{row.id.split("-")[0]}</span>;
    if (key === "patient") return row.patientName || row.patient;
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "units") return row.unitsRequired || row.units;
    if (key === "neededOn") return formatDate(row.requiredBy || row.neededOn);
    if (key === "urgency") return <StatusBadge status={row.urgency} />;
    if (key === "status") return <StatusBadge status={row.status} />;
    if (key === "actions")
      return (
        <Button size="sm" variant="secondary" onClick={() => setSelected(row)}>
          Review
        </Button>
      );
    return row[key];
  }, [setSelected]);

  return (
    <AdminLayout>
      <PageHeader
        title="Blood requests"
        description={`${pendingCount} awaiting approval`}
      />

      <div className="surface mb-6 grid gap-3 p-4 sm:grid-cols-[2fr_1fr]">
        <SearchBar
          placeholder="Search by patient"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <Select
          options={["pending", "approved", "fulfilled", "cancelled", "rejected"]}
          placeholder="All statuses"
          value={status}
          onChange={handleStatusChange}
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
            rows={currentRequests}
            renderCell={renderCell}
            empty={<EmptyState title="No requests" description="Nothing matches these filters." />}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalRequestsCount}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
          />
        </>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `Review ${selected.id.split("-")[0].toUpperCase()}` : ""}
        description="Approve to notify matching donors immediately."
        footer={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              disabled={isReviewing || isFulfilling}
              onClick={() => setSelected(null)}
            >
              Cancel
            </Button>
            
            {/* Show action buttons only if request is pending or approved */}
            {(selected?.status === "pending" || selected?.status === "approved") && (
              <>
                 <Button
                  variant="danger"
                  disabled={isReviewing || isFulfilling}
                  onClick={async () => {
                    try {
                      await reviewRequest({ id: selected.id, status: "rejected" }).unwrap();
                      setSelected(null);
                      toast.error("Request rejected");
                    } catch (err) {
                      toast.error(err?.data?.message || "Failed to reject request");
                    }
                  }}
                >
                  Reject
                </Button>

                <Button
                  variant="primary"
                  disabled={isReviewing || isFulfilling}
                  onClick={async () => {
                    try {
                      await fulfillFromStock(selected.id).unwrap();
                      setSelected(null);
                      toast.success("Request fulfilled from stock!", { description: "Inventory units deducted." });
                    } catch (err) {
                      toast.error(err?.data?.message || "Failed to fulfill from stock");
                    }
                  }}
                >
                  {isFulfilling ? "Fulfilling..." : "Fulfill from Inventory"}
                </Button>

                <Button
                  variant="success"
                  disabled={isReviewing || isFulfilling}
                  onClick={async () => {
                    try {
                      await reviewRequest({ id: selected.id, status: "approved" }).unwrap();
                      setSelected(null);
                      toast.success("Request approved", { description: "Matching donors notified." });
                    } catch (err) {
                      toast.error(err?.data?.message || "Failed to approve request");
                    }
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </div>
        }
      >
        {selected && (
          <div className="space-y-3 text-sm">
            <p className="text-foreground">
              <span className="text-muted-foreground">Raised by:</span> {selected.requester ? `${selected.requester.name} (${selected.requester.phone || selected.requester.email})` : 'System / Unknown'}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Request Type:</span>{" "}
              {selected.donor ? (
                <span className="font-medium text-foreground">
                  Targeted (to {selected.donor.name})
                </span>
              ) : (
                <span className="font-semibold text-primary">Broadcast</span>
              )}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Patient:</span> {selected.patientName || selected.patient}
            </p>
            <p className="text-foreground">
              <span className="text-muted-foreground">Requirement:</span> {selected.unitsRequired || selected.units} unit(s) of{" "}
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
