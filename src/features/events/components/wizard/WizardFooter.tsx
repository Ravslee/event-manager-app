import { type FC } from "react";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type WizardFooterProps } from "../../types/wizard.types";

const WizardFooter: FC<WizardFooterProps> = ({
  isFirstStep,
  isLastStep,
  onNext,
  onPrevious,
  onDiscard,
  onSaveDraft,
}) => {
  return (
    <div className="flex items-center justify-between border-t border-border pt-6">
      {/* Left-aligned discard button */}
      <Button
        type="button"
        variant="outline"
        onClick={onDiscard}
        className="text-foreground hover:bg-accent/40"
      >
        Discard Changes
      </Button>

      {/* Right-aligned button group */}
      <div className="flex items-center gap-3">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}

        {isLastStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="border-primary text-primary hover:bg-primary/5 gap-1.5"
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
        )}

        <Button
          type="button"
          onClick={onNext}
          className={isLastStep ? "bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5" : "gap-1.5"}
        >
          {isLastStep ? (
            <>
              Create Event
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WizardFooter;
