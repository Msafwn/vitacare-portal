import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";

function AdminLogin() {
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    localStorage.setItem("adminToken", "true");
    toast.success("Signed in as administrator");
    navigate("/admin/dashboard");
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
          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <Field label="Admin email" required>
              <Input type="email" placeholder="admin@lifedrop.org" required />
            </Field>
            <Field label="Password" required>
              <Input type="password" placeholder="••••••••" required />
            </Field>
            <Field label="Access code" hint="6-digit code from your authenticator app.">
              <Input inputMode="numeric" placeholder="••••••" />
            </Field>
            <Button type="submit" className="w-full">
              Sign in
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
