import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, ShieldAlert } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Avatar from "@/components/blood/Avatar";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { useGetCurrentUserQuery, useUpdateAccountMutation } from "@/features/users/userApiSlice";
import { CITIES } from "@/data/mock";

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

function AdminProfile() {
  const { data: response, isLoading } = useGetCurrentUserQuery();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();

  const currentUser = response?.data;
  
  const [avatarBase64, setAvatarBase64] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

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
      <AdminLayout>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!currentUser) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12 text-muted-foreground">
          Failed to load administrator profile.
        </div>
      </AdminLayout>
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

  const handleReset = () => {
    reset();
    setAvatarBase64("");
    setAvatarFile(null);
  };

  return (
    <AdminLayout>
      <PageHeader title="Admin Profile" description="Manage your personal administrator details." />

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
            <h2 className="mt-4 text-lg font-semibold text-foreground">{currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                <ShieldAlert className="h-3.5 w-3.5" /> System Administrator
              </span>
            </div>
          </div>
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

            <div className="flex gap-3 pt-2 border-t mt-4">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
              <Button type="button" onClick={handleReset} variant="secondary">
                Reset
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}

export default AdminProfile;
