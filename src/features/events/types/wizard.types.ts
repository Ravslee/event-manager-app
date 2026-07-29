import type { ComponentType } from "react";

export interface WizardStep {
  id: number;
  title: string;
  description?: string;
  component: ComponentType;
}

export interface EventWizardProps {
  initialStep?: number;
}

export interface EventStepperProps {
  steps: WizardStep[];
  currentStep: number;
}

export interface WizardHeaderProps {
  title: string;
  description?: string;
}

export interface WizardFooterProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onDiscard?: () => void;
  onSaveDraft?: () => void;
}

export interface WizardContentProps {
  component: ComponentType;
}
