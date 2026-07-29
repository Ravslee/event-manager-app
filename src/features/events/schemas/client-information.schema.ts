import { z } from "zod";

export const clientInformationSchema = z.object({
  client: z.object({
    name: z.string().min(2, "Client name must be at least 2 characters"),
    email: z.string().email("Invalid email address").or(z.literal("")),
    phone: z.string().min(1, "Phone number is required"),
  }),
});
