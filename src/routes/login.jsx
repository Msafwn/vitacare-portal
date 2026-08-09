import { createFileRoute, Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import { toast } from "@/components/blood/Toast";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — LifeDrop Donor Portal" },
      {
        name: "description",
        content: "Sign in to your LifeDrop account to manage blood requests, donations and profile.",
      },
      { property: "og:title", content: "Log in — LifeDrop Donor Portal" },
      { property: "og:description", content: "Access your donor dashboard and blood requests." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="surface mt-8 p-7">
          <h1 className="text-xl font-semibold text-foreground">Log in to your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your donations, requests and donor availability.
          </p>
          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <Field label="Email" required>
              <Input type="email" placeholder="you@example.com" required />
            </Field>
            <Field label="Password" required>
              <Input type="password" placeholder="••••••••" required />
            </Field>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                Remember me
              </label>
              <Link to="/contact" className="font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Log in
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to LifeDrop?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Are you an administrator?{" "}
          <Link to="/admin/login" className="font-medium text-primary hover:underline">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
}
