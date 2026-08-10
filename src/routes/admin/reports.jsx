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
import { CITIES, inventory, monthlyDonations } from "@/data/mock";

const cityRows = CITIES.map((city, i) => ({
  id: city,
  city,
  donors: [3120, 2840, 1690, 1210, 980, 640][i],
  donations: [980, 870, 540, 410, 320, 210][i],
  requests: [720, 610, 380, 290, 210, 150][i],
  fulfilment: ["94%", "91%", "89%", "87%", "84%", "80%"][i],
}));

const columns = [
  { key: "city", label: "City" },
  { key: "donors", label: "Donors" },
  { key: "donations", label: "Donations" },
  { key: "requests", label: "Requests" },
  { key: "fulfilment", label: "Fulfilment rate" },
];

function AdminReports() {
  return (
    <AdminLayout>
      <PageHeader
        title="Reports"
        description="Performance across the last six months."
        actions={
          <>
            <Select options={["Last 6 months", "Last 12 months", "Year to date"]} />
            <Button variant="secondary" onClick={() => toast.success("Report exported")}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Fulfilment rate" value="91%" delta="+3% vs last period" />
        <StatCard label="Avg. match time" value="18 min" tone="info" delta="-4 min" />
        <StatCard label="Units collected" value="998" tone="success" delta="Last 6 months" />
        <StatCard label="Expired units" value="27" tone="warning" delta="2.7% of stock" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold text-foreground">Donations trend</h2>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyDonations}>
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
              <BarChart data={inventory}>
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
        <Table columns={columns} rows={cityRows} />
      </div>
    </AdminLayout>
  );
}

export default AdminReports;
