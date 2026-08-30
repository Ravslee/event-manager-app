import { type FC, useEffect, useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { eventTypeSchema } from "../schemas/event-type.schema";
import { getEventType, createEventType, updateEventType } from "../api/event-type.api";
import type { EventTypeFormInput } from "../types/event-type.types";

interface EventTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTypeId?: string;
  onSuccess: () => void;
}

const colorPresets = [
  { value: "#6366F1", label: "Indigo" },
  { value: "#10B981", label: "Emerald" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#F97316", label: "Orange" },
  { value: "#EF4444", label: "Red" },
  { value: "#EC4899", label: "Pink" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#06B6D4", label: "Cyan" },
];

export const EventTypeDialog: FC<EventTypeDialogProps> = ({
  open,
  onOpenChange,
  eventTypeId,
  onSuccess,
}) => {
  const isEdit = !!eventTypeId;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      name: "",
      color: "#3B82F6",
      description: "",
      isDefault: false,
      isActive: true,
    },
  });

  const watchColor = watch("color");

  // Fetch Event Type details for Edit mode
  useEffect(() => {
    if (open) {
      if (isEdit && eventTypeId) {
        setLoading(true);
        getEventType(eventTypeId)
          .then((data) => {
            if (data) {
              reset({
                name: data.name || "",
                color: data.color || "#3B82F6",
                description: data.description || "",
                isDefault: !!data.isDefault,
                isActive: data.isActive !== false,
              });
            }
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch event type details", err);
            setLoading(false);
          });
      } else {
        reset({
          name: "",
          color: "#3B82F6",
          description: "",
          isDefault: false,
          isActive: true,
        });
      }
    }
  }, [open, isEdit, eventTypeId, reset]);

  const onSubmit: SubmitHandler<EventTypeFormInput> = async (data) => {
    try {
      if (isEdit && eventTypeId) {
        await updateEventType(eventTypeId, data);
      } else {
        await createEventType(data);
      }
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save event type", err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <h3 className="text-xl font-bold text-foreground mb-4">
          {isEdit ? "Edit Event Type" : "Create New Event Type"}
        </h3>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <span className="text-sm text-muted-foreground">Loading details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Event Type Name</Label>
              <Input
                id="name"
                placeholder="e.g. Wedding Ceremony, Corporate Conference"
                className="h-10"
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="text-xs text-destructive">{String(errors.name.message)}</p>
              )}
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Brief description of the events associated with this type..."
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30"
                {...register("description")}
              />
            </div>

            {/* Color Swatches Selection */}
            <div className="space-y-2">
              <Label>Theme Color</Label>
              <div className="flex flex-wrap items-center gap-3">
                {colorPresets.map((preset) => {
                  const isSelected = watchColor?.toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setValue("color", preset.value)}
                      className={cn(
                        "group relative flex size-8 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110",
                        isSelected ? "border-foreground ring-2 ring-primary/20 scale-105" : "border-transparent"
                      )}
                      style={{ backgroundColor: preset.value }}
                      title={preset.label}
                    >
                      {isSelected && (
                        <Check className="h-4 w-4 text-white drop-shadow-sm animate-in zoom-in-50 duration-200" />
                      )}
                    </button>
                  );
                })}
                {/* Custom Color Input */}
                <div className="relative flex items-center size-8 rounded-full overflow-hidden border border-border shadow-sm group hover:scale-110 transition-transform">
                  <input
                    type="color"
                    className="absolute inset-0 cursor-pointer w-[200%] h-[200%] -translate-x-[25%] -translate-y-[25%] border-none bg-transparent"
                    value={watchColor}
                    onChange={(e) => setValue("color", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Switches / Checkboxes row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dashed">
              {/* Is Default Checkbox */}
              <div className="flex items-start gap-3 rounded-xl border p-4 bg-muted/10">
                <Controller
                  control={control}
                  name="isDefault"
                  render={({ field }) => (
                    <Checkbox
                      id="isDefault"
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      className="size-5 mt-0.5"
                    />
                  )}
                />
                <div className="flex-1">
                  <label htmlFor="isDefault" className="text-sm font-semibold text-foreground cursor-pointer block select-none">
                    Default Type
                  </label>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                    Pre-select this type by default in event creation.
                  </p>
                </div>
              </div>

              {/* Is Active Checkbox */}
              <div className="flex items-start gap-3 rounded-xl border p-4 bg-muted/10">
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Checkbox
                      id="isActive"
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      className="size-5 mt-0.5"
                    />
                  )}
                />
                <div className="flex-1">
                  <label htmlFor="isActive" className="text-sm font-semibold text-foreground cursor-pointer block select-none">
                    Active Status
                  </label>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-normal">
                    Allow this event type to be used in event wizards.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm rounded-xl"
              >
                {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create Event Type"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
