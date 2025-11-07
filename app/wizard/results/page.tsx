'use client';

import { useMemo } from 'react';
import { WizardLayout } from '@/components/wizard/WizardLayout';
import { ResultsDashboard } from '@/components/wizard/ResultsDashboard';
import { useWizard } from '@/contexts/WizardContext';
import { MOCK_PROJECT, type Project } from '@/lib/mockData';

export default function ResultsPage() {
  const { formData, results } = useWizard();

  const project: Project = useMemo(() => {
    const baselineCapacity =
      typeof formData.baselineSystem.capacityTons === 'number'
        ? formData.baselineSystem.capacityTons
        : Number(formData.baselineSystem.capacityTons) ||
          MOCK_PROJECT.systemBaseline.capacityTons;

    const compareCapacity =
      typeof formData.compareSystem.capacityTons === 'number'
        ? formData.compareSystem.capacityTons
        : Number(formData.compareSystem.capacityTons) ||
          MOCK_PROJECT.systemCompare.capacityTons;

    return {
      project: {
        name: formData.projectName || MOCK_PROJECT.project.name,
      },
      zip: formData.zip || MOCK_PROJECT.zip,
      location: {
        city: formData.city || MOCK_PROJECT.location.city,
        state: formData.state || MOCK_PROJECT.location.state,
        climateZone: formData.climateZone || MOCK_PROJECT.location.climateZone,
      },
      buildingType: formData.buildingType || MOCK_PROJECT.buildingType,
      hoursPerYear:
        typeof formData.hoursPerYear === 'number'
          ? formData.hoursPerYear
          : MOCK_PROJECT.hoursPerYear,
      systemBaseline: {
        type: formData.baselineSystem.type || MOCK_PROJECT.systemBaseline.type,
        capacityTons: baselineCapacity,
        units:
          typeof formData.baselineSystem.units === 'number'
            ? formData.baselineSystem.units
            : Number(formData.baselineSystem.units) ||
              MOCK_PROJECT.systemBaseline.units,
      },
      systemCompare: {
        type: formData.compareSystem.type || MOCK_PROJECT.systemCompare.type,
        capacityTons: compareCapacity,
        units:
          typeof formData.compareSystem.units === 'number'
            ? formData.compareSystem.units
            : Number(formData.compareSystem.units) ||
              MOCK_PROJECT.systemCompare.units,
      },
      electricRate:
        typeof formData.electricRate === 'number'
          ? formData.electricRate
          : MOCK_PROJECT.electricRate,
      maintenanceCostPerYear:
        typeof formData.maintenanceCostPerYear === 'number'
          ? formData.maintenanceCostPerYear
          : MOCK_PROJECT.maintenanceCostPerYear,
      rebate: {
        source: formData.rebate.source,
        amount:
          formData.rebate.applyRebate &&
          typeof formData.rebate.amount === 'number'
            ? formData.rebate.amount
            : 0,
      },
      analysisPeriodYears: MOCK_PROJECT.analysisPeriodYears,
      results: results ?? MOCK_PROJECT.results,
    };
  }, [formData, results]);

  return (
    <WizardLayout currentStep={3}>
      <ResultsDashboard project={project} results={project.results} />
    </WizardLayout>
  );
}
