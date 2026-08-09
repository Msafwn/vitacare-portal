import { createFileRoute } from "@tanstack/react-router";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { CITIES } from "@/data/mock";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Account Settings — LifeDrop" },
      {
        name: "description",
        content: "Manage notification preferences, privacy, search radius and account security.",
      },
      { property: "og:title", content: "Account Settings — LifeDrop" },
      { property: "og:description", content: "Notifications, privacy and security preferences." },
    ],
  }),
  component: Settings,
});

const toggles = [
  ["Request alerts", "Notify me when a matching blood request is raised nearby.", true],
  ["Eligibility reminders", "Remind me when I become eligible to donate again.", true],
  ["SMS notifications", "Send critical alerts by SMS in addition to email.", false],
  ["Show profile publicly", "Let recipients find me in donor search results.", true],
];

function Toggle({ defaultChecked }) {
  return (
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
      className="h-5 w-9 shrink-0 appearance-none rounded-full bg-muted transition-colors checked:bg-success"
    />
  );
}

function Settings() {
  return (
    <UserLayout>
      <PageHeader title="Settings" description="Control notifications, privacy and security." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold text-foreground">Preferences</h2>
          <div className="mt-4 divide-y divide-border">
            {toggles.map(([title, desc, on]) => (
              <div key={title} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                </div>
                <Toggle defaultChecked={on} />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">Search preferences</h2>
            <Field label="Default city">
              <Select options={CITIES} defaultValue="Karachi" />
            </Field>
            <Field label="Search radius (km)">
              <Input type="number" defaultValue="25" />
            </Field>
            <Button onClick={() => toast.success("Preferences saved")}>Save preferences</Button>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">Security</h2>
            <Field label="Current password">
              <Input type="password" placeholder="••••••••" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <Input type="password" placeholder="••••••••" />
              </Field>
              <Field label="Confirm password">
                <Input type="password" placeholder="••••••••" />
              </Field>
            </div>
            <Button variant="secondary" onClick={() => toast.success("Password updated")}>
              Update password
            </Button>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Danger zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deleting your account removes your donor profile and history permanently.
            </p>
            <Button
              variant="danger"
              className="mt-4"
              onClick={() => toast.error("Account deletion requires email confirmation")}
            >
              Delete account
            </Button>
          </Card>
        </div>
      </div>
    </UserLayout>
  );
}
