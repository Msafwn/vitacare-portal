import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";
import { useLoginMutation } from "@/features/users/userApiSlice";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid admin email address"),
  password: z.string().min(1, "Password is required"),
});

function AdminLogin() {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
  });

  async function onSubmit(data) {
    try {
      const response = await login({ email: data.email, password: data.password }).unwrap();
      const user = response?.data?.user;

      if (user?.role !== "admin") {
        toast.error("Access denied. You are not an administrator.");
        return;
      }

      localStorage.setItem("adminToken", "true");
      toast.success("Signed in as administrator");
      navigate("/admin/dashboard");
    } catch (e) {
      toast.error(e.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="surface mt-8 p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Restricted area
          </span>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Administrator login</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage donors, requests, inventory and reports.
          </p>
          {searchParams.get("error") === "suspended" && (
            <div className="mt-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-primary font-medium text-center">
              Your account has been suspended by the administrator. Please contact support.
            </div>
          )}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Field label="Admin email" error={errors.email?.message} required>
              <Input type="email" placeholder="admin@lifedrop.org" {...register("email")} />
            </Field>
            <Field label="Password" error={errors.password?.message} required>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pr-10"
                  {...register("password")} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Not an admin?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            User login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
