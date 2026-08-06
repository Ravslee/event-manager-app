import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import { getServices } from "@/features/services/api/service.api";
import mapPreview from "@/assets/map_preview.png";

const defaultServices = [
  { _id: "srv-livestream", name: "Live Stream", price: 150, description: "Real-time broadcasting service" },
  { _id: "srv-4krec", name: "4K Recording", price: 200, description: "Ultra high-definition video recording" },
  { _id: "srv-audio", name: "Audio Rental", price: 100, description: "Professional microphones and sound systems" },
  { _id: "srv-tech", name: "On-site Tech", price: 75, description: "Dedicated technician support during the event" },
];

export function VenueServicesStep() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext();
  const [services, setServices] = useState<any[]>(defaultServices);

  useEffect(() => {
    getServices()
      .then((list) => {
        const activeList = list.filter((s: any) => s.isActive !== false);
        if (activeList.length > 0) {
          setServices(activeList);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch services, using default list", err);
      });
  }, []);

  // Watch services and duration for pricing calculations
  const watchedServices = watch("services") || {};
  const watchedDuration = watch("estimatedDuration") || 0;

  const totalAmount = Object.entries(watchedServices)
    .filter(([_, value]: any) => value?.checked)
    .reduce((sum, [serviceId, value]: any) => {
      const service = services.find((s) => s._id === serviceId);
      if (!service) return sum;

      const qty = value.quantity !== undefined
        ? Number(value.quantity)
        : (service.pricingModel === "hourly" ? Number(watchedDuration) || 1 : 1);

      const cost = (service.price || 0) * qty;
      return sum + cost;
    }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Venue & Services</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venueName">Venue Name</Label>
            <Input
              id="venueName"
              placeholder="e.g. The Glass House"
              className="h-10"
              {...register("venue.name")}
            />
            {errors.venue && (errors.venue as any).name && (
              <p className="text-xs text-destructive">{(errors.venue as any).name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueAddress">Full Address</Label>
            <Input
              id="venueAddress"
              placeholder="123 Creative Blvd, New York, NY 10001"
              className="h-10"
              {...register("venue.address")}
            />
            {errors.venue && (errors.venue as any).address && (
              <p className="text-xs text-destructive">{(errors.venue as any).address.message}</p>
            )}
          </div>
        </div>

        {/* Right Map Preview Panel */}
        <div className="lg:col-span-4 flex flex-col justify-end space-y-2">
          <Label>Map Preview</Label>
          <div className="rounded-xl border bg-card overflow-hidden h-[106px] relative shadow-sm flex items-center justify-center">
            <img
              src={mapPreview}
              alt="Map Preview"
              className="object-cover w-full h-full opacity-90 transition-opacity hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Services Checklist */}
      <div className="space-y-3">
        <Label>Requested Services</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => {
            const serviceVal = watchedServices[service._id];
            const isChecked = !!serviceVal?.checked;

            // Format price string based on model
            let pricingLabel = "";
            if (service.pricingModel === "hourly") {
              pricingLabel = `${formatCurrency(service.price)} / hr`;
            } else if (service.pricingModel === "per_guest") {
              pricingLabel = `${formatCurrency(service.price)} / guest`;
            } else {
              pricingLabel = `${formatCurrency(service.price)} flat`;
            }

            return (
              <div
                key={service._id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border p-4 hover:bg-accent/40 transition-all duration-200 select-none",
                  isChecked
                    ? "border-primary bg-primary/5 shadow-[0_0_12px_rgba(99,102,241,0.05)]"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-center gap-4">
                  <Controller
                    control={control}
                    name={`services.${service._id}.checked`}
                    render={({ field }) => (
                      <Checkbox
                        id={service._id}
                        checked={!!field.value}
                        onCheckedChange={(checked) => field.onChange(!!checked)}
                        className="size-5"
                      />
                    )}
                  />
                  <label htmlFor={service._id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{service.name}</span>
                      <span className="text-sm font-medium text-primary">{pricingLabel}</span>
                    </div>
                    {service.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                    )}
                  </label>
                </div>

                {isChecked && (
                  <div
                    className="mt-1 pt-3 border-t border-dashed border-border/60 flex items-center justify-between gap-4"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-muted-foreground font-medium">
                      {service.pricingModel === "hourly"
                        ? "Duration"
                        : service.pricingModel === "per_guest"
                        ? "Guests"
                        : "Quantity"}
                    </span>
                    <div className="relative flex items-center max-w-[120px]">
                      <Input
                        type="number"
                        min="1"
                        className="h-8 pr-8 text-xs font-semibold text-right bg-transparent border border-input rounded"
                        value={serviceVal?.quantity ?? (service.pricingModel === "hourly" ? watchedDuration : 1)}
                        onChange={(e) => {
                          const val = e.target.value === "" ? "" : Number(e.target.value);
                          setValue(`services.${service._id}.quantity`, val);
                        }}
                      />
                      <span className="absolute right-2 text-[10px] text-muted-foreground font-medium pointer-events-none">
                        {service.pricingModel === "hourly"
                          ? "hrs"
                          : service.pricingModel === "per_guest"
                          ? "guests"
                          : "qty"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Duration and Pricing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
        <div className="space-y-2">
          <Label htmlFor="estimatedDuration">Estimated Duration (Hours)</Label>
          <div className="relative flex items-center">
            <Input
              id="estimatedDuration"
              type="number"
              min="1"
              className="h-10 pr-12"
              {...register("estimatedDuration")}
            />
            <span className="absolute right-3 text-sm text-muted-foreground font-medium pointer-events-none">
              hrs
            </span>
          </div>
          {errors.estimatedDuration && (
            <p className="text-xs text-destructive">{errors.estimatedDuration.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Total Amount</Label>
          <div className="relative">
            <Input
              value={formatCurrency(totalAmount)}
              disabled
              className="h-10 bg-muted/40 font-semibold text-foreground disabled:opacity-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
