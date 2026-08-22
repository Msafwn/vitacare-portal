import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, CheckCircle2, User, Activity, AlertCircle, HeartHandshake } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import StatusBadge from "@/components/blood/StatusBadge";
import Card from "@/components/blood/Card";
import { useGetMyDonationsQuery } from "@/features/donations/donationApiSlice";
import { formatDate } from "@/data/mock";

export default function DonationDetails() {
  const { id } = useParams();
  const { data: response, isLoading } = useGetMyDonationsQuery();
  
  const rawDonations = response?.data || [];
  const rawDonation = rawDonations.find(d => d.id === id);

  const donation = rawDonation ? {
    id: rawDonation.id,
    donationDate: rawDonation.donationDate,
    hospitalName: rawDonation.hospitalName,
    city: rawDonation.city,
    bloodGroup: rawDonation.bloodGroup,
    units: rawDonation.units,
    status: rawDonation.status,
    bloodRequestId: rawDonation.bloodRequestId || "N/A",
    patientName: rawDonation.bloodRequest?.patientName || "N/A",
    urgency: "Normal", // We don't store urgency in Donation model directly
    address: rawDonation.hospitalName,
    area: rawDonation.city,
    createdAt: rawDonation.createdAt
  } : null;

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </UserLayout>
    );
  }

  if (!donation) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">Donation not found.</p>
          <Link to="/donation-history" className="text-primary mt-2 hover:underline">Return to History</Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="mb-6">
        <Link to="/donation-history" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Donation Details</h1>
            <p className="text-sm text-muted-foreground">Reference: <span className="font-medium text-foreground">{donation.id}</span></p>
          </div>
          <StatusBadge status={donation.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold border-b pb-3 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Donation Summary
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Donation Date</p>
                <p className="font-medium mt-1">{formatDate(donation.donationDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-bold text-primary text-lg mt-0.5">{donation.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Units</p>
                <p className="font-medium mt-1">{donation.units} Unit{donation.units > 1 && 's'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold border-b pb-3 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Hospital Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Hospital Name</p>
                <p className="font-medium mt-1">{donation.hospitalName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p className="font-medium mt-1">{donation.city}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium mt-1">{donation.address}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{donation.area}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold border-b pb-3 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Blood Request Information
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Request ID</p>
                <p className="font-medium mt-1">{donation.bloodRequestId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient Name</p>
                <p className="font-medium mt-1">{donation.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgency</p>
                <p className="font-medium mt-1 flex items-center gap-2">
                  {donation.urgency === 'Critical' && <AlertCircle className="h-4 w-4 text-destructive" />}
                  {donation.urgency}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requested Group</p>
                <p className="font-medium mt-1">{donation.bloodGroup}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          <Card className="p-6 bg-primary-soft border-primary/20">
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5" />
              Your Donation Made a Difference
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              Thank you for your life-saving contribution. This single donation has the potential to help multiple patients in need.
            </p>
            <div className="bg-white/50 rounded-lg p-3 grid grid-cols-2 gap-2 text-center divide-x">
              <div>
                <p className="text-2xl font-bold text-primary">1</p>
                <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Donation</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">3</p>
                <p className="text-xs text-muted-foreground font-medium uppercase mt-1">Potential Lives</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold border-b pb-3 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Timeline
            </h3>
            <div className="relative border-l-2 border-muted ml-3 space-y-6">
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                <p className="font-medium text-sm">Request Matched</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(donation.createdAt)}</p>
              </div>
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                <p className="font-medium text-sm">Donation Scheduled</p>
                <p className="text-xs text-muted-foreground mt-1">Pending Confirmation</p>
              </div>
              <div className="relative pl-6">
                <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-background ${donation.status === 'Completed' ? 'bg-success' : 'bg-muted'}`} />
                <p className="font-medium text-sm">Donation Completed</p>
                {donation.status === 'Completed' && (
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(donation.donationDate)}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
