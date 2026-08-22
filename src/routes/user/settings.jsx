import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import {
  useGetCurrentUserQuery,
  useUpdatePreferencesMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from "@/features/users/userApiSlice";

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="relative w-9 h-5 bg-gray-200 dark:bg-zinc-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
    </label>
  );
}

function Settings() {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetCurrentUserQuery();
  const [updatePreferences, { isLoading: isUpdatingPrefs }] = useUpdatePreferencesMutation();
  const [changePassword, { isLoading: isChangingPwd }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const user = response?.data;

  // Preferences State
  const [prefs, setPrefs] = useState({
    searchRadius: 25,
    requestAlerts: true,
    eligibilityReminders: true,
    smsNotifications: false,
    showProfilePublicly: true,
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setPrefs({
        searchRadius: user.searchRadius ?? 25,
        requestAlerts: user.requestAlerts ?? true,
        eligibilityReminders: user.eligibilityReminders ?? true,
        smsNotifications: user.smsNotifications ?? false,
        showProfilePublicly: user.showProfilePublicly ?? true,
      });
    }
  }, [user]);

  const handleToggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences(prefs).unwrap();
      toast.success("Preferences saved successfully");
    } catch (err) {
      toast.error(err.data?.message || "Failed to save preferences");
    }
  };

  const handleUpdatePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }).unwrap();
      toast.success("Password updated successfully. Please login again.");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // Redirect to login page
      navigate("/login");
    } catch (err) {
      toast.error(err.data?.message || "Failed to update password");
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAccount().unwrap();
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.data?.message || "Failed to delete account");
    }
  };

  const toggleItems = [
    { key: "requestAlerts", title: "Request alerts", desc: "Notify me when a matching blood request is raised nearby." },
    { key: "eligibilityReminders", title: "Eligibility reminders", desc: "Remind me when I become eligible to donate again." },
    { key: "smsNotifications", title: "SMS notifications", desc: "Send critical alerts by SMS in addition to email." },
    { key: "showProfilePublicly", title: "Show profile publicly", desc: "Let recipients find me in donor search results." },
  ];

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </UserLayout>
    );
  }

  if (!user) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12 text-muted-foreground">
          Failed to load settings.
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <PageHeader title="Settings" description="Control notifications, privacy and security." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-base font-semibold text-foreground">Preferences</h2>
          <div className="mt-4 divide-y divide-border">
            {toggleItems.map(({ key, title, desc }) => (
              <div key={key} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                </div>
                <Toggle checked={prefs[key]} onChange={() => handleToggle(key)} />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">Search preferences</h2>
            <Field label="Search radius (km)">
              <Input
                type="number"
                value={prefs.searchRadius}
                onChange={(e) => setPrefs({ ...prefs, searchRadius: parseInt(e.target.value) })}
              />
            </Field>
            <Button onClick={handleSavePreferences} disabled={isUpdatingPrefs}>
              {isUpdatingPrefs ? "Saving..." : "Save preferences"}
            </Button>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-base font-semibold text-foreground">Security</h2>
            <Field label="Current password">
              <Input
                type="password"
                placeholder="••••••••"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
              </Field>
              <Field label="Confirm password">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
              </Field>
            </div>
            <Button variant="secondary" onClick={handleUpdatePassword} disabled={isChangingPwd}>
              {isChangingPwd ? "Updating..." : "Update password"}
            </Button>
          </Card>

          <Card>
            <h2 className="text-base font-semibold text-foreground">Danger zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Deleting your account removes your donor profile and history permanently.
            </p>
            <Button variant="danger" className="mt-4" onClick={handleDeleteAccount} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete account"}
            </Button>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="bg-background rounded-xl p-6 max-w-md w-full shadow-xl border border-border">
            <h3 className="text-lg font-bold text-foreground">Delete Account</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to permanently delete your account? All your data, donation history, and profile will be wiped out. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes, delete my account"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}

export default Settings;
