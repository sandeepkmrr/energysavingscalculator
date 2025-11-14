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
    <div className="min-h-screen flex flex-col bg-page">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white px-8 py-6 rounded-card shadow-card">
            <Stepper steps={WIZARD_STEPS} currentStep={currentStep} />
          </div>
          <div className="bg-white px-8 py-8 rounded-card shadow-card">
            {children}
          </div>
        </div>
      </main>
      <SustainabilityBanner />
      <CorporateFooter />
    </div>
  );
}
