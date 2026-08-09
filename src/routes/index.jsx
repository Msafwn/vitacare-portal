import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Droplet,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import Button from "@/components/blood/Button";
import Select from "@/components/blood/Select";
import { BLOOD_GROUPS, CITIES, inventory } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeDrop — Find Blood Donors Near You" },
      {
        name: "description",
        content:
          "Search verified blood donors by group and city, raise urgent blood requests and track every donation in one healthcare-grade platform.",
      },
      { property: "og:title", content: "LifeDrop — Find Blood Donors Near You" },
      {
        property: "og:description",
        content: "Search verified donors, raise requests and track donations in real time.",
      },
    ],
  }),
  component: Home,
});

const stats = [
  { label: "Registered donors", value: "12,480", icon: Users },
  { label: "Units donated", value: "34,921", icon: Droplet },
  { label: "Requests fulfilled", value: "9,362", icon: HeartHandshake },
  { label: "Avg. response time", value: "18 min", icon: Clock },
];

const steps = [
  {
    title: "Create your profile",
    body: "Register once with your blood group, city and availability. Verification takes minutes.",
  },
  {
    title: "Match with a request",
    body: "We notify eligible donors nearby the moment a compatible request is raised.",
  },
  {
    title: "Donate and track",
    body: "Every donation is logged so hospitals, donors and families stay in sync.",
  },
];

function Home() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified donor network
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Every drop counts.
              <br />
              Find the right donor in minutes.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              LifeDrop is a complete blood donation management system for donors, recipients and
              blood banks — search, request, match and track without the phone calls.
            </p>

            <div className="mt-8 surface p-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Select options={BLOOD_GROUPS} placeholder="Blood group" aria-label="Blood group" />
                <Select options={CITIES} placeholder="City" aria-label="City" />
                <Button as="link" to="/find-donors" size="md" className="sm:px-6">
                  Search donors
                </Button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button as="link" to="/register" variant="soft">
                Become a donor
              </Button>
              <Button as="link" to="/requests/new" variant="secondary">
                Request blood <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="surface p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Live blood availability</h2>
              <span className="text-xs text-muted-foreground">Updated today</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {inventory.map((i) => (
                <div key={i.group} className="rounded-xl border border-border p-4 text-center">
                  <p className="text-lg font-semibold text-primary">{i.group}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{i.units}</p>
                  <p className="text-xs text-muted-foreground">units</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4" /> Aggregated across 24 partner blood banks
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="surface p-5">
              <s.icon className="h-5 w-5 text-primary" />
              <p className="mt-4 text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">How it works</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Three simple steps from registration to a completed donation.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border border-border p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-sm font-semibold text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="surface flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Someone needs your blood group today
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join 12,000+ donors keeping hospitals stocked across the country.
            </p>
          </div>
          <div className="flex gap-3">
            <Button as="link" to="/register">
              Register as donor
            </Button>
            <Link
              to="/about"
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:bg-muted"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
