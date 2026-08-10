import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Droplet, HeartHandshake, Calendar, Users, Search, Filter } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import { StatCard } from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import EmptyState from "@/components/blood/EmptyState";
import Input from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { useSelector } from "react-redux";
import { formatDate } from "@/data/mock";

const ITEMS_PER_PAGE = 5;

export default function DonationHistory() {
  const { donations } = useSelector(state => state.donation);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDonations = useMemo(() => {
    return donations.filter(d => {
      const matchSearch = d.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase());
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
      
      return matchSearch && matchStatus && matchBloodGroup && matchDate;
    });
  }, [donations, searchTerm, statusFilter, bloodGroupFilter, dateFilter]);

  const totalPages = Math.ceil(filteredDonations.length / ITEMS_PER_PAGE);
  const currentDonations = filteredDonations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setBloodGroupFilter("All");
    setDateFilter("All Time");
    setCurrentPage(1);
  };

  return (
    <UserLayout>
      <PageHeader
        title="Donation History"
        description="Track your previous blood donations and your contribution to the community."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Donations" value="12" icon={Droplet} />
        <StatCard label="This Year" value="4" icon={Calendar} tone="info" />
        <StatCard label="Last Donation" value="20 May 2026" icon={Droplet} tone="neutral" />
        <StatCard label="Lives Supported" value="24" icon={HeartHandshake} tone="success" />
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
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
            <Select 
              options={["All", "Completed", "Scheduled", "Cancelled"]}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Blood Group</label>
            <Select 
              options={["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              value={bloodGroupFilter}
              onChange={(e) => { setBloodGroupFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
            <Select 
              options={["All Time", "This Month", "This Year"]}
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
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
                    <td className="px-4 py-3 font-medium text-primary">{d.id}</td>
                    <td className="px-4 py-3">{formatDate(d.donationDate)}</td>
                    <td className="px-4 py-3">{d.hospitalName}</td>
                    <td className="px-4 py-3">{d.city}</td>
                    <td className="px-4 py-3"><span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">{d.bloodGroup}</span></td>
                    <td className="px-4 py-3">{d.units} Unit{d.units > 1 && 's'}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{d.bloodRequestId}</td>
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
                    <div className="font-semibold text-primary">{d.id}</div>
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
                onClick={() => setCurrentPage(p => p - 1)}
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
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </UserLayout>
  );
}
