import { useEffect, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FileText, Calendar, Clock, MapPin, User as UserIcon, CheckCircle2, Plus, Minus, MessageSquare, Copy, Check, ExternalLink, IndianRupee } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/axios";

const defaultServices = [
  { _id: "srv-livestream", name: "Live Stream", price: 150 },
  { _id: "srv-4krec", name: "4K Recording", price: 200 },
  { _id: "srv-audio", name: "Audio Rental", price: 100 },
  { _id: "srv-tech", name: "On-site Tech", price: 75 },
];

export function ReviewStep() {
  const { user } = useAuth();
  const { register, watch, setValue } = useFormContext();
  const [services, setServices] = useState<any[]>(defaultServices);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const businessOrStudioName = user?.businessName || user?.ownerName || user?.name || "Studio Booking Desk";

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
  const watchedAdvancePaid = Number(formValues.advancePaid) || 0;

  const selectedEventTypeName = eventTypes.find((t) => t._id === formValues.eventTypeId)?.name || "Event Booking";

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

  const pendingBalance = Math.max(0, totalAmount - watchedAdvancePaid);

  const handleSetPercentAdvance = (percent: number) => {
    const calculated = Math.round((totalAmount * percent) / 100);
    setValue("advancePaid", calculated);
  };

  // Generate WhatsApp Drafted Message
  const whatsappMessage = useMemo(() => {
    const clientName = formValues.client?.name || "Client";
    const title = formValues.title || "Upcoming Event";
    const date = formValues.eventDate || "TBD";
    const startTime = formValues.startTime || "--:--";
    const endTime = formValues.endTime || "--:--";
    const venueName = formValues.venue?.name || "TBD";
    const venueAddress = formValues.venue?.address || "";
    
    const servicesText = selectedServices.length > 0
      ? selectedServices.map((s: any) => `• *${s.name}*: ${s.quantity} x ${formatCurrency(s.price || 0)} = ${formatCurrency(s.calculatedPrice)}`).join("\n")
      : "• Standard Event Services";

    return `Namaste ${clientName}! 🙏

Here are the booking confirmation details for *${title}*:

📅 *Date:* ${date}
⏰ *Time:* ${startTime} - ${endTime} (${watchedDuration} hrs)
📍 *Venue:* ${venueName}${venueAddress ? `, ${venueAddress}` : ""}
🎉 *Type:* ${selectedEventTypeName}

💼 *Services Included:*
${servicesText}

💳 *Payment Breakdown:*
• *Total Amount:* ${formatCurrency(totalAmount)}
• *Advance Paid:* ${formatCurrency(watchedAdvancePaid)}
• *Pending Balance:* ${formatCurrency(pendingBalance)}

Please review and confirm. Excited to work together on your special event! ✨
— ${businessOrStudioName}`;
  }, [formValues, selectedServices, selectedEventTypeName, watchedDuration, totalAmount, watchedAdvancePaid, pendingBalance, businessOrStudioName]);

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = (formValues.client?.phone || "").replace(/[^0-9]/g, "");
    const waUrl = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileText className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Review & Confirm</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Duration Stepper, Advance Input, Notes & WhatsApp Draft Message */}
        <div className="lg:col-span-7 space-y-5">
          {/* Duration Stepper & Advance Payment Received Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estimated Duration Stepper */}
            <div className="space-y-2 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
              <Label htmlFor="estimatedDuration" className="text-xs font-bold text-foreground">
                Estimated Duration (Hours)
              </Label>
              <div className="flex items-center gap-3 pt-0.5">
                <div className="flex items-center border border-input rounded-xl bg-background overflow-hidden shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      const val = Number(watchedDuration) || 1;
                      if (val > 1) setValue("estimatedDuration", val - 1);
                    }}
                    className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-r border-border/60"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-14 text-center text-xs font-extrabold text-foreground px-1">
                    {watchedDuration || 1} hrs
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const val = Number(watchedDuration) || 1;
                      setValue("estimatedDuration", val + 1);
                    }}
                    className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors border-l border-border/60"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Advance Payment Received Input & Percentage Chips */}
            <div className="space-y-2 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
              <div className="flex items-center justify-between">
                <Label htmlFor="advancePaid" className="text-xs font-bold text-foreground">
                  Advance Payment (₹)
                </Label>
                <div className="flex items-center gap-1">
                  {[0, 25, 30, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSetPercentAdvance(pct)}
                      className="px-1.5 py-0.5 text-[10px] font-extrabold rounded-md bg-muted/60 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative pt-0.5">
                <Input
                  id="advancePaid"
                  type="number"
                  placeholder="0"
                  className="h-8 text-xs font-semibold pl-8"
                  {...register("advancePaid")}
                />
                <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Event Notes Textarea */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs sm:text-sm font-bold">Event Notes</Label>
            <textarea
              id="notes"
              placeholder="Provide any additional context, special requirements, or specific requests for this event..."
              rows={3}
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30"
              {...register("notes")}
            />
          </div>

          {/* WhatsApp Drafted Message Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-foreground">WhatsApp Client Message Draft</h3>
                  <p className="text-[11px] text-muted-foreground">Includes advance payment & pending balance</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyWhatsApp}
                  className="h-8 text-xs gap-1.5 rounded-lg border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenWhatsApp}
                  className="h-8 text-xs gap-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Send on WhatsApp</span>
                </Button>
              </div>
            </div>

            {/* Message Preview Box */}
            <pre className="text-xs text-foreground bg-background/80 p-3.5 rounded-xl border border-border/60 whitespace-pre-wrap font-sans leading-relaxed select-all">
              {whatsappMessage}
            </pre>
          </div>
        </div>

        {/* Dynamic Recap Summary & Total Amount Panel */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs self-start">
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
                <UserIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
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

            {/* Services detail list */}
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

            {/* Payment Summary Box: Total, Advance Paid, Pending Balance */}
            <div className="border-t border-border/80 pt-3 mt-3 space-y-2 rounded-xl bg-primary/5 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>Total Amount</span>
                <span className="text-sm font-extrabold">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Advance Paid</span>
                <span>{formatCurrency(watchedAdvancePaid)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-extrabold text-amber-600 dark:text-amber-400 border-t border-border/50 pt-1.5">
                <span>Pending Balance</span>
                <span>{formatCurrency(pendingBalance)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
