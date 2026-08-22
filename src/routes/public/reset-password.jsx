import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";
import axiosInstance from "@/lib/axios";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState(false);
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data) {
    if (!token) {
      toast.error("Invalid Request", {
        description: "Password reset token is missing. Please check your link.",
      });
      return;
    }

    try {
      await axiosInstance.post(`/users/reset-password?token=${token}`, {
        password: data.password,
      });
      setSuccess(true);
      toast.success("Success!", {
        description: "Your password has been reset successfully.",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset password failed:", error);
      toast.error("Reset Failed", {
        description: error.response?.data?.message || "Invalid or expired token.",
      });
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md border border-border rounded-xl p-8 bg-card shadow-sm">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Reset Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {!success 
              ? "Please enter and confirm your new password below."
              : "Your password has been updated. Redirecting to login..."}
          </p>
        </div>

        {!token ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
              No reset token found in URL. Please click the link sent to your email again.
            </div>
            <Button as="link" to="/login" variant="secondary" className="w-full h-12 text-base font-semibold">
              Back to Login
            </Button>
          </div>
        ) : !success ? (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Field label="New Password" error={errors.password?.message} required>
              <div className="relative">
                <Input type="password" placeholder="••••••••" className="pl-10" {...register("password")} />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </Field>

            <Field label="Confirm New Password" error={errors.confirmPassword?.message} required>
              <div className="relative">
                <Input type="password" placeholder="••••••••" className="pl-10" {...register("confirmPassword")} />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-semibold">
              {isSubmitting ? "Resetting password..." : "Reset Password"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-success animate-bounce" />
            </div>
            <div className="p-4 bg-success-soft/30 rounded-xl text-sm text-success font-medium">
              Password changed successfully! You will be redirected to the login page shortly.
            </div>
            <Button as="link" to="/login" className="w-full h-12 text-base font-semibold">
              Go to Login Now
            </Button>
          </div>
        )}

        {!success && (
          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
