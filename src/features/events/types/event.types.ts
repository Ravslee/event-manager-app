import { z } from "zod";
import { eventDetailsSchema } from "../schemas/event-details.schema";
import { clientInformationSchema } from "../schemas/client-information.schema";
import { venueServicesSchema } from "../schemas/venue-information.schema";
import { reviewSchema } from "../schemas/review.schema";

export type EventDetailsModel = z.infer<typeof eventDetailsSchema>;
export type ClientInformationModel = z.infer<typeof clientInformationSchema>;
export type VenueServicesModel = z.infer<typeof venueServicesSchema>;
export type ReviewModel = z.infer<typeof reviewSchema>;

export interface EventFormModel {
  title: string;
  eventTypeId: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  client: {
    name: string;
    email: string;
    phone: string;
  };
  venue: {
    name: string;
    address: string;
    mapLink?: string;
  };
  services: Record<string, boolean>;
  estimatedDuration: number;
  notes?: string;
}