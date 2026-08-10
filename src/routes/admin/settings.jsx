import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import Avatar from "@/components/blood/Avatar";
import StatusBadge from "@/components/blood/StatusBadge";
import { toast } from "@/components/blood/Toast";

const team = [
  { name: "Admin User", email: "admin@lifedrop.org", role: "Super admin", status: "active" },
  { name: "Sadia Kamal", email: "sadia@lifedrop.org", role: "Moderator", status: "active" },
  { name: "Hamza Riaz", email: "hamza@lifedrop.org", role: "Inventory", status: "pending" },
];

function AdminSettings() {
  return (
    <AdminLayout>
      <PageHeader title="Settings" description="Platform configuration and admin access." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5">
          <h2 className="text-base font-semibold text-foreground">Platform</h2>
          <Field label="Organisation name">
            <Input defaultValue="LifeDrop Blood Network" />
          </Field>
          <Field label="Support email">
            <Input type="email" defaultValue="support@lifedrop.org" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Low stock threshold (units)">
              <Input type="number" defaultValue="20" />
            </Field>
            <Field label="Critical threshold (units)">
              <Input type="number" defaultValue="10" />
            </Field>
          </div>
          <Field label="Minimum days between donations">
            <Select options={["56", "60", "90"]} defaultValue="56" />
          </Field>
          <Field label="Public announcement">
            <Textarea placeholder="Shown on the donor dashboard…" />
          </Field>
          <Button onClick={() => toast.success("Settings saved")}>Save settings</Button>
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Admin team</h2>
              <Button size="sm" variant="secondary" onClick={() => toast.info("Invite sent")}>
                Invite
              </Button>
            </div>
            <div className="mt-4 divide-y divide-border">
              {team.map((t) => (
                <div key={t.email} className="flex items-center gap-3 py-3">
                  <Avatar name={t.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.role}</span>
                  <StatusBadge status={t.status} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Security</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Two-factor authentication is enforced for all administrator accounts.
            </p>
            <Button
              variant="secondary"
              className="mt-4"
              onClick={() => toast.success("Sessions revoked")}
            >
              Revoke all sessions
            </Button>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
