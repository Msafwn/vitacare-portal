import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import Avatar from "@/components/blood/Avatar";
import StatusBadge from "@/components/blood/StatusBadge";
import Modal from "@/components/blood/Modal";
import { toast } from "@/components/blood/Toast";
import { 
  useGetAdminSettingsQuery, 
  useUpdateAdminSettingsMutation, 
  useGetAdminTeamQuery,
  useAddAdminMutation,
  useRevokeSessionsMutation
} from "@/features/admin/adminApiSlice";

function AdminSettings() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { data: settingsResponse, isLoading: isLoadingSettings } = useGetAdminSettingsQuery();
  const { data: teamResponse, isLoading: isLoadingTeam } = useGetAdminTeamQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation();
  const [addAdmin, { isLoading: isAddingAdmin }] = useAddAdminMutation();
  const [revokeSessions, { isLoading: isRevoking }] = useRevokeSessionsMutation();

  const settings = settingsResponse?.data;
  const team = teamResponse?.data || [];

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      organizationName: "",
      supportEmail: "",
      lowStockThreshold: 20,
      criticalStockThreshold: 10,
      minDaysBetweenDonations: 56,
      publicAnnouncement: ""
    }
  });

  const { 
    register: registerInvite, 
    handleSubmit: handleSubmitInvite, 
    reset: resetInvite,
    formState: { errors: inviteErrors }
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: ""
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        organizationName: settings.organizationName,
        supportEmail: settings.supportEmail,
        lowStockThreshold: settings.lowStockThreshold,
        criticalStockThreshold: settings.criticalStockThreshold,
        minDaysBetweenDonations: settings.minDaysBetweenDonations,
        publicAnnouncement: settings.publicAnnouncement || ""
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    try {
      // Convert numeric fields
      const payload = {
        ...data,
        lowStockThreshold: parseInt(data.lowStockThreshold),
        criticalStockThreshold: parseInt(data.criticalStockThreshold),
        minDaysBetweenDonations: parseInt(data.minDaysBetweenDonations)
      };
      await updateSettings(payload).unwrap();
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save settings");
    }
  };

  const onInviteAdmin = async (data) => {
    try {
      await addAdmin(data).unwrap();
      toast.success("Admin account created successfully");
      setIsInviteModalOpen(false);
      resetInvite();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create admin account");
    }
  };

  const handleRevokeSessions = async () => {
    if (window.confirm("Are you sure you want to revoke all other admin sessions? They will be logged out immediately.")) {
      try {
        await revokeSessions().unwrap();
        toast.success("All other admin sessions have been revoked");
      } catch (err) {
        toast.error("Failed to revoke sessions");
      }
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="Settings" description="Platform configuration and admin access." />

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="space-y-5">
            <h2 className="text-base font-semibold text-foreground">Platform</h2>
            <Field label="Organisation name">
              <Input {...register("organizationName")} disabled={isLoadingSettings} required />
            </Field>
            <Field label="Support email">
              <Input type="email" {...register("supportEmail")} disabled={isLoadingSettings} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Low stock threshold (units)">
                <Input type="number" {...register("lowStockThreshold")} disabled={isLoadingSettings} required min="1" />
              </Field>
              <Field label="Critical threshold (units)">
                <Input type="number" {...register("criticalStockThreshold")} disabled={isLoadingSettings} required min="1" />
              </Field>
            </div>
            <Field label="Minimum days between donations">
              <Select 
                options={["56", "60", "90"]} 
                {...register("minDaysBetweenDonations")} 
                disabled={isLoadingSettings} 
              />
            </Field>
            <Field label="Public announcement">
              <Textarea 
                placeholder="Shown on the donor dashboard…" 
                {...register("publicAnnouncement")} 
                disabled={isLoadingSettings} 
              />
            </Field>
            <Button type="submit" disabled={isUpdating || isLoadingSettings}>
              {isUpdating ? "Saving..." : "Save settings"}
            </Button>
          </Card>
        </form>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">Admin team</h2>
              <Button size="sm" variant="secondary" onClick={() => setIsInviteModalOpen(true)}>
                Invite
              </Button>
            </div>
            <div className="mt-4 divide-y divide-border">
              {isLoadingTeam ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading team...</div>
              ) : team.length > 0 ? (
                team.map((t) => (
                  <div key={t.email} className="flex items-center gap-3 py-3">
                    <Avatar name={t.name} src={t.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{t.role}</span>
                    <StatusBadge status={t.status} />
                  </div>
                ))
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">No admin users found.</div>
              )}
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
              onClick={handleRevokeSessions}
              disabled={isRevoking}
            >
              {isRevoking ? "Revoking..." : "Revoke all sessions"}
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        open={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Administrator"
        description="Create a new admin account to manage the platform."
      >
        <form onSubmit={handleSubmitInvite(onInviteAdmin)} className="space-y-4">
          <Field label="Full Name" error={inviteErrors.name?.message} required>
            <Input placeholder="John Doe" {...registerInvite("name", { required: "Name is required" })} />
          </Field>
          <Field label="Email Address" error={inviteErrors.email?.message} required>
            <Input type="email" placeholder="admin@lifedrop.org" {...registerInvite("email", { required: "Email is required" })} />
          </Field>
          <Field label="Phone Number" error={inviteErrors.phone?.message} required>
            <Input type="tel" placeholder="0300 1234567" {...registerInvite("phone", { required: "Phone is required" })} />
          </Field>
          <Field label="Temporary Password" error={inviteErrors.password?.message} required>
            <Input type="password" placeholder="••••••••" {...registerInvite("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
          </Field>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAddingAdmin}>
              {isAddingAdmin ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default AdminSettings;
