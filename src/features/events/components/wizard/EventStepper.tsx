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
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={cn(
                  "flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all duration-200 shrink-0",
                  {
                    "border-primary bg-primary text-primary-foreground":
                      isCompleted,
                    "border-primary bg-background text-primary font-bold": isActive,
                    "border-border bg-background text-muted-foreground":
                      !isCompleted && !isActive,
                  },
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5 sm:h-5 sm:w-5" strokeWidth={3} />
                ) : (
                  <span className="text-xs sm:text-sm font-extrabold">{step.id}</span>
                )}
              </div>

              <div className="mt-1.5 sm:mt-3 text-center min-w-0">
                <p
                  className={cn(
                    "text-[10px] sm:text-xs md:text-sm font-semibold transition-colors truncate max-w-[70px] sm:max-w-none",
                    isActive ? "text-foreground font-bold" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </p>

                {step.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {!isLastStep && (
              <div
                className={cn(
                  "mx-1 sm:mx-4 mt-3.5 sm:mt-5 h-0.5 flex-1 transition-colors duration-200",
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
