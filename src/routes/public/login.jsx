import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Users, Heart, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "@/features/users/userApiSlice";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true, // Default to true for convenience
    }
  });

  useEffect(() => {
    // Check for saved email in localStorage for "Remember me"
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
      setValue("rememberMe", true);
    }
  }, [setValue]);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now log in.");
    }
  }, [searchParams]);

  async function onSubmit(data) {
    try {
      const response = await login({ 
        email: data.email, 
        password: data.password, 
        rememberMe: data.rememberMe 
      }).unwrap();
      
      // Store tokens in localStorage for authorization fallback (especially mobile browsers blocking cookies)
      if (response?.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      if (response?.data?.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      // Handle "Remember me" on frontend
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Welcome back!");
      const redirectUrl = searchParams.get("redirect") || `/dashboard?email=${data.email}`;
      navigate(redirectUrl);
    } catch (err) {
      toast.error(err.data?.message || "Failed to login. Please check your credentials.");
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Pane */}
      <div className="hidden lg:flex w-1/2 flex-col bg-primary p-12 text-primary-foreground relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-[20%] -left-[10%] h-[800px] w-[800px] rounded-full bg-black/5 pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[800px] w-[800px] rounded-full bg-black/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto">
          <div className="self-start [&_.bg-primary]:!bg-white/20 [&_.text-foreground]:!text-white [&_.text-primary]:!text-white">
            <Logo />
          </div>

          <div className="my-auto pt-8">
            <h1 className="text-2xl font-bold leading-tight tracking-tight">Welcome back to LifeDrop.</h1>
            <p className="mt-2 text-[10px] text-primary-foreground/90 leading-relaxed">
              Sign in to keep helping people find the blood they need, when they need it.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">10,000+ registered donors across the country</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Heart className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">5,000+ donations successfully coordinated</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9  w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium">Contact details shared only when it matters</span>
              </div>
            </div>
          </div>

          <div className="mt-auto text-xs font-medium text-primary-foreground/70">
            Copyright &copy; 2026 LifeDrop. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex w-full lg:w-1/2 h-full overflow-y-auto items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue to LifeDrop.
            </p>
          </div>

          {searchParams.get("error") === "suspended" && (
            <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-primary font-medium text-center">
              Your account has been suspended by the administrator. Please contact support.
            </div>
          )}

          {searchParams.get("error") === "unverified" && (
            <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-600 font-medium text-center">
              Your email is not verified. Please check your inbox for the activation link.
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Field label="Email" error={errors.email?.message} required>
              <div className="relative">
                <Input type="email" placeholder="you@example.com" className="pl-10" {...register("email")} />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </Field>
            <Field label="Password" error={errors.password?.message} required>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10" 
                  {...register("password")} 
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
            </Field>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-medium text-muted-foreground">
                <input type="checkbox" {...register("rememberMe")} className="h-4 w-4 rounded border-border accent-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-semibold">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
