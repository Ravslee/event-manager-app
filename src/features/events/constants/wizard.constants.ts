import { EventDetailsStep } from "../components/steps/EventDetailsStep";
import { ClientInformationStep } from "../components/steps/ClientInformationStep";
import type { WizardStep } from "../types/wizard.types";
import { VenueServicesStep } from "../components/steps/VenueServicesStep";
import { ReviewStep } from "../components/steps/ReviewStep";

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Event Details",
    description: "Basic information about the event",
    component: EventDetailsStep,
  },
  {
    id: 2,
    title: "Client Info",
    description: "Client and contact details",
    component: ClientInformationStep,
  },
  {
    id: 3,
    title: "Venue & Services",
    description: "Venue selection and required services",
    component: VenueServicesStep,
  },
  {
    id: 4,
    title: "Additional Details",
    description: "Review and create event",
    component: ReviewStep,
  },
];

export const FIRST_STEP = 1;

export const LAST_STEP = WIZARD_STEPS.length;
