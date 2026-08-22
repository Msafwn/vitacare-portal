import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";
import axiosInstance from "@/lib/axios";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data) {
    try {
      await axiosInstance.post("/users/forgot-password", {
        email: data.email,
      });
      setEmailSent(true);
      toast.success("Reset link sent!", {
        description: "Check your email (or terminal console) for the reset link.",
      });
    } catch (error) {
      console.error("Forgot password request failed:", error);
      toast.error("Request Failed", {
        description: error.response?.data?.message || "Something went wrong. Please try again.",
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
          <h2 className="text-2xl font-bold text-foreground">Forgot Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {!emailSent 
              ? "Enter your email address and we'll send you a link to reset your password."
              : "We've sent a password reset link to your email."}
          </p>
        </div>

        {!emailSent ? (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Field label="Email Address" error={errors.email?.message} required>
              <div className="relative">
                <Input type="email" placeholder="you@example.com" className="pl-10" {...register("email")} />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </Field>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-semibold">
              {isSubmitting ? "Sending link..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-primary-soft/30 rounded-xl text-sm text-primary font-medium">
              A link has been sent. If you are in development, check the backend console log for the link!
            </div>
            <Button as="link" to="/login" variant="secondary" className="w-full h-12 text-base font-semibold">
              Return to Login
            </Button>
          </div>
        )}

        {!emailSent && (
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

export default ForgotPassword;
