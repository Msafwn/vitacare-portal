import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle2, ChevronRight, Droplet, User, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { useBecomeDonorMutation, useGetCurrentUserQuery } from "@/features/users/userApiSlice";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";

const STEPS = [
  { id: 1, name: "Personal Information", icon: User },
  { id: 2, name: "Blood Information", icon: Droplet },
  { id: 3, name: "Location", icon: MapPin },
  { id: 4, name: "Review", icon: CheckCircle2 },
];

const donorSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().min(10, "Phone number is too short"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  lastDonation: z.string().optional(),
  availability: z.string().min(1, "Availability is required"),
  city: z.string().min(1, "City is required"),
  area: z.string().min(1, "Area is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  confirm: z.literal(true, {
    errorMap: () => ({ message: "You must confirm to proceed" }),
  }),
});

export default function BecomeDonor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [cities, setCities] = useState([]);
  const [becomeDonor] = useBecomeDonorMutation();
  
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: "Pakistan" }),
        });
        const data = await response.json();
        if (!data.error) {
          setCities(data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
    fetchCities();
  }, []);
  
  const { data: response } = useGetCurrentUserQuery();
  const currentUser = response?.data || {};

  // Restore step from localStorage when currentUser.id is loaded
  useEffect(() => {
    if (currentUser.id) {
      const savedStep = localStorage.getItem(`vitacare_donor_step_${currentUser.id}`);
      if (savedStep) {
        setCurrentStep(Math.min(Math.max(parseInt(savedStep, 10), 1), 4));
      }
    }
  }, [currentUser.id]);

  // Save step to localStorage when it changes
  useEffect(() => {
    if (currentUser.id) {
      localStorage.setItem(`vitacare_donor_step_${currentUser.id}`, currentStep);
    }
  }, [currentStep, currentUser.id]);

  const {
    register,
    trigger,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      city: "",
      address: "",
      availability: "Available",
      dob: "",
      gender: "",
      bloodGroup: "",
      area: "",
    }
  });

  // Load and reset form progress once when currentUser.id loads
  useEffect(() => {
    if (currentUser.id) {
      const savedData = localStorage.getItem(`vitacare_donor_form_data_${currentUser.id}`);
      const parsed = savedData ? JSON.parse(savedData) : {};
      
      reset({
        fullName: parsed.fullName || currentUser.name || "",
        phone: parsed.phone || currentUser.phone || "",
        city: parsed.city || currentUser.city || "",
        address: parsed.address || currentUser.address || "",
        availability: parsed.availability || currentUser.availability || "Available",
        dob: parsed.dob || currentUser.dob || "",
        gender: parsed.gender || currentUser.gender || "",
        bloodGroup: parsed.bloodGroup || currentUser.bloodGroup || "",
        area: parsed.area || currentUser.area || "",
      });
    }
  }, [currentUser.id, reset]);

  const formData = watch(); // Get all values for the review screen

  // Save form data to localStorage on change
  useEffect(() => {
    if (currentUser.id && formData && Object.keys(formData).length > 0) {
      localStorage.setItem(`vitacare_donor_form_data_${currentUser.id}`, JSON.stringify(formData));
    }
  }, [formData, currentUser.id]);

  const nextStep = useCallback(async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ["fullName", "phone", "dob", "gender"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["bloodGroup", "availability", "lastDonation"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["city", "area", "address"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(s => Math.min(s + 1, 4));
    }
  }, [currentStep, trigger]);

  const prevStep = useCallback(() => setCurrentStep(s => Math.max(s - 1, 1)), []);

  const onSubmit = useCallback(async (data) => {
    try {
      const { fullName, confirm, ...donorData } = data;
      // Map fullName to name, and lastDonation to lastDonationDate if needed,
      // but our backend expects lastDonation in req.body
      
      await becomeDonor(donorData).unwrap();

      // Clear localStorage progress on success
      if (currentUser.id) {
        localStorage.removeItem(`vitacare_donor_step_${currentUser.id}`);
        localStorage.removeItem(`vitacare_donor_form_data_${currentUser.id}`);
      }
      
      setSuccess(true);
      toast.success("Donor Registration Submitted");
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit registration");
    }
  }, [becomeDonor, currentUser.id]);

  if (success) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Donor Registration Submitted</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for registering as a blood donor. Your willingness to help can save up to 3 lives per donation!
          </p>
          <Button onClick={() => navigate("/dashboard")} className="w-full h-12">
            Go to Dashboard
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <PageHeader
        title="Become a Donor"
        description="Join our network of life-savers by registering as a blood donor."
      />

      <div className="max-w-3xl mx-auto mt-8">
        {/* Stepper */}
        <div className="mb-10 px-4 sm:px-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            
            {STEPS.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors bg-background ${currentStep >= step.id ? 'border-primary text-primary' : 'border-muted text-muted-foreground'}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`absolute top-12 text-xs font-semibold whitespace-nowrap hidden sm:block ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="mt-16 p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Full Name" error={errors.fullName?.message} required>
                    <Input placeholder="John Doe" {...register("fullName")} />
                  </Field>
                  <Field label="Phone Number" error={errors.phone?.message} required>
                    <Input placeholder="0300 1234567" {...register("phone")} />
                  </Field>
                  <Field label="Date of Birth" error={errors.dob?.message} required>
                    <Input type="date" {...register("dob")} />
                  </Field>
                  <Field label="Gender" error={errors.gender?.message} required>
                    <Select 
                      options={["Male", "Female", "Other"]} 
                      placeholder="Select Gender" 
                      {...register("gender")}
                    />
                  </Field>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold border-b pb-2">Blood Information</h3>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-foreground">
                    <strong>Eligibility Note:</strong> Generally, you must be in good health, at least 18 years old, and weigh at least 50kg to donate blood. This is general information and not medical advice.
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Blood Group" error={errors.bloodGroup?.message} required>
                    <Select 
                      options={BLOOD_GROUPS} 
                      placeholder="Select Blood Group" 
                      {...register("bloodGroup")}
                    />
                  </Field>
                  <Field label="Last Donation Date">
                    <Input type="date" {...register("lastDonation")} />
                  </Field>
                  <Field label="Donor Availability" error={errors.availability?.message} required className="sm:col-span-2">
                    <Select 
                      options={["Available", "Currently Unavailable"]} 
                      {...register("availability")}
                    />
                  </Field>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold border-b pb-2">Location</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="City" error={errors.city?.message} required>
                    <Select 
                      options={cities.length > 0 ? cities : CITIES} 
                      placeholder="Select City" 
                      disabled={!!currentUser.city}
                      {...register("city")}
                    />
                    {currentUser.city && (
                      <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                        ℹ️ Note: City can only be updated from your Profile settings.
                      </p>
                    )}
                  </Field>
                  <Field label="Area" error={errors.area?.message} required>
                    <Input placeholder="e.g. DHA Phase 5" {...register("area")} />
                  </Field>
                  <Field label="Full Address" error={errors.address?.message} required className="sm:col-span-2">
                    <Input placeholder="House #, Street #..." {...register("address")} />
                  </Field>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-lg font-semibold border-b pb-2">Review & Confirmation</h3>
                
                <div className="grid gap-8 sm:grid-cols-2 bg-muted/30 p-4 rounded-xl border">
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-3">Personal Info</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between"><dt className="text-muted-foreground">Name:</dt><dd className="font-medium text-right">{formData.fullName}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Phone:</dt><dd className="font-medium text-right">{formData.phone}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Gender:</dt><dd className="font-medium text-right">{formData.gender}</dd></div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-3">Blood Info</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between"><dt className="text-muted-foreground">Group:</dt><dd className="font-medium text-right">{formData.bloodGroup}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Availability:</dt><dd className="font-medium text-right">{formData.availability}</dd></div>
                    </dl>
                  </div>
                  <div className="sm:col-span-2">
                    <h4 className="font-semibold text-sm text-primary mb-3">Location</h4>
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between"><dt className="text-muted-foreground">City:</dt><dd className="font-medium text-right">{formData.city}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted-foreground">Address:</dt><dd className="font-medium text-right truncate pl-4">{formData.address}, {formData.area}</dd></div>
                    </dl>
                  </div>
                </div>

                <label className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors mt-6">
                  <input
                    type="checkbox"
                    {...register("confirm")}
                    className="mt-1 h-5 w-5 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">
                    I confirm that the information provided is accurate and I agree to join the donor network.
                    {errors.confirm && (
                      <span className="block text-destructive text-xs mt-1">{errors.confirm.message}</span>
                    )}
                  </span>
                </label>
              </div>
            )}

            <div className="flex items-center justify-between mt-10 pt-6 border-t">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Back
              </Button>
              
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Continue <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Donor Registration"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </UserLayout>
  );
}
