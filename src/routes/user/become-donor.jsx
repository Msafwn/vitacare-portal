import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle2, ChevronRight, Droplet, User, MapPin } from "lucide-react";
import UserLayout from "@/components/layout/UserLayout";
import PageHeader from "@/components/blood/PageHeader";
import Button from "@/components/blood/Button";
import Card from "@/components/blood/Card";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { registerAsDonor } from "@/store/userSlice";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";

const STEPS = [
  { id: 1, name: "Personal Information", icon: User },
  { id: 2, name: "Blood Information", icon: Droplet },
  { id: 3, name: "Location", icon: MapPin },
  { id: 4, name: "Review", icon: CheckCircle2 },
];

export default function BecomeDonor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    lastDonation: "",
    availability: "Available",
    city: "",
    area: "",
    address: "",
    confirm: false,
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Basic frontend validation before moving next
    if (currentStep === 1) {
      if (!formData.fullName || !formData.phone || !formData.dob || !formData.gender) {
        toast.error("Please fill in all personal information fields.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.bloodGroup || !formData.availability) {
        toast.error("Please select a blood group and availability.");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.city || !formData.area || !formData.address) {
        toast.error("Please fill in all location fields.");
        return;
      }
    }
    setCurrentStep(s => Math.min(s + 1, 4));
  };

  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.confirm) {
      toast.error("Please confirm the information is accurate.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      dispatch(registerAsDonor({
        bloodGroup: formData.bloodGroup,
        availability: formData.availability,
        lastDonationDate: formData.lastDonation,
      }));
      setIsSubmitting(false);
      setSuccess(true);
      toast.success("Donor Registration Submitted");
    }, 1000);
  };

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
        <div className="mb-10">
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
                <span className={`absolute top-12 text-xs font-semibold whitespace-nowrap ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Card className="mt-16 p-6 sm:p-8">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <Input value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="John Doe" />
                </Field>
                <Field label="Phone Number" required>
                  <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="0300 1234567" />
                </Field>
                <Field label="Date of Birth" required>
                  <Input type="date" value={formData.dob} onChange={(e) => handleChange("dob", e.target.value)} />
                </Field>
                <Field label="Gender" required>
                  <Select 
                    value={formData.gender} 
                    onChange={(e) => handleChange("gender", e.target.value)}
                    options={["Male", "Female", "Other"]} 
                    placeholder="Select Gender" 
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
                <Field label="Blood Group" required>
                  <Select 
                    value={formData.bloodGroup} 
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    options={BLOOD_GROUPS} 
                    placeholder="Select Blood Group" 
                  />
                </Field>
                <Field label="Last Donation Date">
                  <Input type="date" value={formData.lastDonation} onChange={(e) => handleChange("lastDonation", e.target.value)} />
                </Field>
                <Field label="Donor Availability" required className="sm:col-span-2">
                  <Select 
                    value={formData.availability} 
                    onChange={(e) => handleChange("availability", e.target.value)}
                    options={["Available", "Currently Unavailable"]} 
                  />
                </Field>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-semibold border-b pb-2">Location</h3>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="City" required>
                  <Select 
                    value={formData.city} 
                    onChange={(e) => handleChange("city", e.target.value)}
                    options={["Karachi", "Lahore", "Islamabad", "Rawalpindi"]} 
                    placeholder="Select City" 
                  />
                </Field>
                <Field label="Area" required>
                  <Input value={formData.area} onChange={(e) => handleChange("area", e.target.value)} placeholder="e.g. DHA Phase 5" />
                </Field>
                <Field label="Full Address" required className="sm:col-span-2">
                  <Input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="House #, Street #..." />
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
                  checked={formData.confirm}
                  onChange={(e) => handleChange("confirm", e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-border accent-primary"
                />
                <span className="text-sm text-foreground">
                  I confirm that the information provided is accurate and I agree to join the donor network.
                </span>
              </label>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || !formData.confirm}>
                {isSubmitting ? "Submitting..." : "Submit Donor Registration"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </UserLayout>
  );
}
