import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Building2, CalendarClock, Droplet, MapPin, User, AlertCircle, Phone } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import StatusBadge from "@/components/blood/StatusBadge";
import Modal from "@/components/blood/Modal";
import EmptyState from "@/components/blood/EmptyState";
import { toast } from "@/components/blood/Toast";
import { formatDate } from "@/data/mock";
import { useGetMyRequestsQuery, useUpdateRequestStatusMutation } from "@/features/requests/requestApiSlice";

function RequestDetails() {
  const { requestId } = useParams();
  const { data: response, isLoading } = useGetMyRequestsQuery();
  const [updateStatus] = useUpdateRequestStatusMutation();
  const [open, setOpen] = useState(false);

  const isRequester = response?.data?.sent?.some((r) => r.id === requestId);
  const isDonor = response?.data?.received?.some((r) => r.id === requestId);
  
  const allRequests = [...(response?.data?.sent || []), ...(response?.data?.received || [])];
  const rawRequest = allRequests.find((r) => r.id === requestId);

  const request = rawRequest ? {
    id: rawRequest.id,
    patient: rawRequest.patientName,
    requester: rawRequest.requester ? rawRequest.requester.name : "You",
    bloodGroup: rawRequest.bloodGroup,
    units: rawRequest.unitsRequired,
    hospital: rawRequest.hospital,
    city: rawRequest.city,
    neededOn: rawRequest.requiredBy || rawRequest.createdAt,
    createdAt: rawRequest.createdAt,
    urgency: rawRequest.urgency,
    status: rawRequest.status,
    contactNumber: rawRequest.contactNumber || "N/A",
    notes: rawRequest.notes || "No additional notes provided.",
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

  if (!request) {
    return (
      <UserLayout>
        <div className="surface">
          <EmptyState title="Request not found" description="This request no longer exists." />
        </div>
      </UserLayout>
    );
  }

  const facts = [
    { icon: User, label: "Patient", value: request.patient },
    { icon: Droplet, label: "Blood group", value: `${request.bloodGroup} · ${request.units} unit(s)` },
    { icon: Building2, label: "Hospital", value: request.hospital },
    { icon: MapPin, label: "City", value: request.city },
    { icon: Phone, label: "Contact Phone", value: request.contactNumber },
    { icon: CalendarClock, label: "Needed by", value: formatDate(request.neededOn) },
    { icon: CalendarClock, label: "Created", value: formatDate(request.createdAt) },
  ];

  return (
    <UserLayout>
      <PageHeader
        title="Request Details"
        description={`Raised by ${request.requester}`}
        actions={
          <>
            <StatusBadge status={request.urgency} />
            <StatusBadge status={request.status} />
            {isRequester && request.status !== 'cancelled' && request.status !== 'fulfilled' && (
              <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
                Cancel
              </Button>
            )}
            {isRequester && request.status === 'accepted' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={async () => {
                  try {
                    await updateStatus({ id: request.id, status: 'fulfilled' }).unwrap();
                    toast.success("Request marked as fulfilled!");
                  } catch (e) {
                    toast.error("Failed to mark as fulfilled");
                  }
                }}
              >
                Mark Fulfilled
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-foreground">Request details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <f.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">Notes</p>
            <p className="mt-1 text-sm text-foreground">{request.notes}</p>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-base font-semibold text-foreground">Activity timeline</h2>
        <ol className="mt-5 space-y-5 border-l border-border pl-5">
          {[
            ["Request created", formatDate(request.createdAt)],
            ["Donors notified", formatDate(request.createdAt)],
            ["Under review", formatDate(request.neededOn)],
          ].map(([title, date]) => (
            <li key={title} className="relative">
              <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{date}</p>
            </li>
          ))}
        </ol>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Cancel this request?"
        description="Donors who already accepted will be informed. This cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep request
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                setOpen(false);
                try {
                  await updateStatus({ id: request.id, status: 'cancelled' }).unwrap();
                  toast.success("Request cancelled");
                } catch (e) {
                  toast.error("Failed to cancel request");
                }
              }}
            >
              Cancel request
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This blood request for {request.patient} will be marked as cancelled.
        </p>
      </Modal>
    </UserLayout>
  );
}

export default RequestDetails;
