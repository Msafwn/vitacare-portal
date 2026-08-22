import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, ShieldCheck } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Avatar from "@/components/blood/Avatar";
import StatusBadge from "@/components/blood/StatusBadge";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import Modal from "@/components/blood/Modal";
import { toast } from "@/components/blood/Toast";
import { useGetCurrentUserQuery, useUpdateAccountMutation } from "@/features/users/userApiSlice";
import { BLOOD_GROUPS, CITIES, formatDate } from "@/data/mock";

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

function Profile() {
  const dispatch = useDispatch();
  const { data: response, isLoading } = useGetCurrentUserQuery();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();

  const currentUser = response?.data;
  const isDonor = currentUser?.isDonor;
  const availability = currentUser?.availability;
  const lastDonationDate = currentUser?.lastDonationDate;
  const bloodGroup = currentUser?.bloodGroup;
  
  const [avatarBase64, setAvatarBase64] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isAvailable, setIsAvailable] = useState(availability === "Available");
  const [isOptOutModalOpen, setIsOptOutModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (availability) {
      setIsAvailable(availability === "Available");
    }
  }, [availability]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      address: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        city: currentUser.city || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser, reset]);

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </UserLayout>
    );
  }

  if (!currentUser) {
    return (
      <UserLayout>
        <div className="flex justify-center py-12 text-muted-foreground">
          Failed to load profile.
        </div>
      </UserLayout>
    );
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File too large", { description: "Image size must be less than 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result);
        setAvatarFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data) {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("city", data.city);
      formData.append("address", data.address || "");
      
      if (isDonor) {
        formData.append("availability", isAvailable ? "Available" : "Currently Unavailable");
      }
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await updateAccount(formData).unwrap();
      toast.success("Profile updated successfully");
      setAvatarFile(null);
    } catch (err) {
      toast.error(err.data?.message || "Failed to update profile. Please try again.");
    }
  }

  async function confirmOptOut() {
    setIsOptOutModalOpen(false);
    try {
      const formData = new FormData();
      formData.append("isDonor", false);
      await updateAccount(formData).unwrap();
      toast.success("You have been removed from the donor list.");
    } catch (err) {
      toast.error("Failed to update status.");
    }
  }

  const handleReset = () => {
    reset();
    setAvatarBase64("");
    setAvatarFile(null);
    setIsAvailable(currentUser?.availability === "Available");
  };

  return (
    <UserLayout>
      <PageHeader title="Profile" description="Manage your account details and preferences." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit text-center">
          <div className="flex flex-col items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={handleAvatarClick}
              className="relative group cursor-pointer rounded-full overflow-hidden shrink-0"
            >
              <Avatar name={currentUser?.name} src={avatarBase64 || currentUser?.avatar} size="xl" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground flex items-center justify-center gap-1.5">
              {currentUser.name}
              {currentUser.verified && <ShieldCheck className="h-4 w-4 text-success" />}
            </h2>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              {isDonor ? (
                <>
                  <span className="rounded-lg bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
                    {bloodGroup || "Not Set"}
                  </span>
                  <StatusBadge status={currentUser?.availability === "Available" ? "available" : "unavailable"} />
                </>
              ) : (
                <span className="rounded-lg bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Registered User
                </span>
              )}
            </div>
          </div>
          
          {isDonor ? (
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-left">
              <div>
                <p className="text-xs text-muted-foreground">Donations</p>
                <p className="text-lg font-semibold text-foreground">{currentUser.totalDonations}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last donated</p>
                <p className="text-sm font-medium text-foreground">
                  {lastDonationDate ? formatDate(lastDonationDate) : "Never"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 border-t border-border pt-5 text-left">
              <div className="bg-primary-soft/50 rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-primary">Not a Donor Yet?</p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">Join our network of heroes today and help save lives.</p>
                <Button as="link" to="/become-donor" size="sm" className="w-full text-xs h-8">
                  Become a Donor
                </Button>
              </div>
            </div>
          )}
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2">
          <Card className="space-y-5">
            <h2 className="text-base font-semibold text-foreground">Personal information</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.name?.message} required>
                <Input placeholder="Your name" {...register("name")} />
              </Field>
              <Field label="Email" error={errors.email?.message} required>
                <Input type="email" placeholder="you@example.com" {...register("email")} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone" error={errors.phone?.message} required>
                <Input placeholder="+92 300 0000000" {...register("phone")} />
              </Field>
              <Field label="City" error={errors.city?.message} required>
                <Select options={CITIES} placeholder="Select" {...register("city")} />
              </Field>
            </div>
            <Field label="Address" error={errors.address?.message} required>
              <Textarea placeholder="Full address" {...register("address")} />
            </Field>

            {isDonor && (
              <>
                <hr className="border-border" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Available to donate</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Toggle availability to appear in search results for urgent needs.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="relative w-9 h-5 bg-gray-200 dark:bg-zinc-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-success"></div>
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2 border-t mt-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
              <Button type="button" onClick={handleReset} variant="secondary">
                Reset
              </Button>
            </div>
          </Card>

          {isDonor && (
            <Card className="mt-6 border-destructive/20 bg-destructive/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    No longer want to be a blood donor? You can opt-out permanently. You will need to re-register if you change your mind.
                  </p>
                </div>
                <Button 
                  type="button" 
                  variant="soft" 
                  className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground shrink-0"
                  onClick={() => setIsOptOutModalOpen(true)}
                  disabled={isUpdating}
                >
                  Opt-out as Donor
                </Button>
              </div>
            </Card>
          )}
        </form>
      </div>

      <Modal
        open={isOptOutModalOpen}
        onClose={() => setIsOptOutModalOpen(false)}
        title="Remove Donor Status"
        description="Are you sure you want to remove yourself as a donor? You will no longer appear in search results and will stop receiving urgent blood requests."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOptOutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={confirmOptOut}
            >
              Yes, opt-out
            </Button>
          </>
        }
      />
    </UserLayout>
  );
}

export default Profile;
