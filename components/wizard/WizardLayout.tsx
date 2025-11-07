'use client';

import { Header } from '@/components/shared/Header';
import { Stepper } from '@/components/shared/Stepper';
import { SustainabilityBanner, CorporateFooter } from '@/components/shared';
import { ReactNode, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';

export interface WizardLayoutProps {
  children: ReactNode;
  currentStep: number;
}

const WIZARD_STEPS = [
  'Step 1: Project Info',
  'Step 2: System Configuration',
  'Step 3: Results',
];

export function WizardLayout({ children, currentStep }: WizardLayoutProps) {
  const { setCurrentStep } = useWizard();

  useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-soft">
            <Stepper steps={WIZARD_STEPS} currentStep={currentStep} />
          </div>
          <div className="bg-white p-6 rounded-xl shadow-soft">{children}</div>
        </div>
      </main>
      <SustainabilityBanner />
      <CorporateFooter />
    </div>
  );
}
