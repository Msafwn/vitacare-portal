import { createFileRoute, Link } from "@tanstack/react-router";
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
import { formatDate, inventory, monthlyDonations, requests } from "@/data/mock";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — LifeDrop" },
      {
        name: "description",
        content: "Monitor donors, blood requests, donations and inventory levels across the network.",
      },
      { property: "og:title", content: "Admin Dashboard — LifeDrop" },
      { property: "og:description", content: "Network-wide donation and inventory analytics." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
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
        <StatCard label="Total donors" value="12,480" icon={Users} delta="+312 this month" />
        <StatCard
          label="Units in stock"
          value={inventory.reduce((a, b) => a + b.units, 0)}
          icon={Boxes}
          tone="info"
        />
        <StatCard label="Open requests" value="46" icon={FileText} tone="warning" delta="4 critical" />
        <StatCard label="Donations (Jul)" value="205" icon={Droplet} tone="success" delta="+6.8%" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground">Donations vs requests</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyDonations}>
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
          {requests.slice(0, 5).map((r) => (
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
          ))}
        </div>
      </Card>
    </AdminLayout>
  );
}
