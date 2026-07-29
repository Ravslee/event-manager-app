import { type FC } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { EventStepperProps } from "../../types/wizard.types";

const EventStepper: FC<EventStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-start justify-between">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isLastStep = index === steps.length - 1;

        return (
          <div key={step.id} className="flex flex-1 items-start">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                  {
                    "border-primary bg-primary text-primary-foreground":
                      isCompleted,
                    "border-primary bg-background text-primary": isActive,
                    "border-border bg-background text-muted-foreground":
                      !isCompleted && !isActive,
                  },
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" strokeWidth={3} />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>

              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>

                {step.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {!isLastStep && (
              <div
                className={cn(
                  "mx-4 mt-5 h-0.5 flex-1 transition-colors duration-200",
                  isCompleted ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EventStepper;
