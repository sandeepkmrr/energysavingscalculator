'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_PROJECT, type Project } from '@/lib/mockData';

export interface WizardFormData {
  projectName: string;
  zip: string;
  city: string;
  state: string;
  climateZone: string;
  buildingType: string;
  hoursPerYear: number | '';
  electricRate: number | '';
  gasRate: number | '';
  maintenanceCostPerYear: number | '';
  // System configuration
  baselineSystem: {
    type: string;
    capacityTons: number | '';
    units: number | '';
    maintenanceCostPerYear: number | '';
    eer?: string;
    ieer?: string;
    cop?: string;
  };
  compareSystem: {
    type: string;
    capacityTons: number | '';
    units: number | '';
    maintenanceCostPerYear: number | '';
    eer?: string;
    ieer?: string;
    cop?: string;
  };
  rebate: {
    applyRebate: boolean;
    amount: number | '';
    source: string;
  };
}

interface WizardContextType {
  formData: WizardFormData;
  updateFormData: (data: Partial<WizardFormData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  results: Project['results'] | null;
  setResults: (results: Project['results'] | null) => void;
  resetWizard: () => void;
}

const createDefaultFormData = (): WizardFormData => ({
  projectName: MOCK_PROJECT.project.name,
  zip: MOCK_PROJECT.zip,
  city: MOCK_PROJECT.location.city,
  state: MOCK_PROJECT.location.state,
  climateZone: MOCK_PROJECT.location.climateZone,
  buildingType: MOCK_PROJECT.buildingType,
  hoursPerYear: MOCK_PROJECT.hoursPerYear,
  electricRate: MOCK_PROJECT.electricRate,
  gasRate: '',
  maintenanceCostPerYear: MOCK_PROJECT.maintenanceCostPerYear,
  baselineSystem: {
    type: MOCK_PROJECT.systemBaseline.type,
    capacityTons: MOCK_PROJECT.systemBaseline.capacityTons,
    units: MOCK_PROJECT.systemBaseline.units,
    maintenanceCostPerYear: MOCK_PROJECT.maintenanceCostPerYear,
  },
  compareSystem: {
    type: MOCK_PROJECT.systemCompare.type,
    capacityTons: MOCK_PROJECT.systemCompare.capacityTons,
    units: MOCK_PROJECT.systemCompare.units,
    maintenanceCostPerYear: MOCK_PROJECT.maintenanceCostPerYear,
  },
  rebate: {
    applyRebate: true,
    amount: MOCK_PROJECT.rebate.amount,
    source: MOCK_PROJECT.rebate.source,
  },
});

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<WizardFormData>(() =>
    createDefaultFormData()
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState<Project['results'] | null>(null);

  const updateFormData = (data: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetWizard = () => {
    setFormData(createDefaultFormData());
    setResults(null);
    setCurrentStep(1);
  };

  return (
    <WizardContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        results,
        setResults,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
