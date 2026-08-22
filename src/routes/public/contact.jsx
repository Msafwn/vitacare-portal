import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SiteLayout from "@/components/layout/SiteLayout";
import Button from "@/components/blood/Button";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { useSubmitContactMessageMutation } from "@/features/public/publicApiSlice";

const contactSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  topic: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional(),
});

const details = [
  { icon: Phone, label: "24/7 helpline", value: "+92 21 111 555 000" },
  { icon: Mail, label: "Email", value: "support@lifedrop.org" },
  { icon: MapPin, label: "Head office", value: "Suite 402, Shahrah-e-Faisal, Karachi" },
];

function Contact() {
  const [submitContact, { isLoading }] = useSubmitContactMessageMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data) {
    if (data.website) {
      console.warn("Contact bot detected via honeypot field");
      // Silently succeed to trick the bot
      toast.success("Message sent", { description: "Our team replies within one business day." });
      reset();
      return;
    }
    try {
      await submitContact(data).unwrap();
      toast.success("Message sent", { description: "Our team replies within one business day." });
      reset();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message. Please try again later.");
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1400px] 2xl:max-w-[2560px] px-4 py-14 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contact us</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Questions about donating, a request, or partnering your blood bank with LifeDrop? We are
          here to help.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <form onSubmit={handleSubmit(onSubmit)} className="surface space-y-5 p-6 lg:col-span-2">
            {/* Honeypot field for bot protection */}
            <div style={{ position: 'absolute', opacity: 0, zIndex: -1, width: 0, height: 0, overflow: 'hidden' }}>
              <input type="text" tabIndex="-1" autoComplete="off" {...register("website")} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message} required>
                <Input placeholder="Your name" {...register("fullName")} />
              </Field>
              <Field label="Email" error={errors.email?.message} required>
                <Input type="email" placeholder="you@example.com" {...register("email")} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Phone" error={errors.phone?.message}>
                <Input placeholder="+92 300 0000000" {...register("phone")} />
              </Field>
              <Field label="Topic" error={errors.topic?.message}>
                <Select
                  options={["Donor support", "Blood request", "Hospital partnership", "Other"]}
                  placeholder="Select a topic"
                  {...register("topic")}
                />
              </Field>
            </div>
            <Field label="Message" error={errors.message?.message} required>
              <Textarea placeholder="How can we help?" {...register("message")} />
            </Field>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? "Sending..." : "Send message"}
            </Button>
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

export default Contact;
