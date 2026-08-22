import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field, Textarea } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";
import { useCreateRequestMutation } from "@/features/requests/requestApiSlice";

const requestSchema = z.object({
  patientName: z.string().min(3, "Patient name must be at least 3 characters"),
  patientAge: z.string().optional(),
  bloodGroup: z.string().min(1, "Blood group is required"),
  unitsRequired: z.string().min(1, "Units required must be at least 1"),
  urgency: z.string().min(1, "Urgency is required"),
  hospital: z.string().min(3, "Hospital name is required"),
  city: z.string().min(1, "City is required"),
  requiredBy: z.string().min(1, "Required date is mandatory"),
  contactNumber: z.string().min(10, "Contact number is too short"),
  notes: z.string().optional(),
});

function CreateRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [createRequest, { isLoading }] = useCreateRequestMutation();

  const secureId = searchParams.get("donorId");
  // Extract real UUID by removing the attached parts
  const donorId = secureId ? secureId.replace("VITA-", "").replace("-SECURE", "") : null;
  const donorName = searchParams.get("donorName");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      unitsRequired: "1",
    }
  });

  async function onSubmit(data) {
    try {
      // Need to cast unitsRequired to integer as API expects integer
      const payload = {
        ...data,
        donorId: donorId || null,
        unitsRequired: parseInt(data.unitsRequired, 10),
        patientAge: data.patientAge ? parseInt(data.patientAge, 10) : null
      };

      await createRequest(payload).unwrap();

      toast.success("Request submitted", {
        description: "Your blood request has been successfully created.",
      });
      navigate("/requests");
    } catch (error) {
      toast.error("Failed to submit request", {
        description: error?.data?.message || "Something went wrong.",
      });
    }
  }

  return (
    <UserLayout>
      <PageHeader
        title="Create blood request"
        description="Provide accurate details so we can match the right donors quickly."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2">
          {donorId && (
            <div className="mb-5 rounded-xl bg-primary-soft/50 p-4 border border-primary/20">
              <p className="text-sm font-semibold text-primary">
                🎯 Direct Request Mode
              </p>
              <p className="mt-1 text-sm text-foreground">
                This request will be sent directly to <strong>{donorName}</strong>. Other donors will not be notified.
              </p>
            </div>
          )}
          <Card className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Patient name" error={errors.patientName?.message} required>
                <Input placeholder="Full name" {...register("patientName")} />
              </Field>
              <Field label="Patient age" error={errors.patientAge?.message}>
                <Input type="number" min="0" placeholder="e.g. 34" {...register("patientAge")} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label="Blood group" error={errors.bloodGroup?.message} required>
                <Select options={BLOOD_GROUPS} placeholder="Select" {...register("bloodGroup")} />
              </Field>
              <Field label="Units required" error={errors.unitsRequired?.message} required>
                <Input type="number" min="1" {...register("unitsRequired")} />
              </Field>
              <Field label="Urgency" error={errors.urgency?.message} required>
                <Select options={["normal", "urgent", "critical"]} placeholder="Select" {...register("urgency")} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Hospital" error={errors.hospital?.message} required>
                <Input placeholder="Hospital name" {...register("hospital")} />
              </Field>
              <Field label="City" error={errors.city?.message} required>
                <Select options={CITIES} placeholder="Select" {...register("city")} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Required by" error={errors.requiredBy?.message} required>
                <Input type="date" {...register("requiredBy")} />
              </Field>
              <Field label="Contact number" error={errors.contactNumber?.message} required>
                <Input placeholder="+92 300 0000000" {...register("contactNumber")} />
              </Field>
            </div>
            <Field label="Additional notes" error={errors.notes?.message} hint="Ward number, attendant name or medical context.">
              <Textarea placeholder="Anything donors should know…" {...register("notes")} />
            </Field>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit request"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/requests")}>
                Cancel
              </Button>
            </div>
          </Card>
        </form>

        <Card className="h-fit">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Before you submit</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                <li>Confirm the blood group from the hospital report.</li>
                <li>Critical requests are reviewed by our team within 15 minutes.</li>
                <li>Keep your contact number reachable — donors call directly.</li>
                <li>Cancel the request as soon as it is fulfilled.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>
  );
}

export default CreateRequest;
