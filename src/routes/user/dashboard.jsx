import { Link } from "react-router-dom";
import { useGetCurrentUserQuery } from "@/features/users/userApiSlice";
import { useGetMyRequestsQuery } from "@/features/requests/requestApiSlice";
import { Droplet, FileText, HeartHandshake, Users } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card, { StatCard } from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import Avatar from "@/components/blood/Avatar";
import EmptyState from "@/components/blood/EmptyState";
import { useGetMyDonationsQuery } from "@/features/donations/donationApiSlice";
import { useGetDonorsQuery } from "@/features/users/userApiSlice";
import { formatDate } from "@/data/mock";

function Dashboard() {
  const { data: response } = useGetCurrentUserQuery();
  const currentUser = response?.data || {}; // Ensure it's never undefined
  const { isDonor, lastDonationDate, name, city } = currentUser;
  
  const { data: reqResponse } = useGetMyRequestsQuery();
  const allRequests = reqResponse?.data?.sent || [];
  const myRequests = allRequests.slice(0, 3);
  const activeRequestsCount = allRequests.filter(r => r.status === 'pending' || r.status === 'accepted').length;

  const { data: donResponse } = useGetMyDonationsQuery();
  const myDonations = donResponse?.data || [];
  const completedDonations = myDonations.filter(d => d.status === 'completed');
  const livesImpacted = completedDonations.reduce((acc, d) => acc + (parseInt(d.units) || 1) * 3, 0);

  const { data: donorsResponse } = useGetDonorsQuery({ city: city || '' }, { skip: !city });
  const nearbyDonors = (donorsResponse?.data || []).filter(d => d.status === 'available');

  return (
    <UserLayout>
      <PageHeader
        title={`Welcome back, ${name ? name.split(" ")[0] : 'User'}`}
        description={
          <span>
            {currentUser.email && <span className="text-primary font-semibold mr-2">{currentUser.email}</span>}
            · Here is what is happening with your donations and requests.
          </span>
        }
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
        <StatCard label="Total donations" value={completedDonations.length} icon={Droplet} />
        <StatCard
          label="Lives impacted"
          value={livesImpacted}
          icon={HeartHandshake}
          tone="success"
        />
        <StatCard label="Active requests" value={activeRequestsCount} icon={FileText} tone="warning" />
        <StatCard label="Donors nearby" value={nearbyDonors.length} icon={Users} tone="info" />
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
                  to={`/requests/${r.id}`}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                    {r.bloodGroup}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{r.patientName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.hospital} · {r.unitsRequired} unit(s) · {formatDate(r.requiredBy || r.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </Link>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-6 min-w-0">
          {isDonor ? (
            <Card>
              <h2 className="text-base font-semibold text-foreground">Donation eligibility</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Last donation {lastDonationDate ? formatDate(lastDonationDate) : 'Unknown'}
              </p>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-full rounded-full bg-success" />
              </div>
              <p className="mt-3 text-sm font-medium text-success">You are eligible to donate</p>
            </Card>
          ) : (
            <Card className="bg-primary-soft border-primary/20">
              <h2 className="text-base font-semibold text-primary">Become a Donor</h2>
              <p className="mt-1 text-sm text-foreground/80 break-words whitespace-normal">
                Help someone in need by becoming a blood donor today. Your one donation can save up to 3 lives.
              </p>
              <Button className="mt-4 w-full" as="link" to="/become-donor">
                Become a Donor
              </Button>
            </Card>
          )}

          <Card>
            <h2 className="text-base font-semibold text-foreground">Donors near you</h2>
            <div className="mt-4 space-y-3">
              {nearbyDonors.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No available donors found in {city}.</p>
              ) : (
                nearbyDonors.slice(0, 3).map((d) => (
                  <Link
                    key={d.id}
                    to={`/donors/${d.id}`}
                    className="flex items-center gap-3"
                  >
                  <Avatar name={d.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.area}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{d.bloodGroup}</span>
                </Link>
              ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}

export default Dashboard;
