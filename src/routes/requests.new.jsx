import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";

export const Route = createFileRoute("/requests/new")({
  head: () => ({
    meta: [
      { title: "Create a Blood Request — LifeDrop" },
      {
        name: "description",
        content:
          "Raise a blood request with patient details, blood group, units and hospital — matched donors are notified instantly.",
      },
      { property: "og:title", content: "Create a Blood Request — LifeDrop" },
      { property: "og:description", content: "Raise a request and reach matching donors instantly." },
    ],
  }),
  component: CreateRequest,
});

function CreateRequest() {
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    toast.success("Request submitted", {
      description: "Matching donors in your city have been notified.",
    });
    navigate({ to: "/requests" });
  }

  return (
    <UserLayout>
      <PageHeader
        title="Create blood request"
        description="Provide accurate details so we can match the right donors quickly."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="lg:col-span-2">
          <Card className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Patient name" required>
                <Input placeholder="Full name" required />
              </Field>
              <Field label="Patient age">
                <Input type="number" min="0" placeholder="e.g. 34" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Blood group" required>
                <Select options={BLOOD_GROUPS} placeholder="Select" required />
              </Field>
              <Field label="Units required" required>
                <Input type="number" min="1" defaultValue="1" required />
              </Field>
              <Field label="Urgency" required>
                <Select options={["normal", "urgent", "critical"]} placeholder="Select" required />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Hospital" required>
                <Input placeholder="Hospital name" required />
              </Field>
              <Field label="City" required>
                <Select options={CITIES} placeholder="Select" required />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Required by" required>
                <Input type="date" required />
              </Field>
              <Field label="Contact number" required>
                <Input placeholder="+92 300 0000000" required />
              </Field>
            </div>
            <Field label="Additional notes" hint="Ward number, attendant name or medical context.">
              <Textarea placeholder="Anything donors should know…" />
            </Field>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit">Submit request</Button>
              <Button type="button" variant="secondary" onClick={() => navigate({ to: "/requests" })}>
                Cancel
              </Button>
            </div>
          </Card>
        </form>

        <Card className="h-fit">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Before you submit</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li>Confirm the blood group from the hospital report.</li>
                <li>Critical requests are reviewed by our team within 15 minutes.</li>
                <li>Keep your contact number reachable — donors call directly.</li>
                <li>Cancel the request as soon as it is fulfilled.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>
  );
}
