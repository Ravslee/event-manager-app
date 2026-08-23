import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Share2,
  Save,
  User,
  History,
  Image as ImageIcon,
  Check,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { serviceSchema } from "../schemas/service.schema";
import { getService, createService, updateService } from "../api/service.api";

const categoryOptions = [
  "Hospitality & Dining",
  "AV & Production",
  "Security & Operations",
  "Media & Production",
  "Design & Styling",
  "Logistics & Transport",
  "General",
];

const imagePresets = [
  { value: "/services/catering.png", label: "Catering Mockup" },
  { value: "/services/av_equipment.png", label: "AV Equipment Mockup" },
  { value: "/services/security.png", label: "Event Security Mockup" },
  { value: "/services/photography.png", label: "Photography Mockup" },
  { value: "/services/decor.png", label: "Venue Decor Mockup" },
  { value: "/services/transport.png", label: "Transportation Mockup" },
];

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [showPresets, setShowPresets] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "General",
      pricingModel: "hourly",
      color: "#6366F1",
      image: "",
      isActive: true,
      minCapacity: 0,
    },
  });

  const watchName = watch("name") || (isNew ? "New Service" : "Service Details");
  const watchIsActive = watch("isActive");
  const watchImage = watch("image");
  const watchColor = watch("color");
  const watchPricingModel = watch("pricingModel");

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      getService(id)
        .then((service) => {
          if (service) {
            reset({
              name: service.name || "",
              description: service.description || "",
              price: service.price || 0,
              category: service.category || "General",
              pricingModel: service.pricingModel || "hourly",
              color: service.color || "#6366F1",
              image: service.image || "",
              isActive: service.isActive || true,
              minCapacity: service.minCapacity || 0,
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load service", err);
          setLoading(false);
        });
    }
  }, [id, isNew, reset]);

  const onSubmit = (data: any) => {
    // Fill preset image default if empty
    let finalImage = data.image;
    if (!finalImage) {
      const cat = data.category.toLowerCase();
      if (cat.includes("catering") || cat.includes("hospitality")) finalImage = "/services/catering.png";
      else if (cat.includes("av") || cat.includes("production")) finalImage = "/services/av_equipment.png";
      else if (cat.includes("security") || cat.includes("operation")) finalImage = "/services/security.png";
      else if (cat.includes("photo") || cat.includes("media")) finalImage = "/services/photography.png";
      else if (cat.includes("decor") || cat.includes("style")) finalImage = "/services/decor.png";
      else if (cat.includes("transport") || cat.includes("logistics")) finalImage = "/services/transport.png";
      else finalImage = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800";
    }

    const payload = { ...data, image: finalImage };

    const action = isNew ? createService(payload) : updateService(id!, payload);

    action
      .then(() => {
        navigate("/services");
      })
      .catch((err) => {
        console.error("Failed to save service", err);
      });
  };

  const colorSwatches = [
    { value: "#6366F1", label: "Indigo" },
    { value: "#10B981", label: "Emerald" },
    { value: "#3B82F6", label: "Blue" },
    { value: "#F97316", label: "Orange" },
    { value: "#EF4444", label: "Red" },
    { value: "#EC4899", label: "Pink" },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading service details...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
      {/* Top Header Navigation */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Services
              </button>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{watchName}</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {watchName}
              </h1>
              {/* <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                PREMIUM SERVICE
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                🌐 Public Catalog
              </span> */}
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Button type="button" variant="outline" className="gap-1.5 h-10 rounded-xl">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5 h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm rounded-xl">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Main Panels Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Basic Information Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-bold text-lg text-foreground">Basic Information</h2>
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: watchColor }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input id="name" placeholder="e.g. Full Catering" className="h-10" {...register("name")} />
                  {errors.name?.message && (
                    <p className="text-xs text-destructive">{String(errors.name.message)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm dark:bg-input/30"
                    {...register("category")}
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Service Description</Label>
                <textarea
                  id="description"
                  placeholder="Comprehensive food and beverage solution including multi-course menus, bar service..."
                  rows={4}
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30"
                  {...register("description")}
                />
              </div>

              {/* Accent Color picker swatches */}
              <div className="space-y-2 pt-2 border-t border-dashed">
                <Label>Theme Color Swatch</Label>
                <div className="flex items-center gap-3">
                  {colorSwatches.map((swatch) => {
                    const isSelected = watchColor === swatch.value;
                    return (
                      <button
                        key={swatch.value}
                        type="button"
                        onClick={() => setValue("color", swatch.value)}
                        className={cn(
                          "group relative flex size-8 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110",
                          isSelected ? "border-foreground ring-2 ring-primary/20 scale-105" : "border-transparent"
                        )}
                        style={{ backgroundColor: swatch.value }}
                        title={swatch.label}
                      >
                        {isSelected && (
                          <Check className="h-4 w-4 text-white drop-shadow-sm animate-in zoom-in-50 duration-200" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="font-bold text-lg text-foreground">Pricing Details</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted/60 text-muted-foreground border">
                  Base Currency
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pricingModel">Pricing Model</Label>
                  <select
                    id="pricingModel"
                    className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm dark:bg-input/30"
                    {...register("pricingModel")}
                  >
                    <option value="hourly">Hourly Rate</option>
                    <option value="flat">Flat Fee</option>
                    <option value="per_guest">Per Guest</option>
                  </select>
                </div>

                <div>
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {watchPricingModel === "hourly"
                        ? "Hourly Rate"
                        : watchPricingModel === "per_guest"
                          ? "Price per Guest"
                          : "Flat Fee"}
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder={
                        watchPricingModel === "hourly"
                          ? "150.00"
                          : watchPricingModel === "per_guest"
                            ? "85.00"
                            : "1500.00"
                      }
                      className="h-10"
                      {...register("price")}
                    />
                    {errors.price?.message && (
                      <p className="text-xs text-destructive">{String(errors.price.message)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Booking History Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="space-y-0.5">
                  <h2 className="font-bold text-lg text-foreground">Recent Booking History</h2>
                  <p className="text-xs text-muted-foreground">
                    Last 5 events where this service was active
                  </p>
                </div>
                <button type="button" className="text-xs font-bold text-primary hover:underline">
                  View All History
                </button>
              </div>

              {isNew ? (
                <div className="text-center py-6 text-sm text-muted-foreground">
                  No booking history available for new services.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                        <th className="p-3">Event Name</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Volume</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border font-medium">
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">TechNorth Annual Gala</td>
                        <td className="p-3">Nov 12, 2023</td>
                        <td className="p-3">NorthStar Logistics</td>
                        <td className="p-3">250 Guests</td>
                        <td className="p-3">
                          <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                            Completed
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-foreground">{formatCurrency(22750)}</td>
                      </tr>
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">Venture Summit '23</td>
                        <td className="p-3">Dec 04, 2023</td>
                        <td className="p-3">Silicon Peak VC</td>
                        <td className="p-3">120 Guests</td>
                        <td className="p-3">
                          <span className="inline-flex rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                            Confirmed
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-foreground">{formatCurrency(11700)}</td>
                      </tr>
                      <tr className="hover:bg-muted/20">
                        <td className="p-3 font-semibold text-foreground">Product Launch: X1</td>
                        <td className="p-3">Jan 15, 2024</td>
                        <td className="p-3">Nova Robotics</td>
                        <td className="p-3">400 Guests</td>
                        <td className="p-3">
                          <span className="inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                            Pending
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-foreground">{formatCurrency(35500)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Metrics Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Service Health Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
                Service Health
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Active Status</span>
                <button
                  type="button"
                  onClick={() => setValue("isActive", !watchIsActive)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                    watchIsActive ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                      watchIsActive ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <div className="divide-y divide-border pt-2">
                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-muted-foreground font-medium">Booked This Month</span>
                  <span className="font-bold text-foreground">{isNew ? "0 times" : "14 times"}</span>
                </div>
                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-muted-foreground font-medium">Market Demand</span>
                  <div className="flex items-center gap-1 text-emerald-500 font-bold">
                    <TrendingUp className="h-4 w-4" />
                    <span>High (+12%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Version History Card */}
            {/* <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b pb-2">
                Version History
              </h3>

              <div className="space-y-3.5">
                <div className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <History className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground block">Last Edited</span>
                    <span className="text-[10px] text-muted-foreground block">
                      {isNew ? "Just now" : "Oct 24, 2023 • 02:14 PM"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground block">Created By</span>
                    <span className="text-[10px] text-muted-foreground block">
                      Sarah Jenkins (Senior Ops)
                    </span>
                  </div>
                </div>
              </div>

              <button type="button" className="text-xs font-bold text-primary hover:underline border-t border-dashed w-full pt-3 text-left">
                View Audit Logs
              </button>
            </div> */}

            {/* Display Media Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="space-y-1 border-b pb-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Display Media
                </h3>
                <p className="text-[10px] text-muted-foreground">
                  This image appears in the client-facing proposal portal.
                </p>
              </div>

              {/* Renders Selected preset image */}
              <div className="rounded-xl overflow-hidden h-40 bg-muted border relative shadow-inner">
                {watchImage ? (
                  <img src={watchImage} alt="Service Display" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs gap-1.5 p-4">
                    <ImageIcon className="h-8 w-8 stroke-1" />
                    <span>No display image selected</span>
                  </div>
                )}
              </div>

              {/* Preset selectors overlay button */}
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPresets(!showPresets)}
                  className="w-full border-dashed h-10 gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <ImageIcon className="h-4 w-4" />
                  Replace Asset
                </Button>

                {showPresets && (
                  <div className="absolute right-0 left-0 bottom-12 z-10 border border-border bg-popover text-popover-foreground shadow-xl rounded-xl p-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between border-b pb-1.5 mb-2">
                      <span className="text-xs font-bold">Select Preset Cover</span>
                      <button
                        type="button"
                        onClick={() => setShowPresets(false)}
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
                      >
                        Close
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {imagePresets.map((preset) => (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => {
                            setValue("image", preset.value);
                            setShowPresets(false);
                          }}
                          className={cn(
                            "relative aspect-video rounded overflow-hidden border border-border transition-all hover:scale-105 shadow-sm bg-muted",
                            watchImage === preset.value && "ring-2 ring-primary border-transparent"
                          )}
                          title={preset.label}
                        >
                          <img src={preset.value} className="w-full h-full object-cover" alt="" />
                          <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
