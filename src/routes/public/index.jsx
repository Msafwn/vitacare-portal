import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Droplet,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Users,
  Search,
  Activity
} from "lucide-react";
import SiteLayout from "@/components/layout/SiteLayout";
import Button from "@/components/blood/Button";
import Select from "@/components/blood/Select";
import { useGetCurrentUserQuery } from "@/features/users/userApiSlice";
import { useGetPublicInventoryQuery, useGetPublicStatsQuery } from "@/features/public/publicApiSlice";
import { BLOOD_GROUPS, CITIES } from "@/data/mock";
import { Loader2 } from "lucide-react";

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

function Typewriter({ words, delay = 2000, typingSpeed = 120, deletingSpeed = 60 }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), delay);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, words, delay, typingSpeed, deletingSpeed]);

  useEffect(() => {
    setText(words[index].substring(0, subIndex));
  }, [subIndex, index, words]);

  return (
    <span>
      {text}
      <span className="animate-pulse font-light text-primary">|</span>
    </span>
  );
}

function Home() {
  const { data: response } = useGetCurrentUserQuery();
  const { data: inventoryResponse, isLoading: isLoadingInventory } = useGetPublicInventoryQuery();
  const { data: statsResponse, isLoading: isLoadingStats } = useGetPublicStatsQuery();
  
  const currentUser = response?.data;
  const inventory = inventoryResponse?.data || [];
  const stats = statsResponse?.data || { totalDonors: 0, totalUnitsDonated: 0, requestsFulfilled: 0, avgResponseTime: "..." };

  return (
    <SiteLayout>
      {/* 
        ========================================================================
        HERO SECTION (Premium Glassmorphism + Glowing Orbs)
        ========================================================================
      */}
      <section className="relative overflow-hidden border-b border-border bg-background pb-20 pt-24 sm:py-32">
        {/* Animated Background Orbs */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md animate-fade-in-up">
              <ShieldCheck className="h-4 w-4" /> Trusted by 24+ Partner Blood Banks
            </span>
            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-fade-in-up delay-150">
              Every drop <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent animate-gradient-shift">counts.</span>
              <br />
              Find donors in <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent animate-gradient-shift"><Typewriter words={["minutes.", "seconds.", "real-time."]} /></span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-fade-in-up delay-300">
              LifeDrop is the next-generation blood donation network. Search for donors, raise urgent requests, and track real-time inventory with unparalleled speed and transparency.
            </p>
          </div>

          {/* Glassmorphic Search Panel */}
          <div className="mx-auto mt-12 max-w-4xl animate-fade-in-up delay-500">
            <div className="relative rounded-3xl border border-white/10 bg-card/60 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
                <Select options={BLOOD_GROUPS} placeholder="Blood group" aria-label="Blood group" />
                <Select options={CITIES} placeholder="City" aria-label="City" />
                <Button as="link" to={currentUser ? "/find-donors" : "/login?redirect=/find-donors"} size="lg" className="w-full sm:w-auto sm:px-8">
                  <Search className="mr-2 h-4 w-4" /> Search Donors
                </Button>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button as="link" to={currentUser ? "/become-donor" : "/login?redirect=/become-donor"} variant="secondary" size="lg" className="hover:border-primary/50 hover:bg-card">
                Become a donor
              </Button>
              <Button as="link" to={currentUser ? "/requests/new" : "/login?redirect=/requests/new"} variant="soft" size="lg" className="bg-primary/10 text-primary hover:bg-primary/20">
                Request blood <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        LIVE INVENTORY METRICS
        ========================================================================
      */}
      <section className="relative bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" /> Live Blood Availability
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Real-time stock aggregation across our network.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm">
              <MapPin className="h-4 w-4 text-primary" /> Nationwide Coverage
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            {isLoadingInventory ? (
              <div className="col-span-full flex h-32 items-center justify-center rounded-3xl border border-border bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              inventory.map((i) => (
                <div 
                  key={i.group} 
                  className={`group relative overflow-hidden rounded-3xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    i.status === 'critical' ? 'border-destructive/30 bg-destructive/5 hover:shadow-destructive/10' : 
                    i.status === 'low' ? 'border-warning/30 bg-warning/5 hover:shadow-warning/10' : 'border-border bg-card hover:border-primary/30 hover:shadow-primary/5'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    i.status === 'critical' ? 'bg-gradient-to-b from-destructive/10 to-transparent' : 
                    i.status === 'low' ? 'bg-gradient-to-b from-warning/10 to-transparent' : 'bg-gradient-to-b from-primary/5 to-transparent'
                  }`} />
                  
                  <p className={`relative text-xl font-bold ${
                    i.status === 'critical' ? 'text-destructive' : 
                    i.status === 'low' ? 'text-warning' : 'text-primary'
                  }`}>{i.group}</p>
                  
                  <div className="relative mt-3 flex items-baseline justify-center gap-1">
                    <p className="text-4xl font-extrabold text-foreground tracking-tight">{i.units}</p>
                    <p className="text-sm font-medium text-muted-foreground">units</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        PLATFORM IMPACT (Real-time Stats)
        ========================================================================
      */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">The LifeDrop Impact</h2>
          <p className="mt-3 text-muted-foreground">Empowering communities through seamless connection.</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/50">
            <Users className="mx-auto h-8 w-8 text-primary mb-4" />
            <p className="text-4xl font-bold text-foreground">
              {isLoadingStats ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : stats.totalDonors.toLocaleString()}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Verified Donors</p>
          </div>
          
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/50">
            <Droplet className="mx-auto h-8 w-8 text-primary mb-4" />
            <p className="text-4xl font-bold text-foreground">
              {isLoadingStats ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : stats.totalUnitsDonated.toLocaleString()}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Units Donated</p>
          </div>
          
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/50">
            <HeartHandshake className="mx-auto h-8 w-8 text-primary mb-4" />
            <p className="text-4xl font-bold text-foreground">
              {isLoadingStats ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : stats.requestsFulfilled.toLocaleString()}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Requests Fulfilled</p>
          </div>
          
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/50">
            <Clock className="mx-auto h-8 w-8 text-primary mb-4" />
            <p className="text-4xl font-bold text-foreground">
              {isLoadingStats ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : stats.avgResponseTime}
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Avg. Response Time</p>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        HOW IT WORKS
        ========================================================================
      */}
      <section className="bg-muted/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">How it works</h2>
            <p className="mt-3 text-muted-foreground">Three simple steps to save a life.</p>
          </div>
          
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
                <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-lg font-bold text-white shadow-lg">
                  {i + 1}
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        CALL TO ACTION
        ========================================================================
      */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-card/40 p-10 text-center backdrop-blur-xl sm:p-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to make a difference?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Join the thousands of donors keeping hospitals stocked across the country. Your single donation can save up to 3 lives.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button as="link" to={currentUser ? "/become-donor" : "/login?redirect=/become-donor"} size="lg" className="px-8 shadow-lg shadow-primary/25">
                Join as a Donor
              </Button>
              <Button as="link" to="/about" variant="secondary" size="lg" className="px-8">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Home;
