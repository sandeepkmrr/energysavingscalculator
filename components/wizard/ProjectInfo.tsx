'use client';

import { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { FormField, ChipGroup } from '@/components/shared';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/shared/Select';
import { NumberInput } from '@/components/shared/NumberInput';
import { PrimaryButton } from '@/components/shared/PrimaryButton';
import { lookupZip } from '@/lib/mockData';
import { useRouter, useSearchParams } from 'next/navigation';

const BUILDING_TYPES = [
  { value: 'School', label: 'School' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Hotel', label: 'Hotel' },
  { value: 'Restaurant', label: 'Restaurant' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Government', label: 'Government' },
  { value: 'Office', label: 'Office' },
  { value: 'Other', label: 'Other' },
];

const HOURS_PRESETS = [
  { label: '3,500 hrs', value: 3500 },
  { label: '4,000 hrs', value: 4000 },
  { label: '5,000 hrs', value: 5000 },
];

export function ProjectInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formData, updateFormData } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isZipLookupLoading, setIsZipLookupLoading] = useState(false);

  // Handle ZIP code from URL parameter (from landing page)
  useEffect(() => {
    const zipFromUrl = searchParams.get('zip');
    if (zipFromUrl && !formData.zip) {
      updateFormData({ zip: zipFromUrl });
      handleZipBlur(zipFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleZipBlur = async (zip: string) => {
    if (!zip.trim()) {
      updateFormData({ city: '', state: '', climateZone: '' });
      return;
    }

    setIsZipLookupLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const result = lookupZip(zip);
      if (result) {
        updateFormData({
          city: result.city,
          state: result.state,
          climateZone: result.climateZone,
        });
        setErrors((prev) => ({ ...prev, zip: '' }));
      } else {
        updateFormData({ city: '', state: '', climateZone: '' });
        setErrors((prev) => ({
          ...prev,
          zip: 'ZIP code not found. Please enter a valid ZIP code.',
        }));
      }
      setIsZipLookupLoading(false);
    }, 300);
  };

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'zip':
        if (!value || !value.trim()) {
          return 'ZIP code is required';
        }
        return '';
      case 'buildingType':
        if (!value) {
          return 'Building type is required';
        }
        return '';
      case 'electricRate':
        if (value === '' || value === null || value === undefined) {
          return 'Electricity rate is required';
        }
        if (typeof value === 'number' && value <= 0) {
          return 'Electricity rate must be greater than 0';
        }
        return '';
      default:
        return '';
    }
  };

  const handleFieldChange = (name: string, value: any) => {
    updateFormData({ [name]: value });
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePresetClick = (hours: number) => {
    handleFieldChange('hoursPerYear', hours);
  };

  const isFormValid = () => {
    const requiredFields = {
      zip: formData.zip,
      buildingType: formData.buildingType,
      electricRate: formData.electricRate,
    };

    return Object.entries(requiredFields).every(([key, value]) => {
      if (key === 'electricRate') {
        if (value === '' || value === null || value === undefined) {
          return false;
        }
        const numericValue = typeof value === 'number' ? value : Number(value);
        return Number.isFinite(numericValue) && numericValue > 0;
      }
      return value && value.toString().trim() !== '';
    });
  };

  const handleNext = () => {
    // Validate all required fields
    const newErrors: Record<string, string> = {};
    newErrors.zip = validateField('zip', formData.zip);
    newErrors.buildingType = validateField(
      'buildingType',
      formData.buildingType
    );
    newErrors.electricRate = validateField(
      'electricRate',
      formData.electricRate
    );

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      router.push('/wizard/system');
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="space-y-6"
    >
      <h2 className="text-headline text-brand-deep font-semibold mb-6">
        Project Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Name */}
        <FormField label="Project Name" htmlFor="project-name">
          <Input
            id="project-name"
            value={formData.projectName}
            onChange={(e) => handleFieldChange('projectName', e.target.value)}
            placeholder="Enter project name"
          />
        </FormField>

        {/* ZIP Code */}
        <FormField
          label="ZIP Code"
          htmlFor="zip-code"
          required
          error={errors.zip}
          description="Enter ZIP code to auto-populate location"
        >
          <Input
            id="zip-code"
            value={formData.zip}
            onChange={(e) => handleFieldChange('zip', e.target.value)}
            onBlur={(e) => handleZipBlur(e.target.value)}
            placeholder="75001"
            disabled={isZipLookupLoading}
            aria-describedby={
              errors.zip ? 'zip-code-error' : 'zip-code-description'
            }
          />
        </FormField>

        {/* City (Read-only) */}
        <FormField label="City" htmlFor="city">
          <Input
            id="city"
            value={formData.city}
            readOnly
            className="bg-daikin-gray-50 cursor-not-allowed"
            aria-label="City (auto-populated from ZIP code)"
          />
        </FormField>

        {/* State (Read-only) */}
        <FormField label="State" htmlFor="state">
          <Input
            id="state"
            value={formData.state}
            readOnly
            className="bg-daikin-gray-50 cursor-not-allowed"
            aria-label="State (auto-populated from ZIP code)"
          />
        </FormField>

        {/* Climate Zone (Read-only) */}
        <FormField label="Climate Zone" htmlFor="climate-zone">
          <Input
            id="climate-zone"
            value={formData.climateZone}
            readOnly
            className="bg-daikin-gray-50 cursor-not-allowed"
            aria-label="Climate Zone (auto-populated from ZIP code)"
          />
        </FormField>

        {/* Building Type */}
        <FormField
          label="Building Type"
          htmlFor="building-type"
          required
          error={errors.buildingType}
        >
          <Select
            id="building-type"
            value={formData.buildingType}
            onValueChange={(value) => handleFieldChange('buildingType', value)}
            options={BUILDING_TYPES}
            placeholder="Select building type"
            aria-describedby={
              errors.buildingType ? 'building-type-error' : undefined
            }
          />
        </FormField>

        {/* Annual Operating Hours */}
        <FormField
          label="Annual Operating Hours"
          htmlFor="hours-per-year"
          description="Typical operating hours per year"
        >
          <div className="space-y-3">
            <NumberInput
              id="hours-per-year"
              value={formData.hoursPerYear || ''}
              onChange={(e) =>
                handleFieldChange(
                  'hoursPerYear',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              min={0}
              step={100}
              placeholder="3500"
            />
            <ChipGroup
              chips={HOURS_PRESETS}
              selectedValue={formData.hoursPerYear || undefined}
              onChange={(value) => handleFieldChange('hoursPerYear', value)}
            />
          </div>
        </FormField>

        {/* Electricity Rate */}
        <FormField
          label="Electricity Rate ($/kWh)"
          htmlFor="electric-rate"
          required
          error={errors.electricRate}
          description="Cost per kilowatt-hour"
        >
          <NumberInput
            id="electric-rate"
            value={formData.electricRate || ''}
            onChange={(e) =>
              handleFieldChange(
                'electricRate',
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            min={0}
            step={0.01}
            placeholder="0.12"
            aria-describedby={
              errors.electricRate
                ? 'electric-rate-error'
                : 'electric-rate-description'
            }
          />
        </FormField>

        {/* Gas Rate (Optional) */}
        <FormField
          label="Gas Rate ($/therm)"
          htmlFor="gas-rate"
          description="Optional: Cost per therm"
        >
          <NumberInput
            id="gas-rate"
            value={formData.gasRate || ''}
            onChange={(e) =>
              handleFieldChange(
                'gasRate',
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            min={0}
            step={0.01}
            placeholder="1.20"
          />
        </FormField>

        {/* Maintenance Cost (Optional) */}
        <FormField
          label="Maintenance Cost ($/year)"
          htmlFor="maintenance-cost"
          description="Optional: Annual maintenance cost"
        >
          <NumberInput
            id="maintenance-cost"
            value={formData.maintenanceCostPerYear || ''}
            onChange={(e) =>
              handleFieldChange(
                'maintenanceCostPerYear',
                e.target.value === '' ? '' : Number(e.target.value)
              )
            }
            min={0}
            step={100}
            placeholder="800"
          />
        </FormField>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t">
        <PrimaryButton
          type="submit"
          disabled={!isFormValid()}
          aria-label="Next - Go to System Configuration step"
        >
          Next — System Configuration
        </PrimaryButton>
      </div>
    </form>
  );
}
