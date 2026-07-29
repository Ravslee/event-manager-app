import { type FC, type PropsWithChildren } from "react";

const WizardContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-125 rounded-lg border bg-card p-6">{children}</div>
  );
};

export default WizardContent;
