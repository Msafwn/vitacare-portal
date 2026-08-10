import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Users, Heart, ShieldCheck, Mail, Lock, Eye } from "lucide-react";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";

function Login() {
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
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
          
          <form className="space-y-6" onSubmit={onSubmit}>
            <Field label="Email" required>
              <div className="relative">
                <Input type="email" placeholder="you@example.com" className="pl-10" required />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <Input type="password" placeholder="••••••••" className="pl-10 pr-10" required />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </Field>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-medium text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                Remember me
              </label>
              <Link to="/contact" className="font-semibold text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Login
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
