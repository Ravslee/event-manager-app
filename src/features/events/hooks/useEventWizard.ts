import { useCallback, useMemo, useState } from "react";

import {
  FIRST_STEP,
  LAST_STEP,
  WIZARD_STEPS,
} from "../constants/wizard.constants";

interface UseEventWizardReturn {
  currentStep: number;
  currentStepConfig: (typeof WIZARD_STEPS)[number];
  steps: typeof WIZARD_STEPS;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
}

export const useEventWizard = (
  initialStep: number = FIRST_STEP,
): UseEventWizardReturn => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, LAST_STEP));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, FIRST_STEP));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= FIRST_STEP && step <= LAST_STEP) {
      setCurrentStep(step);
    }
  }, []);

  const currentStepConfig = useMemo(() => {
    return WIZARD_STEPS.find((step) => step.id === currentStep)!;
  }, [currentStep]);

  return {
    currentStep,
    currentStepConfig,
    steps: WIZARD_STEPS,
    isFirstStep: currentStep === FIRST_STEP,
    isLastStep: currentStep === LAST_STEP,
    nextStep,
    previousStep,
    goToStep,
  };
};
