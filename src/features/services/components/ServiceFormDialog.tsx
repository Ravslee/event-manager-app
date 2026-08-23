import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serviceSchema } from "../schemas/service.schema";
import type { ServiceFormModel } from "../schemas/service.schema";

interface ServiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormModel) => void;
  service?: any; // If provided, we are in Edit mode
}

const colorSwatches = [
  { value: "#6366F1", label: "Indigo" },
  { value: "#10B981", label: "Emerald" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#F97316", label: "Orange" },
  { value: "#EF4444", label: "Red" },
  { value: "#EC4899", label: "Pink" },
];

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
  { value: "", label: "None (Default Image)" },
];

export default function ServiceFormDialog({
  open,
  onClose,
  onSubmit,
  service,
}: ServiceFormDialogProps) {
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
    },
  });

  const selectedColor = watch("color");
  const selectedImage = watch("image");

  useEffect(() => {
    if (open) {
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
        });
      } else {
        reset({
          name: "",
          description: "",
          price: 0,
          category: "General",
          pricingModel: "hourly",
          color: "#6366F1",
          image: "",
          isActive: true,
        });
      }
    }
  }, [open, service, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            {service ? "Edit Service" : "Add New Service"}
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              placeholder="e.g. Full Catering"
              className="h-10"
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="text-xs text-destructive">{String(errors.name.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {errors.category?.message && (
                <p className="text-xs text-destructive">{String(errors.category.message)}</p>
              )}
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="150.00"
                className="h-10"
                {...register("price")}
              />
              {errors.price?.message && (
                <p className="text-xs text-destructive">{String(errors.price.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm dark:bg-input/30"
                {...register("status")}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="Provide a description of the service and what it includes..."
              rows={3}
              className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Image Preset</Label>
            <select
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm dark:bg-input/30"
              value={selectedImage}
              onChange={(e) => setValue("image", e.target.value)}
            >
              {imagePresets.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color Picker Swatches */}
          <div className="space-y-2 pb-2">
            <Label>Accent Color Swatch</Label>
            <div className="flex items-center gap-3">
              {colorSwatches.map((swatch) => {
                const isSelected = selectedColor === swatch.value;
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

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="h-10 px-6">
              {isSubmitting ? "Saving..." : service ? "Save Changes" : "Add Service"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
