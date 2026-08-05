import { z } from "zod";

export const venueServicesSchema = z.object({
  venue: z.object({
    name: z.string().min(2, "Venue name must be at least 2 characters"),
    address: z.string().min(5, "Full address must be at least 5 characters"),
    mapLink: z.string().optional(),
  }),
  services: z.record(
    z.string(),
    z.object({
      checked: z.boolean().optional(),
      quantity: z.coerce.number().min(1).optional(),
    }).optional()
  ),
  estimatedDuration: z.coerce.number().min(1, "Duration must be at least 1 hour"),
});
