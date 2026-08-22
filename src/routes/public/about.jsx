import { HeartHandshake, ShieldCheck, Target, Users } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import Button from "@/components/blood/Button";

const values = [
  { icon: ShieldCheck, title: "Safety first", body: "Every donor is screened and every donation is logged against medical eligibility rules." },
  { icon: Target, title: "Speed matters", body: "Smart matching alerts compatible donors nearby within seconds of a critical request." },
  { icon: Users, title: "Community owned", body: "Blood banks, hospitals and volunteers share one accurate source of availability." },
  { icon: HeartHandshake, title: "Zero cost", body: "LifeDrop is free for donors and patients. No brokers, no hidden charges." },
];

function About() {
  return (
    <SiteLayout>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">About LifeDrop</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            We started LifeDrop after seeing families spend critical hours calling strangers for a
            single unit of blood. Our platform replaces that chaos with a verified donor registry,
            real-time inventory and traceable donation records.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] 2xl:max-w-[2560px] px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <v.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-foreground">{v.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>

        <div className="surface mt-10 grid gap-8 p-8 md:grid-cols-3">
          {[
            ["2019", "Founded with 40 volunteer donors in a single city."],
            ["2023", "Partnered with 24 blood banks and 60 hospitals."],
            ["2026", "12,480 active donors and 34,921 units donated."],
          ].map(([year, text]) => (
            <div key={year}>
              <p className="text-sm font-semibold text-primary">{year}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button as="link" to="/register">
            Join the donor network
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}

export default About;
