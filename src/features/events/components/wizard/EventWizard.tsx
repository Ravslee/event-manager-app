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
  status: eventDetailsSchema.shape.status,
  client: clientInformationSchema.shape.client,
  venue: venueServicesSchema.shape.venue,
  services: venueServicesSchema.shape.services,
  estimatedDuration: venueServicesSchema.shape.estimatedDuration,
  notes: reviewSchema.shape.notes,
});

interface EventWizardProps {
  eventId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EventWizard: FC<EventWizardProps> = ({ eventId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const methods = useForm<any>({
    resolver: zodResolver(eventMasterSchema),
    defaultValues: {
      title: "",
      eventTypeId: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      status: "Confirmed",
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
      .catch(() => { });
  }, []);

  // Fetch Event details for Edit mode
  useEffect(() => {
    if (eventId) {
      api.get(`/events/${eventId}`)
        .then((res) => {
          if (res.data?.success && res.data?.data) {
            const event = res.data.data;
            
            // Map booked services array to the form representation
            const servicesFormVal: Record<string, { checked: boolean; quantity: number }> = {};
            if (event.bookedServices) {
              event.bookedServices.forEach((s: any) => {
                servicesFormVal[s.serviceId] = {
                  checked: true,
                  quantity: s.unit,
                };
              });
            }

            // Extract the date from ISO format safely in local timezone
            let eventDateStr = "";
            if (event.eventDate) {
              const d = new Date(event.eventDate);
              eventDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            }

            methods.reset({
              title: event.title || "",
              eventTypeId: typeof event.eventTypeId === "object" ? event.eventTypeId?._id : event.eventTypeId || "",
              eventDate: eventDateStr,
              startTime: event.startTime || "",
              endTime: event.endTime || "",
              status: event.status || "Confirmed",
              client: {
                name: event.client?.name || "",
                email: event.client?.email || "",
                phone: event.client?.phone || "",
              },
              venue: {
                name: event.venue?.name || "",
                address: event.venue?.address || "",
                mapLink: event.venue?.mapLink || "",
              },
              services: servicesFormVal,
              estimatedDuration: event.estimatedDuration || 4,
              notes: event.notes || "",
            });
          }
        })
        .catch((err) => {
          console.error("Failed to load event for editing:", err);
        });
    }
  }, [eventId, methods]);


  const stepFields: Record<number, string[]> = {
    1: ["title", "eventTypeId", "eventDate", "startTime", "endTime"],
    2: ["client.name", "client.email", "client.phone"],
    3: ["venue.name", "venue.address", "estimatedDuration"],
    4: ["notes"],
  };

  const handleNext = async () => {
    if (isLastStep) {
      await methods.handleSubmit(
        (data) => onSubmit(data, "Confirmed"),
        (errors) => console.error("Validation errors on Confirm:", errors)
      )();
    } else {
      const fieldsToValidate = stepFields[currentStep];
      const isValid = await methods.trigger(fieldsToValidate as any);
      if (isValid) {
        nextStep();
      }
    }
  };

  const handleSaveDraft = async () => {
    await methods.handleSubmit(
      (data) => onSubmit(data, "Pending"),
      (errors) => console.error("Validation errors on Save Draft:", errors)
    )();
  };

  const handleDirectUpdate = async () => {
    const fieldsToValidate = stepFields[currentStep];
    const isValid = await methods.trigger(fieldsToValidate as any);
    if (isValid) {
      await methods.handleSubmit(
        (data) => onSubmit(data, data.status || "Confirmed"),
        (errors) => console.error("Validation errors on Direct Update:", errors)
      )();
    }
  };

  const handleDiscard = () => {
    methods.reset();
    goToStep(1);
    if (onCancel) {
      onCancel();
    }
  };

  const onSubmit = async (data: any, defaultStatus: "Confirmed" | "Pending") => {
    try {
      const bookedServices = Object.entries(data.services)
        .filter(([_, value]: any) => value?.checked)
        .map(([serviceId, value]: any) => {
          const serviceDetail = services.find((s) => s._id === serviceId);

          const qty = value.quantity !== undefined
            ? Number(value.quantity)
            : (serviceDetail?.pricingModel === "hourly" ? Number(data.estimatedDuration) || 1 : 1);

          const calculatedPrice = serviceDetail ? (serviceDetail.price || 0) * qty : 0;

          return {
            serviceId,
            name: serviceDetail?.name || "Unknown Service",
            price: calculatedPrice,
            unit: qty,
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
        status: data.status || defaultStatus,
        isActive: true,
      };

      const response = eventId
        ? await api.patch(`/events/${eventId}`, payload)
        : await api.post("/events", payload);
      if (response.data?.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/calendar");
        }
      }
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const CurrentStepComponent = currentStepConfig.component;

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-auto min-h-full gap-4 rounded-xl border bg-background p-4 md:p-5 shadow-sm">
        <WizardHeader
          title={eventId ? "Edit Event" : "Create New Event"}
          description={eventId ? "Modify the event details and booked services." : "Fill in the details to schedule a new creative production or client meeting."}
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
          isEditing={!!eventId}
          onNext={handleNext}
          onPrevious={previousStep}
          onDiscard={handleDiscard}
          onSaveDraft={handleSaveDraft}
          onUpdate={handleDirectUpdate}
        />
      </div>
    </FormProvider>
  );
};

export default EventWizard;
