import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(3, "Service name must be at least 3 characters"),
  description: z.string().optional().default(""),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  pricingModel: z.string().default("hourly"),
  color: z.string().default("#6366F1"),
  image: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
  minCapacity: z.coerce.number().min(0).optional().default(0),
});

export type ServiceFormModel = z.infer<typeof serviceSchema>;
