import { z } from "zod";

export const reviewSchema = z.object({
  notes: z.string().optional(),
});
