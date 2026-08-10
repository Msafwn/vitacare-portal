import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Avatar from "@/components/blood/Avatar";
import StatusBadge from "@/components/blood/StatusBadge";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, CITIES, currentUser, formatDate } from "@/data/mock";

function Profile() {
  function onSubmit(e) {
    e.preventDefault();
    toast.success("Profile updated");
  }

  return (
    <UserLayout>
      <PageHeader title="Profile" description="Keep your details accurate so donors can reach you." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit text-center">
          <div className="flex flex-col items-center">
            <Avatar name={currentUser.name} size="lg" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-lg bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
                {currentUser.bloodGroup}
              </span>
              <StatusBadge status={currentUser.available ? "available" : "unavailable"} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-left">
            <div>
              <p className="text-xs text-muted-foreground">Donations</p>
              <p className="text-lg font-semibold text-foreground">{currentUser.totalDonations}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last donated</p>
              <p className="text-sm font-medium text-foreground">
                {formatDate(currentUser.lastDonation)}
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={onSubmit} className="lg:col-span-2">
          <Card className="space-y-5">
            <h2 className="text-base font-semibold text-foreground">Personal information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name">
                <Input defaultValue={currentUser.name} />
              </Field>
              <Field label="Email">
                <Input type="email" defaultValue={currentUser.email} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Phone">
                <Input defaultValue={currentUser.phone} />
              </Field>
              <Field label="Blood group">
                <Select options={BLOOD_GROUPS} defaultValue={currentUser.bloodGroup} />
              </Field>
              <Field label="City">
                <Select options={CITIES} defaultValue={currentUser.city} />
              </Field>
            </div>
            <Field label="Address">
              <Textarea defaultValue={currentUser.address} />
            </Field>
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Available to donate</p>
                <p className="text-xs text-muted-foreground">
                  Turn off if you are temporarily unable to donate.
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={currentUser.available}
                className="h-5 w-9 appearance-none rounded-full bg-muted transition-colors checked:bg-success"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Save changes</Button>
              <Button type="reset" variant="secondary">
                Reset
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </UserLayout>
  );
}

export default Profile;
