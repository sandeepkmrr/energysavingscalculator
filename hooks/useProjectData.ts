'use client';

import { useMemo } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { MOCK_PROJECT, type Project } from '@/lib/mockData';

const parseOptionalNumber = (
  value: string | number | '' | null | undefined
): number | undefined => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return undefined;
    }
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  return undefined;
};

export function useProjectData(): Project {
  const { formData, results } = useWizard();

  return useMemo(() => {
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

    const baselineCop47 = parseOptionalNumber(formData.baselineSystem.cop47);
    const baselineCop17 = parseOptionalNumber(formData.baselineSystem.cop17);
    const compareCop47 = parseOptionalNumber(formData.compareSystem.cop47);
    const compareCop17 = parseOptionalNumber(formData.compareSystem.cop17);

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
        cop47: baselineCop47,
        cop17: baselineCop17,
      },
      systemCompare: {
        type: formData.compareSystem.type || MOCK_PROJECT.systemCompare.type,
        capacityTons: compareCapacity,
        units:
          typeof formData.compareSystem.units === 'number'
            ? formData.compareSystem.units
            : Number(formData.compareSystem.units) ||
              MOCK_PROJECT.systemCompare.units,
        cop47: compareCop47,
        cop17: compareCop17,
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
      energySeries: MOCK_PROJECT.energySeries,
      lifecycleBaselineSeries: MOCK_PROJECT.lifecycleBaselineSeries,
      lifecycleInvSeries: MOCK_PROJECT.lifecycleInvSeries,
    };
  }, [formData, results]);
}
