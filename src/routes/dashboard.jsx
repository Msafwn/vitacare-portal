import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplet, FileText, HeartHandshake, Users } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card, { StatCard } from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import Avatar from "@/components/blood/Avatar";
import EmptyState from "@/components/blood/EmptyState";
import { currentUser, donors, formatDate, requests } from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Donor Dashboard — LifeDrop" },
      {
        name: "description",
        content:
          "Your LifeDrop dashboard: donation stats, active blood requests and matching donors nearby.",
      },
      { property: "og:title", content: "Donor Dashboard — LifeDrop" },
      { property: "og:description", content: "Track donations, requests and donor matches." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const myRequests = requests.slice(0, 3);
  const nearby = donors.filter((d) => d.city === currentUser.city && d.status === "available");

  return (
    <UserLayout>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here is what is happening with your donations and requests."
        actions={
          <>
            <Button as="link" to="/requests/new">
              New request
            </Button>
            <Button as="link" to="/find-donors" variant="secondary">
              Find donors
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total donations" value={currentUser.totalDonations} icon={Droplet} />
        <StatCard
          label="Lives impacted"
          value={currentUser.livesSaved}
          icon={HeartHandshake}
          tone="success"
        />
        <StatCard label="Active requests" value={2} icon={FileText} tone="warning" />
        <StatCard label="Donors nearby" value={nearby.length} icon={Users} tone="info" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Recent requests</h2>
            <Link to="/requests" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {myRequests.length === 0 ? (
              <EmptyState title="No requests yet" description="Create your first blood request." />
            ) : (
              myRequests.map((r) => (
                <Link
                  key={r.id}
                  to="/requests/$requestId"
                  params={{ requestId: r.id }}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                    {r.bloodGroup}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{r.patient}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.hospital} · {r.units} unit(s) · {formatDate(r.neededOn)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-base font-semibold text-foreground">Donation eligibility</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Last donation {formatDate(currentUser.lastDonation)}
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-full rounded-full bg-success" />
            </div>
            <p className="mt-3 text-sm font-medium text-success">You are eligible to donate</p>
            <Button variant="soft" className="mt-4 w-full" as="link" to="/donations">
              Log a donation
            </Button>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Donors near you</h2>
            <div className="mt-4 space-y-3">
              {nearby.slice(0, 3).map((d) => (
                <Link
                  key={d.id}
                  to="/donors/$donorId"
                  params={{ donorId: d.id }}
                  className="flex items-center gap-3"
                >
                  <Avatar name={d.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.area}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{d.bloodGroup}</span>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
