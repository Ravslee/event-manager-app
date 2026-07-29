import { type FC, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useEventWizard } from "../../hooks/useEventWizard";
import WizardHeader from "./WizardHeader";
import EventStepper from "./EventStepper";
import WizardContent from "./WizardContent";
import WizardFooter from "./WizardFooter";
import api from "@/api/axios";

// Import schemas
import { eventDetailsSchema } from "../../schemas/event-details.schema";
import { clientInformationSchema } from "../../schemas/client-information.schema";
import { venueServicesSchema } from "../../schemas/venue-information.schema";
import { reviewSchema } from "../../schemas/review.schema";

const eventMasterSchema = z.object({
  title: eventDetailsSchema.shape.title,
  eventTypeId: eventDetailsSchema.shape.eventTypeId,
  eventDate: eventDetailsSchema.shape.eventDate,
  startTime: eventDetailsSchema.shape.startTime,
  endTime: eventDetailsSchema.shape.endTime,
  client: clientInformationSchema.shape.client,
  venue: venueServicesSchema.shape.venue,
  services: venueServicesSchema.shape.services,
  estimatedDuration: venueServicesSchema.shape.estimatedDuration,
  notes: reviewSchema.shape.notes,
});

const EventWizard: FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    currentStepConfig,
    steps,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    goToStep,
  } = useEventWizard();

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    api.get("/services")
      .then((res) => {
        if (res.data?.success && res.data?.data?.services) {
          setServices(res.data.data.services);
        }
      })
      .catch(() => {});
  }, []);

  const methods = useForm<any>({
    resolver: zodResolver(eventMasterSchema),
    defaultValues: {
      title: "",
      eventTypeId: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      client: {
        name: "",
        email: "",
        phone: "",
      },
      venue: {
        name: "",
        address: "",
        mapLink: "",
      },
      services: {},
      estimatedDuration: 4,
      notes: "",
    },
    mode: "onChange",
  });

  const stepFields: Record<number, string[]> = {
    1: ["title", "eventTypeId", "eventDate", "startTime", "endTime"],
    2: ["client.name", "client.email", "client.phone"],
    3: ["venue.name", "venue.address", "estimatedDuration"],
    4: ["notes"],
  };

  const handleNext = async () => {
    if (isLastStep) {
      await methods.handleSubmit((data) => onSubmit(data, "Confirmed"))();
    } else {
      const fieldsToValidate = stepFields[currentStep];
      const isValid = await methods.trigger(fieldsToValidate as any);
      if (isValid) {
        nextStep();
      }
    }
  };

  const handleSaveDraft = async () => {
    await methods.handleSubmit((data) => onSubmit(data, "Pending"))();
  };

  const handleDiscard = () => {
    methods.reset();
    goToStep(1);
  };

  const onSubmit = async (data: any, status: "Confirmed" | "Pending") => {
    try {
      const bookedServices = Object.entries(data.services)
        .filter(([_, checked]) => checked)
        .map(([serviceId, _]) => {
          const serviceDetail = services.find((s) => s._id === serviceId);
          const hourlyPrice = serviceDetail?.price || 0;
          return {
            serviceId,
            name: serviceDetail?.name || "Unknown Service",
            price: hourlyPrice * Number(data.estimatedDuration),
            duration: Number(data.estimatedDuration),
          };
        });

      const payload = {
        title: data.title,
        eventTypeId: data.eventTypeId,
        client: data.client,
        eventDate: new Date(data.eventDate),
        startTime: data.startTime,
        endTime: data.endTime,
        venue: {
          ...data.venue,
          mapLink: "",
        },
        bookedServices,
        notes: data.notes || "",
        status,
        isActive: true,
      };

      const response = await api.post("/events", payload);
      if (response.data?.success) {
        navigate("/calendar");
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const CurrentStepComponent = currentStepConfig.component;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-6 rounded-xl border bg-background p-6 shadow-sm">
        <WizardHeader
          title="Create New Event"
          description="Fill in the details to schedule a new creative production or client meeting."
        />

        <EventStepper steps={steps} currentStep={currentStep} />

        <WizardContent>
          <CurrentStepComponent />
        </WizardContent>

        <WizardFooter
          currentStep={currentStep}
          totalSteps={steps.length}
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onNext={handleNext}
          onPrevious={previousStep}
          onDiscard={handleDiscard}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    </FormProvider>
  );
};

export default EventWizard;
