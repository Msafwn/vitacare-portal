import { useState } from "react";
import { Download } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card, { StatCard } from "@/components/blood/Card";
import Select from "@/components/blood/Select";
import Table from "@/components/blood/Table";
import { toast } from "@/components/blood/Toast";
import { useGetAdminReportsQuery } from "@/features/admin/adminApiSlice";

const columns = [
  { key: "city", label: "City" },
  { key: "donors", label: "Donors" },
  { key: "donations", label: "Donations" },
  { key: "requests", label: "Requests" },
  { key: "fulfilment", label: "Fulfilment rate" },
];

function AdminReports() {
  const [period, setPeriod] = useState("6_months");

  const { data: reportData, isLoading, isError } = useGetAdminReportsQuery(period);

  const handlePeriodChange = (e) => {
    const val = e?.target ? e.target.value : e;
    setPeriod(val);
  };

  const periodOptions = [
    { value: "6_months", label: "Last 6 months" },
    { value: "12_months", label: "Last 12 months" },
    { value: "ytd", label: "Year to date" },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <PageHeader title="Reports" description="Loading report data..." />
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (isError || !reportData) {
    return (
      <AdminLayout>
        <PageHeader title="Reports" description="Error loading report data." />
        <div className="mt-8 text-center text-red-500">Failed to load reports.</div>
      </AdminLayout>
    );
  }

  const { stats, charts, table } = reportData.data;

  const handleExport = () => {
    // We use the browser's native print engine to generate high-quality PDFs.
    // It fully supports modern CSS (oklch) which html2canvas fails on.
    window.print();
  };

  return (
    <AdminLayout>
      <PageHeader
        title="Reports"
        description="Performance across the selected period."
        actions={
          <div className="flex items-center gap-2 print-hide">
            <select
              value={period}
              onChange={handlePeriodChange}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {periodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        }
      />

      <div id="report-content">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Fulfilment rate" value={stats.fulfilmentRate} delta="vs last period" />
          <StatCard label="Avg. match time" value={stats.avgMatchTime} tone="info" delta="Estimated" />
          <StatCard label="Units collected" value={stats.unitsCollected} tone="success" delta="In this period" />
          <StatCard label="Active Donors" value={stats.activeDonors} tone="warning" delta="Verified users" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-base font-semibold text-foreground">Donations trend</h2>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="donations"
                    stroke="var(--primary)"
                    fill="var(--primary-soft)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Stock by group</h2>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.inventory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="group" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="units" fill="var(--brand-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <h2 className="mb-4 text-base font-semibold text-foreground">City-wise Performance</h2>
            <Table columns={columns} rows={table.cityRows} />
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminReports;
