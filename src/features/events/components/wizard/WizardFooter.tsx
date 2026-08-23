import { type FC } from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type WizardFooterProps } from "../../types/wizard.types";

const WizardFooter: FC<WizardFooterProps> = ({
  isFirstStep,
  isLastStep,
  isEditing = false,
  onNext,
  onPrevious,
  onDiscard,
  onSaveDraft,
  onUpdate,
}) => {
  return (
    <div className="flex items-center justify-between border-t border-border/60 pt-3 mt-0.5 gap-2">
      {/* Left-aligned cancel button */}
      <Button
        type="button"
        variant="outline"
        onClick={onDiscard}
        className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl text-foreground hover:bg-accent/40 shrink-0"
      >
        Cancel
      </Button>

      {/* Right-aligned button group */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl gap-1 shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back
          </Button>
        )}

        {/* Save button for instant update on intermediate steps when editing */}
        {isEditing && !isLastStep && onUpdate && (
          <Button
            type="button"
            onClick={onUpdate}
            className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 gap-1 shrink-0"
          >
            <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Save
          </Button>
        )}

        {/* Save button on last step */}
        {isLastStep && (
          <Button
            type="button"
            onClick={onNext}
            className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 gap-1 shrink-0"
          >
            <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Save
          </Button>
        )}

        {/* Next button on intermediate steps */}
        {!isLastStep && (
          <Button
            type="button"
            onClick={onNext}
            className="h-8 sm:h-9 px-2.5 sm:px-4 text-xs sm:text-sm font-semibold rounded-xl gap-1 shrink-0"
          >
            Next
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WizardFooter;
