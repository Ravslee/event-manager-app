import { type FC } from 'react';

import { type WizardHeaderProps } from '../../types/wizard.types';

const WizardHeader: FC<WizardHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="space-y-0.5 sm:space-y-1">
      <h1 className="text-base sm:text-2xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>

      {description && (
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
          {description}
        </p>
      )}
    </div>
  );
};

export default WizardHeader;