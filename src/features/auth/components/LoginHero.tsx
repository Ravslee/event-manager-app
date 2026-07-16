export function LoginHero() {
  return (
    <div
      className="relative hidden lg:flex items-end justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 mb-16 w-[420px] rounded-2xl border border-white/10 bg-white/10 p-8 text-white backdrop-blur-xl">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold">
          NOW LIVE
        </span>

        <h2 className="mt-6 text-4xl font-bold">Welcome to MyFolio</h2>

        <p className="mt-4 text-white/80">
          Manage events, clients, payments and services from a single platform.
        </p>

        <div className="mt-8 flex justify-between">
          <div>
            <h3 className="text-2xl font-bold">12k+</h3>
            <p className="text-white/70 text-sm">Active Studios</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">98%</h3>
            <p className="text-white/70 text-sm">Client Retention</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold">24/7</h3>
            <p className="text-white/70 text-sm">Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
