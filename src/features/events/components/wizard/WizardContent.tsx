import { type FC, type PropsWithChildren } from "react";

const WizardContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex-1 min-h-0 rounded-xl border border-border bg-card p-3 sm:p-5">
      {children}
    </div>
  );
};

export default WizardContent;
