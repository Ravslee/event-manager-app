import { z } from "zod";

export const eventTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  color: z.string().default("#3B82F6"),
  description: z.string().optional().default(""),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
