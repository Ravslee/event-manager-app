import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/api/axios";

const defaultEventTypes = [
  { _id: "default-gala", name: "Corporate Gala", color: "#6366F1" },
  { _id: "default-wedding", name: "Wedding", color: "#EC4899" },
  { _id: "default-shoot", name: "Creative Shoot", color: "#10B981" },
  { _id: "default-meeting", name: "Client Meeting", color: "#3B82F6" },
];

export function EventDetailsStep() {
  const { register, formState: { errors } } = useFormContext();
  const [eventTypes, setEventTypes] = useState<any[]>(defaultEventTypes);

  useEffect(() => {
    api.get("/event-types")
      .then((res) => {
        if (res.data?.success && res.data?.data?.eventTypes?.length > 0) {
          setEventTypes(res.data.data.eventTypes);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch event types, using default list", err);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b pb-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
          i
        </span>
        <h2 className="text-lg font-semibold text-foreground">Event Information</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            placeholder="e.g. Summer Solstice Gala 2024"
            className="h-10"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message as string}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="eventTypeId">Event Type</Label>
            <select
              id="eventTypeId"
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
              {...register("eventTypeId")}
              defaultValue=""
            >
              <option value="" disabled>Select event type</option>
              {eventTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.eventTypeId && (
              <p className="text-xs text-destructive">{errors.eventTypeId.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventDate">Date</Label>
            <div className="relative">
              <Input
                id="eventDate"
                type="date"
                className="h-10 pr-10"
                {...register("eventDate")}
              />
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {errors.eventDate && (
              <p className="text-xs text-destructive">{errors.eventDate.message as string}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <div className="relative">
              <Input
                id="startTime"
                type="time"
                className="h-10 pr-10"
                {...register("startTime")}
              />
              <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {errors.startTime && (
              <p className="text-xs text-destructive">{errors.startTime.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <div className="relative">
              <Input
                id="endTime"
                type="time"
                className="h-10 pr-10"
                {...register("endTime")}
              />
              <Clock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {errors.endTime && (
              <p className="text-xs text-destructive">{errors.endTime.message as string}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}