import { Link, useNavigate } from "react-router-dom";
import { Users, Heart, ShieldCheck } from "lucide-react";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";

function Register() {
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    toast.success("Account created", { description: "Welcome to the LifeDrop donor network." });
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
            <h1 className="text-2xl font-bold leading-tight tracking-tight">Join LifeDrop<br />today.</h1>
            <p className="mt-2 text-[10px] text-primary-foreground/90 leading-relaxed">
              Create an account to join our growing network of heroes. Every donation can save up to three lives.
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
                <div className="flex h-9 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
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
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-foreground">Create Account</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign up to continue to LifeDrop.
            </p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input placeholder="Your name" required />
              </Field>
              <Field label="Email" required>
                <Input type="email" placeholder="you@example.com" required />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone" required>
                <Input placeholder="+92 300 0000000" required />
              </Field>
              <Field label="Date of birth">
                <Input type="date" />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Blood group" required>
                <Select options={BLOOD_GROUPS} placeholder="Select" required />
              </Field>
              <Field label="City" required>
                <Select options={CITIES} placeholder="Select" required />
              </Field>
              <Field label="Account type">
                <Select options={["Donor", "Recipient", "Both"]} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Password" required>
                <Input type="password" placeholder="••••••••" required />
              </Field>
              <Field label="Confirm password" required>
                <Input type="password" placeholder="••••••••" required />
              </Field>
            </div>
            <label className="flex items-start gap-2 text-sm font-medium text-muted-foreground mt-2">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
           <span className="text-[10px]">I confirm the information is accurate and agree to the donor safety guidelines.</span>
            </label>
            <Button type="submit" className="w-full h-12 text-base font-semibold mt-2">
              Create account
            </Button>
          </form>
          
          <p className="mt-5 text-center text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
