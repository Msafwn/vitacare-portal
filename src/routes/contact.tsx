import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import Button from "@/components/blood/Button";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact LifeDrop — Support for Donors & Hospitals" },
      {
        name: "description",
        content:
          "Reach the LifeDrop team for donor support, hospital partnerships or emergency blood request help.",
      },
      { property: "og:title", content: "Contact LifeDrop — Support for Donors & Hospitals" },
      {
        property: "og:description",
        content: "Donor support, hospital partnerships and emergency request help.",
      },
    ],
  }),
  component: Contact,
});

const details = [
  { icon: Phone, label: "24/7 helpline", value: "+92 21 111 555 000" },
  { icon: Mail, label: "Email", value: "support@lifedrop.org" },
  { icon: MapPin, label: "Head office", value: "Suite 402, Shahrah-e-Faisal, Karachi" },
];

function Contact() {
  function onSubmit(e) {
    e.preventDefault();
    toast.success("Message sent", { description: "Our team replies within one business day." });
    e.currentTarget.reset();
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contact us</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Questions about donating, a request, or partnering your blood bank with LifeDrop? We are
          here to help.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <form onSubmit={onSubmit} className="surface space-y-5 p-6 lg:col-span-2">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" required>
                <Input placeholder="Your name" required />
              </Field>
              <Field label="Email" required>
                <Input type="email" placeholder="you@example.com" required />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone">
                <Input placeholder="+92 300 0000000" />
              </Field>
              <Field label="Topic">
                <Select
                  options={["Donor support", "Blood request", "Hospital partnership", "Other"]}
                  placeholder="Select a topic"
                />
              </Field>
            </div>
            <Field label="Message" required>
              <Textarea placeholder="How can we help?" required />
            </Field>
            <Button type="submit">Send message</Button>
          </form>

          <div className="space-y-4">
            {details.map((d) => (
              <div key={d.label} className="surface flex items-start gap-3 p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <d.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{d.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
