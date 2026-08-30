import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { MapPin, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import { getServices } from "@/features/services/api/service.api";

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

  // Sort checked services to bubble up to top in order of selection
  const sortedServices = [...services].sort((a, b) => {
    const aVal = watchedServices[a._id];
    const bVal = watchedServices[b._id];
    const aChecked = !!aVal?.checked;
    const bChecked = !!bVal?.checked;

    if (aChecked && !bChecked) return -1;
    if (!aChecked && bChecked) return 1;

    if (aChecked && bChecked) {
      const aOrder = aVal?.selectionOrder || 0;
      const bOrder = bVal?.selectionOrder || 0;
      return aOrder - bOrder;
    }

    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Venue & Services</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Services Checklist */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs sm:text-sm font-bold">Requested Services</Label>
          <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">Select services & qty</span>
        </div>

        <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-y-auto max-h-56 sm:max-h-72 shadow-xs pr-0.5">
          {sortedServices.map((service) => {
            const serviceVal = watchedServices[service._id];
            const isChecked = !!serviceVal?.checked;

            // Format price string based on model
            let pricingLabel = "";
            if (service.pricingModel === "hourly") {
              pricingLabel = `${formatCurrency(service.price)}/hr`;
            } else if (service.pricingModel === "per_guest") {
              pricingLabel = `${formatCurrency(service.price)}/guest`;
            } else {
              pricingLabel = `${formatCurrency(service.price)} flat`;
            }

            const unitLabel =
              service.pricingModel === "hourly"
                ? "hrs"
                : service.pricingModel === "per_guest"
                ? "gst"
                : "qty";

            return (
              <div
                key={service._id}
                className={cn(
                  "flex items-center justify-between h-10 sm:h-12 px-2 sm:px-4 gap-1.5 sm:gap-3 transition-all duration-150 select-none shrink-0",
                  isChecked
                    ? "bg-primary/[0.04] dark:bg-primary/[0.08]"
                    : "hover:bg-accent/30"
                )}
              >
                {/* Left: Checkbox + Name + Description */}
                <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
                  <Controller
                    control={control}
                    name={`services.${service._id}`}
                    render={({ field }) => (
                      <Checkbox
                        id={service._id}
                        checked={!!field.value?.checked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setValue(`services.${service._id}`, {
                              ...field.value,
                              checked: true,
                              quantity: field.value?.quantity || (service.pricingModel === "hourly" ? watchedDuration || 1 : 1),
                              selectionOrder: Date.now(),
                            });
                          } else {
                            setValue(`services.${service._id}`, {
                              ...field.value,
                              checked: false,
                            });
                          }
                        }}
                        className="size-3.5 sm:size-5 shrink-0"
                      />
                    )}
                  />
                  <label htmlFor={service._id} className="flex-1 cursor-pointer min-w-0">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="text-[11px] sm:text-sm font-bold text-foreground truncate leading-tight">{service.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">({pricingLabel})</span>
                    </div>
                    {service.description && (
                      <p className="text-[9px] sm:text-xs text-muted-foreground truncate leading-none mt-0.5 hidden xs:block">{service.description}</p>
                    )}
                  </label>
                </div>

                {/* Right: Quantity Stepper */}
                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                  {isChecked && (
                    <div
                      className="flex items-center border border-input rounded-lg bg-background overflow-hidden shrink-0 shadow-2xs"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const currentVal = Number(serviceVal?.quantity ?? (service.pricingModel === "hourly" ? watchedDuration : 1));
                          if (currentVal > 1) {
                            setValue(`services.${service._id}.quantity`, currentVal - 1);
                          }
                        }}
                        className="h-6 w-5 sm:h-8 sm:w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-r border-border/60 font-black text-[10px] sm:text-xs"
                      >
                        <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                      <span className="min-w-10 sm:min-w-14 px-1 text-center text-[10px] sm:text-xs font-extrabold text-foreground">
                        {serviceVal?.quantity ?? (service.pricingModel === "hourly" ? watchedDuration : 1)} {unitLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentVal = Number(serviceVal?.quantity ?? (service.pricingModel === "hourly" ? watchedDuration : 1));
                          setValue(`services.${service._id}.quantity`, currentVal + 1);
                        }}
                        className="h-6 w-5 sm:h-8 sm:w-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-l border-border/60 font-black text-[10px] sm:text-xs"
                      >
                        <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
