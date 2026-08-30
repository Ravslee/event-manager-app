import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  LayoutDashboard,
  Zap,
  ChevronDown,
  Star,
  Camera,
  Music,
  Palette,
  Mic,
  SlidersHorizontal,
  IndianRupee,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { NivoLogo } from "@/components/common/NivoLogo";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  // Theme Toggle State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const faqs = [
    {
      q: "Who is NIVO built for?",
      a: "NIVO is built specifically for creative freelancers and solo professionals — including Photographers, Videographers, DJs, Anchor/MCs, Makeup Artists (MUA), Decorators, Mehendi Artists, and Sound Engineers."
    },
    {
      q: "Does NIVO support Rupees (₹) and advance token payments?",
      a: "Yes! All prices, invoices, and analytics in NIVO default to Rupees (₹). You can easily track advance token deposits (e.g. 30% or 50% advance), pending balances due on event day, and completed payments."
    },
    {
      q: "How does NIVO help during peak wedding seasons?",
      a: "During busy wedding dates, NIVO's visual calendar prevents accidental double-bookings. You can see confirmed, pending, and blocked dates at a glance so you never miss a client date."
    },
    {
      q: "Can I create customized rate cards for different services?",
      a: "Absolutely! Create service offerings with per-day rates, per-hour pricing, or bundled packages (e.g., Traditional Photography + Cinematic Teaser Reel + Drone Shoot)."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <NivoLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#freelancers" className="hover:text-foreground transition-colors">For Freelancers</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#reviews" className="hover:text-foreground transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5" />}
            </Button>

            {isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="rounded-full font-bold px-5 gap-2 cursor-pointer shadow-md text-xs sm:text-sm">
                <LayoutDashboard className="h-4 w-4" /> Open NIVO Workspace
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/register")}
                className="rounded-full font-bold px-6 text-xs sm:text-sm gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile Right Bar: Theme Toggle + Get Started + Hamburger Toggle */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-8 w-8 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </Button>

            {!isAuthenticated && (
              <Button 
                size="sm"
                onClick={() => navigate("/register")}
                className="rounded-full font-bold text-xs px-3 h-8 gap-1 shadow-xs cursor-pointer"
              >
                Get Started
              </Button>
            )}
            
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-xl border border-border/80 text-foreground bg-card hover:bg-accent cursor-pointer transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-border/80 bg-background/95 backdrop-blur-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-3 font-semibold text-sm text-foreground">
              <a 
                href="#freelancers" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                For Freelancers
              </a>
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                Features
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                Reviews
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                FAQ
              </a>
            </nav>

            <div className="pt-2 border-t border-border/60 flex flex-col gap-2">
              {isAuthenticated ? (
                <Button 
                  onClick={() => { setMobileMenuOpen(false); navigate("/dashboard"); }} 
                  className="w-full rounded-full font-bold h-11 gap-2 cursor-pointer shadow-md"
                >
                  <LayoutDashboard className="h-4 w-4" /> Open NIVO Workspace
                </Button>
              ) : (
                <Button 
                  onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}
                  className="w-full rounded-full font-bold h-11 text-sm gap-2 shadow-md cursor-pointer"
                >
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 relative z-10">
          
          <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-primary" />
              <span>Built for Creative Freelancers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.15] sm:leading-[1.1]">
              The #1 Booking & Billing App for <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent">
                Event Freelancers.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium px-2">
              Manage Shaadi, Sangeet & Corporate gig dates, send quotes in Rupees (₹), track advance token deposits, and never double-book peak Muhurat dates again.
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center pt-2 max-w-sm sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                onClick={() => navigate("/register")}
                className="rounded-full font-bold text-sm sm:text-base px-8 h-12 sm:h-13 shadow-lg hover:shadow-xl transition-all gap-2 cursor-pointer w-full sm:w-auto"
              >
                Get Started Free <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-[11px] sm:text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                <span>₹ INR Currency Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
                <span>Advance Deposit Tracking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
                <span>Muhurat Date Protection</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Dashboard Mockup */}
          <div className="mt-12 lg:mt-20 max-w-5xl mx-auto rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-2 sm:p-3 shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-muted/40 p-4 sm:p-8 space-y-4 sm:space-y-6">
              
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 sm:pb-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500" />
                  <span className="text-[11px] sm:text-xs font-extrabold text-muted-foreground ml-1.5 sm:ml-3">NIVO Freelancer Hub (₹ INR)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Shaadi Season Active</span>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-xl bg-background border border-border/60 shadow-2xs space-y-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground">Season Revenue (₹)</p>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground">₹ 4,85,000</h3>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400">↑ 34% vs last season</span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-background border border-border/60 shadow-2xs space-y-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground">Upcoming Gigs</p>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground">14 Confirmed Dates</h3>
                  <span className="text-[10px] sm:text-[11px] font-bold text-blue-600 dark:text-blue-400">4 Sangeet & Wedding events</span>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-background border border-border/60 shadow-2xs space-y-1">
                  <p className="text-[11px] sm:text-xs font-semibold text-muted-foreground">Advance Tokens Collected</p>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground">₹ 1,50,000</h3>
                  <span className="text-[10px] sm:text-[11px] font-bold text-purple-600 dark:text-purple-400">Pending balance: ₹ 3,35,000</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. TAILORED FOR CREATIVE FREELANCERS */}
      <section id="freelancers" className="py-16 lg:py-28 bg-muted/30 border-y border-border/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 space-y-12 sm:space-y-16">
          
          <div className="text-center space-y-2.5 max-w-2xl mx-auto px-2">
            <h2 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Built for every creative professional.
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground font-medium">
              Whether you are a solo artist or run a small crew, NIVO keeps your gig pipeline organized.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            
            {/* Freelancer Category 1 */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card text-center space-y-2 sm:space-y-3 shadow-xs hover:scale-102 transition-transform">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Camera className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-xs sm:text-base font-bold text-foreground">Photographers & Cinematographers</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Candid, Drone & Pre-wedding shoot rate cards.</p>
            </div>

            {/* Freelancer Category 2 */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card text-center space-y-2 sm:space-y-3 shadow-xs hover:scale-102 transition-transform">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Music className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-xs sm:text-base font-bold text-foreground">Event DJs & Sound Techs</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Sangeet sound setups & club gig dates.</p>
            </div>

            {/* Freelancer Category 3 */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card text-center space-y-2 sm:space-y-3 shadow-xs hover:scale-102 transition-transform">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Palette className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-xs sm:text-base font-bold text-foreground">Bridal Makeup Artists (MUA)</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Bridal HD makeup, Mehendi & Party packages.</p>
            </div>

            {/* Freelancer Category 4 */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/80 bg-card text-center space-y-2 sm:space-y-3 shadow-xs hover:scale-102 transition-transform">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-xs sm:text-base font-bold text-foreground">Anchors & Event Hosts</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Corporate show hosting & Sangeet anchors.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES */}
      <section id="features" className="py-16 lg:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 space-y-12 sm:space-y-16">
          
          <div className="text-center space-y-2.5 max-w-2xl mx-auto px-2">
            <h2 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Everything you need to run your freelance business.
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground font-medium">
              Designed to replace messy notebook entries and chaotic chat histories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-xs space-y-3 sm:space-y-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Visual Booking Calendar</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Color-coded event dates (Weddings, Sangeet, Corporate) with venue addresses and client contact details.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-xs space-y-3 sm:space-y-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Rupee Invoicing & Tokens</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Send professional estimates, record advance deposits (30%/50%), and track final balances before gig day.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-xs space-y-3 sm:space-y-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <SlidersHorizontal className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground">Service & Rate Card Manager</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Set per-day, per-hour, or fixed project fees for your services. Easily attach services to client bookings.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. REVIEWS & TESTIMONIALS */}
      <section id="reviews" className="py-16 lg:py-28 bg-muted/20 border-y border-border/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 space-y-12 sm:space-y-16">
          
          <div className="text-center space-y-2.5 max-w-2xl mx-auto px-2">
            <h2 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Loved by creative freelancers.
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground font-medium">
              Here is how NIVO simplifies gig management for independent creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card space-y-3 sm:space-y-4 shadow-xs">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                "During peak Shaadi season, I used to double-book dates accidentally. NIVO's calendar solved everything. Plus tracking advance token deposits in Rupees is so seamless!"
              </p>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">Rohan Sharma</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Wedding Photographer, New Delhi</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card space-y-3 sm:space-y-4 shadow-xs">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                "As an Anchor & Emcee doing 20+ corporate events a month, keeping track of payments due was painful. NIVO shows my total pending revenue instantly."
              </p>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">Priya Verma</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Event Host & Anchor, Mumbai</p>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-border/80 bg-card space-y-3 sm:space-y-4 shadow-xs">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                "I manage sound setups for live concerts and Sangeet nights. Adding custom equipment services to client invoices takes less than 30 seconds."
              </p>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">Vikramaditya Roy</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Sound Engineer, Bengaluru</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="py-16 sm:py-24 bg-muted/20 border-t border-border/60">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 space-y-10 sm:space-y-12">
          
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              <IndianRupee className="h-3.5 w-3.5" />
              <span>Simple, Honest Pricing in Rupees (₹)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
              Affordable Plans for Every Freelancer.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Zero hidden commissions or per-booking cuts. Choose monthly flexibility or save over 60% with an annual pass.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="flex items-center justify-center pt-2 sm:pt-4">
              <div className="inline-flex items-center p-1 rounded-full bg-muted border border-border/80 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    billingCycle === "yearly"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Yearly Pass</span>
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Save 60%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch">
            
            {/* Monthly Plan Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground px-3 py-1 rounded-full bg-muted">
                    Monthly Starter
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-foreground">₹149</span>
                    <span className="text-sm font-semibold text-muted-foreground">/ month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Billed monthly. Flexible & cancel anytime.</p>
                </div>

                <div className="border-t border-border/60 pt-4 space-y-3">
                  <p className="text-xs font-extrabold uppercase text-foreground tracking-wider">What's Included:</p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Unlimited Event Bookings & Calendar</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>WhatsApp Booking Drafts & Reminders</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Advance Token & Pending Balance Tracker</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Custom Services Rate Cards</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Mobile & Desktop Sync</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => navigate("/register")}
                className="w-full rounded-2xl h-12 font-bold text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-all mt-4"
              >
                Get Started (₹149/mo)
              </Button>
            </div>

            {/* Yearly Plan Card (Featured) */}
            <div className="relative rounded-3xl border-2 border-primary bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl transition-all">
              {/* Popular Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 fill-primary-foreground" />
                <span>MOST POPULAR • BEST VALUE</span>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    Pro Annual Pass
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    Save ₹1,089 / yr
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-black text-foreground">₹699</span>
                    <span className="text-sm font-semibold text-muted-foreground">/ year</span>
                    <span className="text-xs text-muted-foreground font-bold border-l border-border pl-2">
                      (~₹58/mo)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Billed annually as ₹699. Full 365-day access.</p>
                </div>

                <div className="border-t border-border/60 pt-4 space-y-3">
                  <p className="text-xs font-extrabold uppercase text-foreground tracking-wider">Everything in Monthly, plus:</p>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-foreground font-medium">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="font-bold">Peak Shaadi Muhurat Calendar Sync</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="font-bold">Custom Studio & Business Name Branding</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Priority WhatsApp Support</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Financial Revenue & Tax Analytics</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Early Access to New Features</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => navigate("/register")}
                className="w-full rounded-2xl h-12 font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/95 shadow-md hover:shadow-lg cursor-pointer transition-all gap-2 mt-4"
              >
                Claim Yearly Pass (₹699/yr) <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-16 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-8 space-y-10 sm:space-y-12">
          
          <div className="text-center space-y-2.5 px-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Everything you need to know about NIVO.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="rounded-xl sm:rounded-2xl border border-border/80 bg-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-6 text-left font-bold text-xs sm:text-base text-foreground flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3 sm:pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="py-12 sm:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-5xl px-4 sm:px-8 text-center space-y-4 sm:space-y-6">
          <h2 className="text-2xl sm:text-5xl font-black tracking-tight leading-snug">
            Ready to organize your freelance bookings with NIVO?
          </h2>
          <p className="text-xs sm:text-lg opacity-90 max-w-xl mx-auto font-medium">
            Join photographers, DJs, MUAs, and event creators using NIVO today.
          </p>
          <div className="pt-2">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/register")}
              className="rounded-full font-bold text-xs sm:text-base px-6 sm:px-8 h-12 sm:h-13 shadow-lg hover:shadow-xl transition-all gap-2 cursor-pointer"
            >
              Get Started Free <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="border-t border-border/60 py-8 sm:py-12 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground font-medium text-center md:text-left">
          <div className="flex items-center gap-3">
            <NivoLogo size="sm" showSubtitle />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <a href="#freelancers" className="hover:text-foreground transition-colors">For Freelancers</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <Link to="/register" className="hover:text-foreground transition-colors font-bold text-primary">Get Started</Link>
          </div>

          <div className="space-y-1">
            <p>© 2026 NIVO. All rights reserved.</p>
            <p className="text-[11px] text-muted-foreground/80">
              Developed & Designed by{" "}
              <a
                href="https://lightapps.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary hover:underline"
              >
                LightApps.co
              </a>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
