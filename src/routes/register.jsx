import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register as a Blood Donor — LifeDrop" },
      {
        name: "description",
        content:
          "Create a free LifeDrop account to donate blood, respond to nearby requests and track your donation history.",
      },
      { property: "og:title", content: "Register as a Blood Donor — LifeDrop" },
      {
        property: "og:description",
        content: "Join the verified donor network and save lives near you.",
      },
    ],
  }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault();
    toast.success("Account created", { description: "Welcome to the LifeDrop donor network." });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="surface mt-8 p-7">
          <h1 className="text-xl font-semibold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            It takes under two minutes. You control when you are available to donate.
          </p>
          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
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
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              I confirm the information is accurate and agree to the donor safety guidelines.
            </label>
            <Button type="submit" className="w-full">
              Create account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
