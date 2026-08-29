import { type FC, type PropsWithChildren } from "react";

const WizardContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex-1 min-h-0 py-2 sm:py-4">
      {children}
    </div>
  );
};

export default WizardContent;
