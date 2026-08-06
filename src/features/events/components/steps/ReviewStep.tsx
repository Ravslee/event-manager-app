import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FileText, Calendar, Clock, MapPin, User, CheckCircle2 } from "lucide-react";
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
  const { register, watch } = useFormContext();
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
  const watchedDuration = formValues.estimatedDuration || 0;

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
        <h2 className="text-lg font-semibold text-foreground">Additional Details</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Event Notes Textarea */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Event Notes</Label>
            <textarea
              id="notes"
              placeholder="Provide any additional context, special requirements, or specific requests for this event..."
              rows={6}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register("notes")}
            />
          </div>
        </div>

        {/* Dynamic Recap Summary Panel */}
        <div className="lg:col-span-5 rounded-xl border bg-muted/20 p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5 border-b pb-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Booking Summary
          </h3>

          <div className="space-y-3 text-sm">
            {/* Event details */}
            {formValues.title && (
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{formValues.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedEventTypeName} • {formValues.eventDate}</p>
                </div>
              </div>
            )}

            {/* Time details */}
            {(formValues.startTime || formValues.endTime) && (
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="text-foreground text-xs font-medium">
                    {formValues.startTime || "--:--"} to {formValues.endTime || "--:--"}
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
                  <p className="text-foreground text-xs font-medium">{formValues.client.name}</p>
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
                  <p className="text-foreground text-xs font-medium">{formValues.venue.name}</p>
                  <p className="text-xs text-muted-foreground">{formValues.venue.address}</p>
                </div>
              </div>
            )}

            {/* Services detail list */}
            {selectedServices.length > 0 && (
              <div className="border-t pt-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground">Booked Services</p>
                {selectedServices.map((service: any) => (
                   <div key={service._id} className="flex justify-between text-xs">
                     <span className="text-muted-foreground">
                       {service.name} (x{service.quantity} {service.pricingModel === "hourly" ? "hrs" : service.pricingModel === "per_guest" ? "guests" : "qty"})
                     </span>
                     <span className="font-medium text-foreground">{formatCurrency(service.calculatedPrice)}</span>
                   </div>
                ))}
                <div className="flex justify-between border-t pt-2 mt-2 font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
