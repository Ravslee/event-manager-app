export function RegisterHero() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-900 p-14 text-white">
      <h2 className="text-xl font-bold text-primary">MyFolio</h2>

      <div>
        <h1 className="text-5xl font-bold leading-tight">
          Master your events with precision.
        </h1>

        <p className="mt-6 max-w-md text-slate-300">
          Join thousands of managers who trust MyFolio for seamless event
          management, payments and client relationships.
        </p>
      </div>

      <div>
        <div className="flex -space-x-2">
          <img
            src="https://i.pravatar.cc/40?img=1"
            className="h-10 w-10 rounded-full border-2 border-white"
          />

          <img
            src="https://i.pravatar.cc/40?img=2"
            className="h-10 w-10 rounded-full border-2 border-white"
          />

          <img
            src="https://i.pravatar.cc/40?img=3"
            className="h-10 w-10 rounded-full border-2 border-white"
          />
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Trusted by 500+ event businesses.
        </p>
      </div>
    </div>
  );
}
