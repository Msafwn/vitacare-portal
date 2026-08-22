import { Link } from "react-router-dom";
import { Boxes, Droplet, FileText, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card, { StatCard } from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import { useGetAdminDashboardQuery } from "@/features/admin/adminApiSlice";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function AdminDashboard() {
  const { data: dashboardResponse, isLoading } = useGetAdminDashboardQuery();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  const { stats, charts, recentRequests } = dashboardResponse?.data || {};

  return (
    <AdminLayout>
      <PageHeader
        title="Admin dashboard"
        description="Network health across donors, requests and inventory."
        actions={
          <Button as="link" to="/admin/reports" variant="secondary">
            View reports
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total donors" value={stats?.donors.total || 0} icon={Users} delta={stats?.donors.delta} />
        <StatCard
          label="Units in stock"
          value={stats?.inventory.total || 0}
          icon={Boxes}
          tone="info"
        />
        <StatCard label="Open requests" value={stats?.requests.total || 0} icon={FileText} tone="warning" delta={stats?.requests.delta} />
        <StatCard label="Donations (Month)" value={stats?.donations.total || 0} icon={Droplet} tone="success" delta={stats?.donations.delta} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground">Donations vs requests</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.monthlyTrend || []}>
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
                <Line type="monotone" dataKey="donations" stroke="var(--primary)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="requests" stroke="var(--muted-foreground)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-foreground">Stock by blood group</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.inventoryBar || []}>
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
                <Bar dataKey="units" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Latest requests</h2>
          <Link to="/admin/requests" className="text-sm font-medium text-primary hover:underline">
            Manage all
          </Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {recentRequests?.length > 0 ? (
            recentRequests.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-xs font-semibold text-primary">
                  {r.bloodGroup}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {r.patient} · {r.units} unit(s)
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.hospital}, {r.city} · needed {formatDate(r.neededOn)}
                  </p>
                </div>
                <StatusBadge status={r.urgency} />
                <StatusBadge status={r.status} />
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">No recent requests.</p>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
}

export default AdminDashboard;
