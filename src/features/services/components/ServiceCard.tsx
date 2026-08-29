import { Edit2, Trash2, CheckCircle2, Camera, Video, Music, Utensils, Palette, Shield, Truck, Briefcase, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";

interface ServiceCardProps {
  service: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    color: string;
    category: string;
    pricingModel: string;
    isActive?: boolean;
  };
  onEdit: (service: any) => void;
  onDelete: (id: string) => void;
}

export function getServiceIcon(category?: string, name?: string): LucideIcon {
  const cat = (category || "").toLowerCase();
  const nam = (name || "").toLowerCase();

  if (cat.includes("photo") || nam.includes("photo") || nam.includes("camera")) return Camera;
  if (cat.includes("video") || nam.includes("video") || nam.includes("film")) return Video;
  if (cat.includes("dj") || cat.includes("sound") || cat.includes("music") || cat.includes("av") || nam.includes("dj") || nam.includes("sound")) return Music;
  if (cat.includes("cater") || cat.includes("din") || cat.includes("food") || nam.includes("cater") || nam.includes("food")) return Utensils;
  if (cat.includes("decor") || cat.includes("style") || cat.includes("design") || nam.includes("decor") || nam.includes("stage")) return Palette;
  if (cat.includes("secur") || cat.includes("operation") || nam.includes("guard")) return Shield;
  if (cat.includes("logist") || cat.includes("transport") || nam.includes("car")) return Truck;
  if (nam.includes("anchor") || nam.includes("host") || nam.includes("mua") || nam.includes("makeup")) return Sparkles;
  
  return Briefcase;
}

export default function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  const pricingText = service.pricingModel === "flat" ? "flat" : service.pricingModel === "per_guest" ? "per guest" : "hr";
  const IconComponent = getServiceIcon(service.category, service.name);
  const cardColor = service.color || "#6366F1";

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Category Icon & Theme Color Banner Header */}
      <div 
        className="relative h-24 w-full p-4 flex items-center justify-between overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${cardColor}22 0%, ${cardColor}08 100%)`,
        }}
      >
        {/* Decorative Background Icon */}
        <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 pointer-events-none">
          <IconComponent className="h-28 w-28" style={{ color: cardColor }} />
        </div>

        {/* Icon Badge */}
        <div 
          className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-xs border border-white/20 dark:border-white/10 shrink-0 z-10 backdrop-blur-xs"
          style={{ backgroundColor: `${cardColor}20`, color: cardColor }}
        >
          <IconComponent className="h-6 w-6" />
        </div>

        {/* Status Tag */}
        <div className="z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border shadow-xs",
              service.isActive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", service.isActive ? "bg-emerald-500 animate-pulse" : "bg-orange-500")} />
            {service.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Accent Color Bottom Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: cardColor }}
        />
      </div>

      {/* Details Area */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Category Badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md"
            style={{ backgroundColor: `${cardColor}15`, color: cardColor }}
          >
            {service.category}
          </span>
        </div>

        {/* Title and Pricing */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground text-base tracking-tight leading-tight line-clamp-1">
            {service.name}
          </h3>
          <span className="text-sm font-extrabold text-primary shrink-0">
            {formatCurrency(service.price)}/{pricingText}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
          {service.description || "No description provided for this service."}
        </p>

        {/* Footer Area with Card Actions */}
        <div className="border-t border-border/60 pt-3 flex items-center justify-between mt-auto">
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Verified Service</span>
          </div>

          {/* Edit/Delete Actions */}
          <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(service)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(service._id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
