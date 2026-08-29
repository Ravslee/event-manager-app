import { Calendar, Sparkles } from "lucide-react";

export function LoginHero() {
  return (
    <div className="col-span-12 lg:col-span-6 p-6 sm:p-12 lg:p-16 flex flex-col justify-between text-white relative z-10 bg-slate-900 dark:bg-slate-950 lg:border-r border-border/40">
      {/* Brand Logo Header */}
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md">
          <Calendar className="h-6 w-6" />
        </div>
        <span className="text-2xl font-black tracking-tight text-white">NIVO</span>
      </div>

      {/* Main Hero Message */}
      <div className="my-auto space-y-5 max-w-lg py-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          Elevate Your Events.
        </h1>
        
        <h2 className="text-lg sm:text-xl font-bold text-white/90">
          All-in-one platform for bookings, billing & production management.
        </h2>

        <p className="text-sm text-white/80 leading-relaxed font-normal">
          We provide all the tools to streamline your event schedules, client invoicing, and vendor service catalogs with maximum efficiency.
        </p>
      </div>

      {/* Hero Footer */}
      <div className="flex items-center gap-2 text-xs text-white/70 font-medium">
        <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
        <span>Trusted by over 12,000+ event studios & venue managers worldwide.</span>
      </div>
    </div>
  );
}
