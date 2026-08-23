import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Droplet, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Avatar from "@/components/blood/Avatar";
import StatusBadge from "@/components/blood/StatusBadge";
import Modal from "@/components/blood/Modal";
import EmptyState from "@/components/blood/EmptyState";
import { Textarea } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";
import { formatDate } from "@/data/mock";
import { useGetDonorByIdQuery } from "@/features/users/userApiSlice";

function DonorDetails() {
  const { donorId: secureId } = useParams();
  const donorId = secureId ? secureId.replace("VITA-", "").replace("-SECURE", "") : null;
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetDonorByIdQuery(donorId);
  const donor = response?.data;

  const lastDonationTime = donor?.lastDonationDate ? new Date(donor.lastDonationDate) : null;
  const isRecentlyDonated = lastDonationTime ? (new Date() - lastDonationTime) / (1000 * 3600 * 24) < 90 : false;
  const nextEligibleDate = lastDonationTime ? new Date(lastDonationTime.getTime() + 90 * 24 * 60 * 60 * 1000) : null;

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </UserLayout>
    );
  }

  if (!donor) {
    return (
      <UserLayout>
        <div className="surface">
          <EmptyState title="Donor not found" description="This donor profile is unavailable." />
        </div>
      </UserLayout>
    );
  }

  // We do not show the full donation history publicly for privacy reasons.
  // The backend now provides the real `donor.donations` count instead.

  return (
    <UserLayout>
      <PageHeader
        title="Donor details"
        description="Contact this donor only for genuine, verified requirements."
        actions={
          <Button onClick={() => navigate(`/requests/new?donorId=VITA-${donor.id}-SECURE&donorName=${encodeURIComponent(donor.name)}`)} disabled={donor.status !== "available" || isRecentlyDonated}>
            Send request
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar name={donor.name} size="lg" />
            <div className="flex-1">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
                {donor.name}
                {donor.verified && <ShieldCheck className="h-5 w-5 text-success" />}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {donor.area}, {donor.city}
              </p>
            </div>
            <div className="text-center">
              <p className="rounded-xl bg-primary-soft px-4 py-2 text-xl font-semibold text-primary">
                {donor.bloodGroup}
              </p>
              <div className="mt-2">
                <StatusBadge status={donor.status} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            {[
              { icon: Droplet, label: "Total donations", value: donor.donations },
              { icon: Calendar, label: "Last donation", value: donor.lastDonation ? formatDate(donor.lastDonation) : 'Never' },
            ].map((s) => (
              <div key={s.label}>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5" /> {s.label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
          {isRecentlyDonated && (
            <div className="mt-5 rounded-xl bg-warning/10 p-4 text-warning border border-warning/20 text-sm font-medium flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-warning animate-pulse shrink-0" />
              Recently Donated. This donor is eligible to donate again on {nextEligibleDate ? formatDate(nextEligibleDate) : ''}.
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-foreground">Contact details</h3>
          {donor.phone ? (
            <div className="mt-4 space-y-4 rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary-soft p-2">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone number</p>
                  <p className="text-sm font-medium text-foreground">{donor.phone}</p>
                </div>
              </div>
              {donor.email && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary-soft p-2">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email address</p>
                    <p className="text-sm font-medium text-foreground">{donor.email}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-primary-soft/50 p-4 text-center">
              <ShieldCheck className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-sm font-medium text-foreground">Protected for Privacy</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Contact details are only shared once a blood request is accepted.
              </p>
            </div>
          )}

          <Button onClick={() => navigate(`/requests/new?donorId=VITA-${donor.id}-SECURE&donorName=${encodeURIComponent(donor.name)}`)} variant="soft" className="mt-5 w-full" disabled={donor.status !== "available" || isRecentlyDonated}>
            Send request
          </Button>
        </Card>
      </div>


    </UserLayout>
  );
}

export default DonorDetails;
