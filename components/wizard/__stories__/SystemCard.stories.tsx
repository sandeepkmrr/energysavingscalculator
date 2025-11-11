'use client';

import { useEffect, type ReactNode } from 'react';
import {
  SystemSetup,
  type SystemSetupProps,
} from '@/components/wizard/SystemSetup';
import { WizardProvider, useWizard } from '@/contexts/WizardContext';

const StoryContainer = ({ children }: { children: ReactNode }) => (
  <div className="w-full max-w-6xl bg-daikin-gray-50 p-6">{children}</div>
);

const StoryWrapper = (props: SystemSetupProps) => (
  <WizardProvider>
    <StoryContainer>
      <SystemSetup {...props} />
    </StoryContainer>
  </WizardProvider>
);

const AdvancedWithPrefill = (props: SystemSetupProps) => {
  const { updateFormData } = useWizard();

  useEffect(() => {
    updateFormData({
      baselineSystem: {
        type: 'BE HP',
        capacityTons: 10,
        units: 1,
        maintenanceCostPerYear: 800,
        eer: '10.5',
        ieer: '15.2',
        cop47: '3.2',
        cop17: '2.1',
      },
      compareSystem: {
        type: 'INV HP',
        capacityTons: 10,
        units: 1,
        maintenanceCostPerYear: 800,
        eer: '12.3',
        ieer: '18.4',
        cop47: '3.4',
        cop17: '2.3',
      },
    });
  }, [updateFormData]);

  return (
    <StoryContainer>
      <SystemSetup {...props} />
    </StoryContainer>
  );
};

const systemCardStories = {
  title: 'Wizard/SystemCard',
  component: SystemSetup,
};

export default systemCardStories;
export const Default = () => <StoryWrapper />;
Default.storyName = 'SystemCard.Default';
Default.parameters = {
  docs: {
    description: {
      story:
        'Baseline and Daikin system cards with advanced settings collapsed. Hover or focus the ℹ️ icons to review tooltip content.',
    },
  },
};

export const AdvancedWithCOPs = () => (
  <WizardProvider>
    <AdvancedWithPrefill
      defaultBaselineAdvancedOpen
      defaultCompareAdvancedOpen
    />
  </WizardProvider>
);
AdvancedWithCOPs.storyName = 'SystemCard.AdvancedWithCOPs';
AdvancedWithCOPs.parameters = {
  docs: {
    description: {
      story:
        'Advanced settings expanded by default with representative EER, IEER, and COP values populated for baseline and Daikin inverter systems. Validation helper and error messages surface as values are edited.',
    },
  },
};
