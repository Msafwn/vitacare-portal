import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Droplet, HeartHandshake, Calendar, Users, Search, Filter } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import { StatCard } from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Input from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { useGetMyDonationsQuery } from "@/features/donations/donationApiSlice";
import { formatDate } from "@/data/mock";

const ITEMS_PER_PAGE = 5;

export default function DonationHistory() {
  const { data: response, isLoading } = useGetMyDonationsQuery();
  
  const rawDonations = response?.data || [];
  
  // Map API fields to match the UI expectations
  const donations = rawDonations.map(d => ({
    id: d.id,
    donationDate: d.donationDate,
    hospitalName: d.hospitalName,
    city: d.city,
    bloodGroup: d.bloodGroup,
    units: d.units,
    status: d.status,
    bloodRequestId: d.bloodRequestId || "N/A"
  }));

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const statusFilter = searchParams.get("status") || "All";
  const bloodGroupFilter = searchParams.get("group") || "All";
  const dateFilter = searchParams.get("date") || "All Time";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    if (inputValue === query) return;

    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        if (inputValue) prev.set("query", inputValue);
        else prev.delete("query");
        prev.set("page", "1");
        return prev;
      }, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams, query]);

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const searchMatch = !query || 
        (d.hospitalName && d.hospitalName.toLowerCase().includes(query.toLowerCase())) || 
        (d.id && d.id.toLowerCase().includes(query.toLowerCase()));
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      const matchBloodGroup = bloodGroupFilter === "All" || d.bloodGroup === bloodGroupFilter;
      
      let matchDate = true;
      const donationDate = new Date(d.donationDate);
      const now = new Date();
      if (dateFilter === "This Month") {
        matchDate = donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
      } else if (dateFilter === "This Year") {
        matchDate = donationDate.getFullYear() === now.getFullYear();
      }
      
      return searchMatch && matchStatus && matchBloodGroup && matchDate;
    });
  }, [donations, query, statusFilter, bloodGroupFilter, dateFilter]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const currentDonations = filteredDonations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Calculate dynamic stats from donations where status is 'completed'
  const completedDonations = donations.filter(d => d.status === "completed");
  const totalDonations = completedDonations.length;
  
  const currentYear = new Date().getFullYear();
  const thisYearDonations = completedDonations.filter(d => new Date(d.donationDate).getFullYear() === currentYear).length;
  
  // Sort completed donations by date descending to get the last donation
  const sortedCompleted = [...completedDonations].sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
  const lastDonationDate = sortedCompleted.length > 0 ? formatDate(sortedCompleted[0].donationDate) : "Never";
  
  // Assuming 1 unit of blood saves up to 3 lives
  const livesSupported = completedDonations.reduce((acc, d) => acc + (parseInt(d.units) || 1) * 3, 0);

  const handleReset = () => {
    setInputValue("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <UserLayout>
      <PageHeader
        title="Donation History"
        description="Track your previous blood donations and your contribution to the community."
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Donations" value={totalDonations} icon={Droplet} />
        <StatCard label="This Year" value={thisYearDonations} icon={Calendar} tone="info" />
        <StatCard label="Last Donation" value={lastDonationDate} icon={Droplet} tone="neutral" />
        <StatCard label="Lives Supported" value={livesSupported} icon={HeartHandshake} tone="success" />
      </div>

      <div className="mb-6 space-y-4 bg-card border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2 border-b pb-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Filters</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5 items-end">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search donation..." 
                className="pl-9" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
            <Select 
              options={["All", "completed", "scheduled", "cancelled"]}
              value={statusFilter}
              onChange={(e) => {
                setSearchParams((prev) => {
                  if (e.target.value && e.target.value !== "All") prev.set("status", e.target.value);
                  else prev.delete("status");
                  prev.set("page", "1");
                  return prev;
                }, { replace: true });
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Blood Group</label>
            <Select 
              options={["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              value={bloodGroupFilter}
              onChange={(e) => {
                setSearchParams((prev) => {
                  if (e.target.value && e.target.value !== "All") prev.set("group", e.target.value);
                  else prev.delete("group");
                  prev.set("page", "1");
                  return prev;
                }, { replace: true });
              }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
            <Select 
              options={["All Time", "This Month", "This Year"]}
              value={dateFilter}
              onChange={(e) => {
                setSearchParams((prev) => {
                  if (e.target.value && e.target.value !== "All Time") prev.set("date", e.target.value);
                  else prev.delete("date");
                  prev.set("page", "1");
                  return prev;
                }, { replace: true });
              }}
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={handleReset} size="sm">Reset Filters</Button>
        </div>
      </div>

      {currentDonations.length === 0 ? (
        <EmptyState title="No donations found" description="Adjust your filters to see more results." />
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Donation ID</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Hospital</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Group</th>
                  <th className="px-4 py-3 font-medium">Units</th>
                  <th className="px-4 py-3 font-medium">Request ID</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary" title={d.id}>{d.id.substring(0, 8)}...</td>
                    <td className="px-4 py-3">{formatDate(d.donationDate)}</td>
                    <td className="px-4 py-3 truncate max-w-[150px]" title={d.hospitalName}>{d.hospitalName}</td>
                    <td className="px-4 py-3">{d.city}</td>
                    <td className="px-4 py-3"><span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{d.bloodGroup}</span></td>
                    <td className="px-4 py-3">{d.units} Unit{d.units > 1 && 's'}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs" title={d.bloodRequestId}>
                      {d.bloodRequestId !== "N/A" ? `${d.bloodRequestId.substring(0, 8)}...` : "N/A"}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/donations/${d.id}`} className="text-primary hover:underline font-medium text-sm">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-border">
            {currentDonations.map((d) => (
              <div key={d.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-primary" title={d.id}>ID: {d.id.substring(0, 8)}...</div>
                    <div className="text-xs text-muted-foreground">{formatDate(d.donationDate)}</div>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
                <div>
                  <div className="font-medium">{d.hospitalName}</div>
                  <div className="text-sm text-muted-foreground flex gap-2 items-center mt-1">
                    <span className="text-primary font-bold bg-primary/10 px-1.5 rounded">{d.bloodGroup}</span>
                    <span>•</span>
                    <span>{d.units} Unit{d.units > 1 && 's'}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button as="link" to={`/donations/${d.id}`} variant="secondary" className="w-full text-xs h-8">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t p-4 flex items-center justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => {
                  setSearchParams((prev) => {
                    prev.set("page", String(currentPage - 1));
                    return prev;
                  }, { replace: true });
                }}
              >
                Previous
              </Button>
              <div className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => {
                  setSearchParams((prev) => {
                    prev.set("page", String(currentPage + 1));
                    return prev;
                  }, { replace: true });
                }}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
      </>
      )}
    </UserLayout>
  );
}
