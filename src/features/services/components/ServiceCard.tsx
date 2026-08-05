import { Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    color: string;
    category: string;
    pricingModel: string;
    image?: string;
    isActive?: boolean;
  };
  onEdit: (service: any) => void;
  onDelete: (id: string) => void;
}

export default function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  // Build direct image paths (pre-seeded services match static assets we generated)
  const imageSrc = service.image || "/services/default.png";
  const pricingText = service.pricingModel === "flat" ? "flat" : service.pricingModel === "per_guest" ? "per guest" : "hr";

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
      {/* Visual Header Image */}
      <div className="relative h-44 w-full bg-muted overflow-hidden">
        <img
          src={imageSrc}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback for image loading error
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800`;
          }}
        />

        {/* Status Tag */}
        <div className="absolute right-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
              service.isActive
                ? "bg-emerald-500 text-white"
                : "bg-orange-500 text-white"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            {service.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Accent Color Band */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: service.color }}
        />
      </div>

      {/* Details Area */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Category */}
        <div className="flex items-center gap-1.5 mb-2">
          <span
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: `${service.color}15`, color: service.color }}
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
            ${service.price}/{pricingText}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
          {service.description || "No description provided for this service."}
        </p>

        {/* Footer Area with Card Actions */}
        <div className="border-t border-border pt-4 flex items-center justify-between mt-auto">
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>High-Tech Certified</span>
          </div>

          {/* Edit/Delete Actions */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(service)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(service._id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
