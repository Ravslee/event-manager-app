import { type FC } from 'react';

import { type WizardHeaderProps } from '../../types/wizard.types';

const WizardHeader: FC<WizardHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        {title}
      </h1>

      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default WizardHeader;