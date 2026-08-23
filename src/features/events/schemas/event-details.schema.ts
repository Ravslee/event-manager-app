import { z } from "zod";

export const eventDetailsSchema = z.object({
  title: z.string().min(3, "Event title must be at least 3 characters"),
  eventTypeId: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  status: z.enum(["Confirmed", "Pending", "Completed", "Cancelled"]).optional(),
});
