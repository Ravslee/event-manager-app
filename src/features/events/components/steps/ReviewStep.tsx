import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FileText, Calendar, Clock, MapPin, User, CheckCircle2, Plus, Minus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import api from "@/api/axios";

const defaultServices = [
  { _id: "srv-livestream", name: "Live Stream", price: 150 },
  { _id: "srv-4krec", name: "4K Recording", price: 200 },
  { _id: "srv-audio", name: "Audio Rental", price: 100 },
  { _id: "srv-tech", name: "On-site Tech", price: 75 },
];

export function ReviewStep() {
  const { register, watch, setValue } = useFormContext();
  const [services, setServices] = useState<any[]>(defaultServices);
  const [eventTypes, setEventTypes] = useState<any[]>([]);

  useEffect(() => {
    api.get("/services")
      .then((res) => {
        if (res.data?.success && res.data?.data?.services?.length > 0) {
          setServices(res.data.data.services);
        }
      })
      .catch(() => {});

    api.get("/event-types")
      .then((res) => {
        if (res.data?.success && res.data?.data?.eventTypes?.length > 0) {
          setEventTypes(res.data.data.eventTypes);
        }
      })
      .catch(() => {});
  }, []);

  // Watch form fields
  const formValues = watch();
  const watchedServices = formValues.services || {};
  const watchedDuration = formValues.estimatedDuration || 4;

  const selectedEventTypeName = eventTypes.find((t) => t._id === formValues.eventTypeId)?.name || "Corporate Gala";

  const selectedServices = Object.entries(watchedServices)
    .filter(([_, value]: any) => value?.checked)
    .map(([serviceId, value]: any) => {
      const service = services.find((s) => s._id === serviceId);
      if (!service) return null;

      const qty = value.quantity !== undefined
        ? Number(value.quantity)
        : (service.pricingModel === "hourly" ? Number(watchedDuration) || 1 : 1);

      const calculatedPrice = (service.price || 0) * qty;

      return {
        ...service,
        quantity: qty,
        calculatedPrice,
      };
    })
    .filter(Boolean) as any[];

  const totalAmount = selectedServices.reduce((sum, service) => {
    return sum + service.calculatedPrice;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileText className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Review & Confirm</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Estimated Duration Stepper & Event Notes */}
        <div className="lg:col-span-7 space-y-5">
          {/* Estimated Duration Stepper */}
          <div className="space-y-2 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
            <Label htmlFor="estimatedDuration" className="text-xs sm:text-sm font-bold text-foreground">
              Estimated Duration (Hours)
            </Label>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center border border-input rounded-xl bg-background overflow-hidden shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    const val = Number(watchedDuration) || 1;
                    if (val > 1) setValue("estimatedDuration", val - 1);
                  }}
                  className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-r border-border/60"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-16 text-center text-xs sm:text-sm font-extrabold text-foreground px-2">
                  {watchedDuration || 1} hrs
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const val = Number(watchedDuration) || 1;
                    setValue("estimatedDuration", val + 1);
                  }}
                  className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-l border-border/60"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">Adjust production duration for accurate estimates</span>
            </div>
          </div>

          {/* Event Notes Textarea */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs sm:text-sm font-bold">Event Notes</Label>
            <textarea
              id="notes"
              placeholder="Provide any additional context, special requirements, or specific requests for this event..."
              rows={4}
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register("notes")}
            />
          </div>
        </div>

        {/* Dynamic Recap Summary & Total Amount Panel */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-1.5 border-b pb-3">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Booking Summary
          </h3>

          <div className="space-y-3 text-sm">
            {/* Event details */}
            {formValues.title && (
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">{formValues.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedEventTypeName} • {formValues.eventDate}</p>
                </div>
              </div>
            )}

            {/* Time details */}
            {(formValues.startTime || formValues.endTime) && (
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Schedule & Duration</p>
                  <p className="text-foreground text-xs font-semibold">
                    {formValues.startTime || "--:--"} to {formValues.endTime || "--:--"} ({watchedDuration} hrs)
                  </p>
                </div>
              </div>
            )}

            {/* Client info */}
            {formValues.client?.name && (
              <div className="flex items-start gap-2.5">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="text-foreground text-xs font-semibold">{formValues.client.name}</p>
                  <p className="text-xs text-muted-foreground">{formValues.client.phone} {formValues.client.email && `• ${formValues.client.email}`}</p>
                </div>
              </div>
            )}

            {/* Venue info */}
            {formValues.venue?.name && (
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Venue</p>
                  <p className="text-foreground text-xs font-semibold">{formValues.venue.name}</p>
                  <p className="text-xs text-muted-foreground">{formValues.venue.address}</p>
                </div>
              </div>
            )}

            {/* Services detail list & Total Amount */}
            {selectedServices.length > 0 && (
              <div className="border-t border-border/60 pt-3 space-y-1.5">
                <p className="text-xs font-bold text-muted-foreground">Booked Services</p>
                {selectedServices.map((service: any) => (
                  <div key={service._id} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {service.name} (x{service.quantity} {service.pricingModel === "hourly" ? "hrs" : service.pricingModel === "per_guest" ? "gst" : "qty"})
                    </span>
                    <span className="font-semibold text-foreground">{formatCurrency(service.calculatedPrice)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Total Amount Box */}
            <div className="flex items-center justify-between border-t border-border/80 pt-3 mt-3 font-extrabold text-foreground rounded-xl bg-primary/5 p-3">
              <span className="text-sm">Total Amount</span>
              <span className="text-base text-primary font-black">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
