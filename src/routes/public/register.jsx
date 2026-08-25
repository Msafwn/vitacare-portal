import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Heart, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Logo from "@/components/blood/Logo";
import Button from "@/components/blood/Button";
import Input, { Field } from "@/components/blood/Input";
import Select from "@/components/blood/Select";
import { toast } from "@/components/blood/Toast";
import { CITIES } from "@/data/mock";
import { cn } from "../../lib/utils";
import { useRegisterMutation } from "@/features/users/userApiSlice";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  city: z.string().min(1, "Please select a city"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
  website: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function Register() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data) {
    if (data.website) {
      console.warn("Registration bot detected via honeypot field");
      // Silently succeed to trick the bot
      toast.success("Account created successfully!");
      navigate("/dashboard");
      return;
    }
    try {
      // Remove confirmPassword and terms before sending to API
      const { confirmPassword, terms, ...userData } = data;
      await registerUser(userData).unwrap();
      toast.success("Account created successfully!");
      navigate(`/dashboard?email=${data.email}`);
    } catch (err) {
      toast.error(err.data?.message || "Failed to create account. Please try again.");
    }
  }

  return (
    <div className={cn('flex', 'h-screen', 'overflow-hidden', 'bg-background')}>
      {/* Left Pane */}
      <div className={cn('hidden', 'lg:flex', 'w-1/2', 'flex-col', 'bg-primary', 'p-12', 'text-primary-foreground', 'relative', 'overflow-hidden')}>
        {/* Background decorative circles */}
        <div className={cn('absolute', '-top-[20%]', '-left-[10%]', 'h-[800px]', 'w-[800px]', 'rounded-full', 'bg-black/5', 'pointer-events-none')} />
        <div className={cn('absolute', '-bottom-[20%]', '-right-[10%]', 'h-[800px]', 'w-[800px]', 'rounded-full', 'bg-black/5', 'pointer-events-none')} />

        <div className={cn('relative', 'z-10', 'flex', 'flex-col', 'h-full', 'w-full', 'max-w-md', 'mx-auto')}>
          <div className={cn('self-start', '[&_.bg-primary]:!bg-white/20', '[&_.text-foreground]:!text-white', '[&_.text-primary]:!text-white')}>
            <Logo />
          </div>

          <div className={cn('my-auto', 'pt-8')}>
            <h1 className={cn('text-2xl', 'font-bold', 'leading-tight', 'tracking-tight')}>Join LifeDrop<br />today.</h1>
            <p className={cn('mt-2', 'text-[10px]', 'text-primary-foreground/90', 'leading-relaxed')}>
              Create an account to join our growing network of heroes. Every donation can save up to three lives.
            </p>

            <div className={cn('mt-8', 'space-y-4')}>
              <div className={cn('flex', 'items-center', 'gap-4')}>
                <div className={cn('flex', 'h-9', 'w-10', 'shrink-0', 'items-center', 'justify-center', 'rounded-full', 'bg-white/10')}>
                  <Users className={cn('h-5', 'w-5')} />
                </div>
                <span className={cn('text-sm', 'font-medium')}>10,000+ registered members</span>
              </div>
              <div className={cn('flex', 'items-center', 'gap-4')}>
                <div className={cn('flex', 'h-9', 'w-10', 'shrink-0', 'items-center', 'justify-center', 'rounded-full', 'bg-white/10')}>
                  <Heart className={cn('h-5', 'w-5')} />
                </div>
                <span className={cn('text-sm', 'font-medium')}>5,000+ donations successfully coordinated</span>
              </div>
              <div className={cn('flex', 'items-center', 'gap-4')}>
                <div className={cn('flex', 'h-9', 'w-10', 'shrink-0', 'items-center', 'justify-center', 'rounded-full', 'bg-white/10')}>
                  <ShieldCheck className={cn('h-5', 'w-5')} />
                </div>
                <span className={cn('text-sm', 'font-medium')}>Contact details shared only when it matters</span>
              </div>
            </div>
          </div>

          <div className={cn('mt-auto', 'text-xs', 'font-medium', 'text-primary-foreground/70')}>
            Copyright &copy; 2026 LifeDrop. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Pane */}
      <div className={cn('flex', 'w-full', 'lg:w-1/2', 'h-full', 'overflow-y-auto', 'items-center', 'justify-center', 'p-4', 'py-12')}>
        <div className={cn('w-full', 'max-w-lg')}>
          <div className={cn('text-center', 'mb-8')}>
            <h2 className={cn('text-xl', 'font-bold', 'text-foreground')}>Create Account</h2>
            <p className={cn('mt-3', 'text-sm', 'text-muted-foreground')}>
              Sign up to continue to LifeDrop.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Honeypot field for bot protection */}
            <div style={{ position: 'absolute', opacity: 0, zIndex: -1, width: 0, height: 0, overflow: 'hidden' }}>
              <input type="text" tabIndex="-1" autoComplete="off" {...register("website")} />
            </div>
            <div className={cn('grid', 'gap-5', 'sm:grid-cols-2')}>
              <Field label="Full name" error={errors.name?.message} required>
                <Input placeholder="Your name" {...register("name")} />
              </Field>
              <Field label="Email" error={errors.email?.message} required>
                <Input type="email" placeholder="you@example.com" {...register("email")} />
              </Field>
            </div>
            <div className={cn('grid', 'gap-5', 'sm:grid-cols-2')}>
              <Field label="Phone" error={errors.phone?.message} required>
                <Input placeholder="+92 300 0000000" {...register("phone")} />
              </Field>
              <Field label="City" error={errors.city?.message} required>
                <Select options={cities.length > 0 ? cities : CITIES} placeholder="Select" {...register("city")} />
              </Field>
            </div>
            <div className={cn('grid', 'gap-5', 'sm:grid-cols-2')}>
              <Field label="Password" error={errors.password?.message} required>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" {...register("password")} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </Field>
              <Field label="Confirm password" error={errors.confirmPassword?.message} required>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className="pr-10" {...register("confirmPassword")} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </Field>
            </div>
            <label className={cn('flex', 'items-start', 'gap-2', 'text-sm', 'font-medium', 'text-muted-foreground', 'mt-2')}>
              <input
                type="checkbox"
                {...register("terms")}
                className={cn('mt-0.5', 'h-4', 'w-4', 'rounded', 'border-border', 'accent-primary')}
              />
              <span className="text-[10px]">
                I confirm the information is accurate and agree to the Terms & Conditions.
                {errors.terms && (
                  <span className={cn('block', 'text-destructive', 'text-xs', 'mt-1')}>{errors.terms.message}</span>
                )}
              </span>
            </label>
            <Button type="submit" disabled={isLoading} className={cn('w-full', 'h-12', 'text-base', 'font-semibold', 'mt-2')}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className={cn('mt-5', 'text-center', 'text-sm', 'font-medium', 'text-muted-foreground')}>
            Already have an account?{" "}
            <Link to="/login" className={cn('font-semibold', 'text-primary', 'hover:underline')}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
