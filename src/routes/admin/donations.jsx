import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Table from "@/components/blood/Table";
import Pagination from "@/components/blood/Pagination";
import SearchBar from "@/components/blood/SearchBar";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import { toast } from "@/components/blood/Toast";
import { formatDate } from "@/data/mock";
import { useGetAdminDonationsQuery } from "@/features/admin/adminApiSlice";

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

const PAGE_SIZE = 6;

function AdminDonations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const pageParam = parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(queryParam);
  const [page, setPage] = useState(pageParam);

  // Sync state with URL params on back/forward browser navigation
  useEffect(() => {
    setQuery(queryParam);
    setPage(pageParam);
  }, [queryParam, pageParam]);

  // Debounced search query to update URL params
  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = {};
      if (query) newParams.query = query;
      if (page > 1) newParams.page = page.toString();

      // Avoid infinite search loop by checking if values actually changed
      const currentQuery = searchParams.get("query") || "";
      const currentPage = searchParams.get("page") || "1";

      const hasChanged = 
        (newParams.query || "") !== currentQuery ||
        (newParams.page || "1") !== currentPage;

      if (hasChanged) {
        setSearchParams(newParams, { replace: true });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query, page, setSearchParams, searchParams]);

  const { data: response, isLoading } = useGetAdminDonationsQuery({
    query: queryParam || undefined,
    page: pageParam,
    limit: PAGE_SIZE,
  });

  const totalDonationsCount = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;
  const currentDonations = response?.data?.donations || [];

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    const newParams = {};
    if (query) newParams.query = query;
    if (newPage > 1) newParams.page = newPage.toString();
    setSearchParams(newParams);
  }, [query, setSearchParams]);

  const handleExport = useCallback(() => {
    if (!currentDonations || currentDonations.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF();

    // Add Title and Header Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(190, 24, 24); // VitaCare red
    doc.text("VitaCare Blood Donation Portal", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
    doc.text("Donation Log Records Report", 14, 31);

    // Prepare table headers and data
    const tableHeaders = [["Reference ID", "Donor", "Group", "Units", "Center", "City", "Date", "Status"]];
    const tableData = currentDonations.map((d) => [
      d.id.split("-")[0].toUpperCase(),
      d.donor?.name || "Unknown",
      d.bloodGroup,
      d.units,
      d.hospitalName,
      d.city,
      new Date(d.donationDate).toLocaleDateString(),
      d.status.toUpperCase()
    ]);

    // Generate table with styling
    autoTable(doc, {
      startY: 38,
      head: tableHeaders,
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [190, 24, 24], halign: "center" }, // Red header
      columnStyles: {
        0: { cellWidth: 20 }, // Reference ID
        1: { cellWidth: 35 }, // Donor name
        2: { cellWidth: 15, halign: "center" }, // Group
        3: { cellWidth: 15, halign: "center" }, // Units
        4: { cellWidth: 40 }, // Center
        5: { cellWidth: 25 }, // City
        6: { cellWidth: 25, halign: "center" }, // Date
        7: { cellWidth: 20, halign: "center" }  // Status
      },
      styles: { fontSize: 8, valign: "middle" },
      didDrawPage: (data) => {
        // Footer: Page Number
        const str = "Page " + doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`donation_records_${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF report downloaded successfully!");
  }, [currentDonations]);

  const renderCell = useCallback((row, key) => {
    if (key === "id") return <span className="font-medium uppercase">{row.id.split("-")[0]}</span>;
    if (key === "donor") return row.donor?.name || "Unknown";
    if (key === "bloodGroup")
      return <span className="font-semibold text-primary">{row.bloodGroup}</span>;
    if (key === "center") return row.hospitalName;
    if (key === "date") return formatDate(row.donationDate);
    if (key === "status") return <StatusBadge status={row.status} />;
    return row[key];
  }, []);

  return (
    <AdminLayout>
      <PageHeader
        title="Donations"
        description={`${totalDonationsCount} donation records`}
        actions={
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="surface mb-6 p-4">
        <SearchBar
          placeholder="Search by donor name"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
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
            rows={currentDonations}
            renderCell={renderCell}
            empty={<EmptyState title="No donations" description="No records match this search." />}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={totalDonationsCount}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
          />
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDonations;
