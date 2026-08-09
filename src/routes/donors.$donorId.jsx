import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
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
import { donations, donors, formatDate } from "@/data/mock";

export const Route = createFileRoute("/donors/$donorId")({
  head: () => ({
    meta: [
      { title: "Donor Profile — LifeDrop" },
      {
        name: "description",
        content:
          "View a verified LifeDrop donor's blood group, location, availability and donation history.",
      },
      { property: "og:title", content: "Donor Profile — LifeDrop" },
      { property: "og:description", content: "Verified donor details and donation history." },
    ],
  }),
  component: DonorDetails,
});

function DonorDetails() {
  const { donorId } = useParams({ from: "/donors/$donorId" });
  const donor = donors.find((d) => d.id === donorId);
  const [open, setOpen] = useState(false);

  if (!donor) {
    return (
      <UserLayout>
        <div className="surface">
          <EmptyState title="Donor not found" description="This donor profile is unavailable." />
        </div>
      </UserLayout>
    );
  }

  const history = donations.filter((d) => d.donor === donor.name);

  return (
    <UserLayout>
      <PageHeader
        title="Donor details"
        description="Contact this donor only for genuine, verified requirements."
        actions={
          <Button onClick={() => setOpen(true)} disabled={donor.status !== "available"}>
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
              { icon: Calendar, label: "Last donation", value: formatDate(donor.lastDonation) },
              { icon: Phone, label: "Phone", value: donor.phone },
            ].map((s) => (
              <div key={s.label}>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5" /> {s.label}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{s.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-foreground">Contact</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" /> {donor.phone}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {donor.name.split(" ")[0].toLowerCase()}@example.com
            </p>
          </div>
          <Button variant="soft" className="mt-5 w-full" onClick={() => setOpen(true)}>
            Request donation
          </Button>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="text-base font-semibold text-foreground">Donation history</h3>
        {history.length === 0 ? (
          <EmptyState
            title="No recorded donations"
            description="This donor has no verified donations on LifeDrop yet."
          />
        ) : (
          <div className="mt-4 divide-y divide-border">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{h.center}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.city} · {formatDate(h.date)}
                  </p>
                </div>
                <StatusBadge status={h.status} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Request ${donor.name}`}
        description="The donor will be notified instantly and can accept or decline."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                toast.success("Request sent", { description: `${donor.name} has been notified.` });
              }}
            >
              Send request
            </Button>
          </>
        }
      >
        <Textarea placeholder="Add a short message with hospital name and urgency…" />
      </Modal>
    </UserLayout>
  );
}
