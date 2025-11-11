'use client';

import { useState, useEffect } from 'react';
import { useWizard } from '@/contexts/WizardContext';
import type { WizardFormData } from '@/contexts/WizardContext';
import { Card } from '@/components/shared/Card';
import { FormField } from '@/components/shared/FormField';
import { Select } from '@/components/shared/Select';
import { NumberInput } from '@/components/shared/NumberInput';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PrimaryButton, SecondaryButton } from '@/components/shared';
import { calculateSavings } from '@/lib/mockData';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SYSTEM_TYPES = [
  { value: 'BE HP', label: 'BE HP' },
  { value: 'BE AC', label: 'BE AC' },
  { value: 'HE HP', label: 'HE HP' },
  { value: 'HE AC', label: 'HE AC' },
  { value: 'BE GE', label: 'BE GE' },
  { value: 'HE GE', label: 'HE GE' },
];

const CAPACITY_OPTIONS = [
  { value: '3', label: '3' },
  { value: '5', label: '5' },
  { value: '7.5', label: '7.5' },
  { value: '10', label: '10' },
  { value: '12.5', label: '12.5' },
  { value: '15', label: '15' },
  { value: '20', label: '20' },
  { value: '25', label: '25' },
];

export interface SystemSetupProps {
  onCalculate?: (results: any) => void;
  defaultBaselineAdvancedOpen?: boolean;
  defaultCompareAdvancedOpen?: boolean;
}

export function SystemSetup({
  onCalculate,
  defaultBaselineAdvancedOpen,
  defaultCompareAdvancedOpen,
}: SystemSetupProps) {
  const router = useRouter();
  const { formData, updateFormData, setResults } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvancedBaseline, setShowAdvancedBaseline] = useState(
    defaultBaselineAdvancedOpen ?? true
  );
  const [showAdvancedCompare, setShowAdvancedCompare] = useState(
    defaultCompareAdvancedOpen ?? true
  );
  const [showRebate, setShowRebate] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  const baselineCapacityValue =
    formData.baselineSystem.capacityTons === '' ||
    formData.baselineSystem.capacityTons === null ||
    formData.baselineSystem.capacityTons === undefined
      ? ''
      : String(formData.baselineSystem.capacityTons);

  const compareCapacityValue =
    formData.compareSystem.capacityTons === '' ||
    formData.compareSystem.capacityTons === null ||
    formData.compareSystem.capacityTons === undefined
      ? ''
      : String(formData.compareSystem.capacityTons);

  const hasValue = (value?: string | number | null) => {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return true;
  };

  const baselineCop47HelperText =
    !hasValue(formData.baselineSystem.cop47) &&
    hasValue(formData.baselineSystem.cop17) &&
    !errors['baseline-cop47']
      ? 'No COP @47°F provided — system will use COP @17°F for heating calculations unless overridden.'
      : undefined;

  const compareCop47HelperText =
    !hasValue(formData.compareSystem.cop47) &&
    hasValue(formData.compareSystem.cop17) &&
    !errors['compare-cop47']
      ? 'No COP @47°F provided — system will use COP @17°F for heating calculations unless overridden.'
      : undefined;

  // Sync compare system capacity with baseline
  useEffect(() => {
    if (formData.baselineSystem.capacityTons !== '') {
      updateFormData({
        compareSystem: {
          ...formData.compareSystem,
          capacityTons: formData.baselineSystem.capacityTons,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.baselineSystem.capacityTons]);

  const handleBaselineChange = (field: string, value: any) => {
    const updatedBaseline = {
      ...formData.baselineSystem,
      [field]: value,
    };
    updateFormData({ baselineSystem: updatedBaseline });

    // Clear error for this field
    if (errors[`baseline-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`baseline-${field}`];
        return newErrors;
      });
    }
  };

  const handleCompareChange = (field: string, value: any) => {
    const updatedCompare = {
      ...formData.compareSystem,
      [field]: value,
    };
    updateFormData({ compareSystem: updatedCompare });

    if (errors[`compare-${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`compare-${field}`];
        return newErrors;
      });
    }
  };

  const handleCopChange = (
    system: 'baselineSystem' | 'compareSystem',
    field: 'cop47' | 'cop17',
    rawValue: string
  ) => {
    const trimmedValue = rawValue;
    const targetSystem =
      system === 'baselineSystem'
        ? formData.baselineSystem
        : formData.compareSystem;

    const updatedSystem = {
      ...targetSystem,
      [field]: trimmedValue,
    };

    updateFormData({ [system]: updatedSystem } as Partial<WizardFormData>);

    const errorKeyPrefix = system === 'baselineSystem' ? 'baseline' : 'compare';
    const errorKey = `${errorKeyPrefix}-${field}`;
    const valueToCheck = trimmedValue.trim();

    if (valueToCheck === '') {
      setErrors((prev) => {
        if (!prev[errorKey]) {
          return prev;
        }
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
      return;
    }

    const numericValue = Number(valueToCheck);

    if (!Number.isFinite(numericValue)) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: 'Please enter a valid numeric COP (e.g., 3.2).',
      }));
      return;
    }

    if (numericValue <= 0) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: 'COP must be greater than zero.',
      }));
      return;
    }

    setErrors((prev) => {
      if (!prev[errorKey]) {
        return prev;
      }
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  };

  const isFormValid = (): boolean => {
    const hasCapacity =
      formData.baselineSystem.capacityTons !== '' &&
      formData.baselineSystem.capacityTons !== null &&
      formData.baselineSystem.capacityTons !== undefined;

    const hasValidUnits =
      formData.baselineSystem.units !== '' &&
      formData.baselineSystem.units !== null &&
      formData.baselineSystem.units !== undefined &&
      Number(formData.baselineSystem.units) >= 1;

    return hasCapacity && hasValidUnits;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (
      formData.baselineSystem.capacityTons === '' ||
      formData.baselineSystem.capacityTons === null ||
      formData.baselineSystem.capacityTons === undefined
    ) {
      newErrors['baseline-capacityTons'] = 'Capacity is required';
    }

    if (
      formData.baselineSystem.units === '' ||
      formData.baselineSystem.units === null ||
      formData.baselineSystem.units === undefined ||
      Number(formData.baselineSystem.units) < 1
    ) {
      newErrors['baseline-units'] = 'Units must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsCalculating(true);

    try {
      const results = await calculateSavings({
        project: { name: formData.projectName },
        zip: formData.zip,
        location: {
          city: formData.city,
          state: formData.state,
          climateZone: formData.climateZone,
        },
        buildingType: formData.buildingType,
        hoursPerYear:
          typeof formData.hoursPerYear === 'number'
            ? formData.hoursPerYear
            : 3500,
        systemBaseline: {
          type: formData.baselineSystem.type,
          capacityTons:
            typeof formData.baselineSystem.capacityTons === 'number'
              ? formData.baselineSystem.capacityTons
              : 10,
          units:
            typeof formData.baselineSystem.units === 'number'
              ? formData.baselineSystem.units
              : 1,
        },
        systemCompare: {
          type: formData.compareSystem.type,
          capacityTons:
            typeof formData.compareSystem.capacityTons === 'number'
              ? formData.compareSystem.capacityTons
              : 10,
          units:
            typeof formData.compareSystem.units === 'number'
              ? formData.compareSystem.units
              : 1,
        },
        electricRate:
          typeof formData.electricRate === 'number'
            ? formData.electricRate
            : 0.12,
        maintenanceCostPerYear:
          typeof formData.maintenanceCostPerYear === 'number'
            ? formData.maintenanceCostPerYear
            : 800,
        rebate: {
          source: formData.rebate.source,
          amount:
            formData.rebate.applyRebate &&
            typeof formData.rebate.amount === 'number'
              ? formData.rebate.amount
              : 0,
        },
      });

      setResults(results);

      if (onCalculate) {
        onCalculate(results);
      } else {
        // Default navigation to results page
        router.push('/wizard/results');
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setErrors({ calculate: 'An error occurred during calculation' });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBack = () => {
    router.push('/wizard/project');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-headline text-primary font-semibold">
        System Configuration
      </h2>

      {/* System Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baseline System Card */}
        <Card title="Baseline System" className="h-fit">
          <div className="space-y-4">
            <FormField label="System Type" htmlFor="baseline-type" required>
              <Select
                id="baseline-type"
                value={formData.baselineSystem.type}
                onValueChange={(value) => handleBaselineChange('type', value)}
                options={SYSTEM_TYPES}
                placeholder="Select system type"
              />
            </FormField>

            <FormField
              label="Capacity (tons)"
              htmlFor="baseline-capacity"
              required
              error={errors['baseline-capacityTons']}
            >
              <Select
                id="baseline-capacity"
                value={baselineCapacityValue}
                onValueChange={(value) =>
                  handleBaselineChange('capacityTons', Number(value))
                }
                options={CAPACITY_OPTIONS}
                placeholder="Select capacity"
                aria-describedby={
                  errors['baseline-capacityTons']
                    ? 'baseline-capacity-error'
                    : undefined
                }
              />
            </FormField>

            <FormField
              label="Units"
              htmlFor="baseline-units"
              required
              error={errors['baseline-units']}
              description="Number of units"
            >
              <NumberInput
                id="baseline-units"
                value={formData.baselineSystem.units}
                onChange={(e) =>
                  handleBaselineChange(
                    'units',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                min={1}
                step={1}
                placeholder="1"
                aria-describedby={
                  errors['baseline-units']
                    ? 'baseline-units-error'
                    : 'baseline-units-description'
                }
              />
            </FormField>

            <FormField
              label="Maintenance Cost ($/year)"
              htmlFor="baseline-maintenance"
            >
              <NumberInput
                id="baseline-maintenance"
                value={formData.baselineSystem.maintenanceCostPerYear}
                onChange={(e) =>
                  handleBaselineChange(
                    'maintenanceCostPerYear',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                min={0}
                step={100}
                placeholder="800"
              />
            </FormField>

            {/* Advanced Toggle */}
            <div className="pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowAdvancedBaseline(!showAdvancedBaseline)}
                className="flex items-center justify-between w-full text-sm text-daikin-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
                aria-expanded={showAdvancedBaseline}
                aria-label="Toggle advanced settings for baseline system"
              >
                <span>Advanced Settings</span>
                {showAdvancedBaseline ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showAdvancedBaseline && (
                <div
                  className="mt-4 space-y-4"
                  role="region"
                  aria-label="Advanced settings for baseline system"
                >
                  <p className="text-xs text-daikin-gray-500">
                    Enter COP values if available. COP @17°F is recommended for
                    cold-climate analyses (Climate Zones 5+).
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="EER" htmlFor="baseline-eer">
                      <Input
                        id="baseline-eer"
                        value={formData.baselineSystem.eer || ''}
                        onChange={(e) =>
                          handleBaselineChange('eer', e.target.value)
                        }
                        placeholder="Enter EER"
                      />
                    </FormField>

                    <FormField label="IEER" htmlFor="baseline-ieer">
                      <Input
                        id="baseline-ieer"
                        value={formData.baselineSystem.ieer || ''}
                        onChange={(e) =>
                          handleBaselineChange('ieer', e.target.value)
                        }
                        placeholder="Enter IEER"
                      />
                    </FormField>

                    {/* NOTE for backend: prefer COP @47°F for standard heating; COP @17°F used for low-ambient adjustments. If only cop_17 is present, front-end will surface helper text indicating cop_17 will be used as fallback. */}
                    <FormField
                      label={
                        <span className="flex items-center text-sm font-medium text-daikin-gray-600">
                          COP @ 47°F (Rated Heating)
                          <InfoTooltip
                            id="baseline-cop47-tooltip"
                            content="COP @47°F: Coefficient of Performance measured at AHRI standard heating condition (47°F). Used for standard-season heating performance."
                            aria-label="Details about COP at 47 degrees Fahrenheit"
                          />
                        </span>
                      }
                      htmlFor="baseline-cop_47"
                      helperText={baselineCop47HelperText}
                      helperTone="informational"
                      error={errors['baseline-cop47']}
                      describedByIds={['baseline-cop47-tooltip']}
                    >
                      <NumberInput
                        name="cop_47"
                        value={formData.baselineSystem.cop47 || ''}
                        onChange={(event) =>
                          handleCopChange(
                            'baselineSystem',
                            'cop47',
                            event.target.value
                          )
                        }
                        placeholder="e.g., 3.2"
                        inputMode="decimal"
                        step={0.1}
                        min={0}
                        aria-label="COP at 47 degrees Fahrenheit (rated heating condition)"
                        data-test="cop-47-input"
                      />
                    </FormField>

                    <FormField
                      label={
                        <span className="flex items-center text-sm font-medium text-daikin-gray-600">
                          COP @ 17°F (Low-Ambient Heating)
                          <InfoTooltip
                            id="baseline-cop17-tooltip"
                            content="COP @17°F: Coefficient of Performance measured at low ambient temperature. Used for cold-climate performance and part-load adjustments."
                            aria-label="Details about COP at 17 degrees Fahrenheit"
                          />
                        </span>
                      }
                      htmlFor="baseline-cop_17"
                      error={errors['baseline-cop17']}
                      describedByIds={['baseline-cop17-tooltip']}
                    >
                      <NumberInput
                        name="cop_17"
                        value={formData.baselineSystem.cop17 || ''}
                        onChange={(event) =>
                          handleCopChange(
                            'baselineSystem',
                            'cop17',
                            event.target.value
                          )
                        }
                        placeholder="e.g., 2.1"
                        inputMode="decimal"
                        step={0.1}
                        min={0}
                        aria-label="COP at 17 degrees Fahrenheit (low ambient condition)"
                        data-test="cop-17-input"
                      />
                    </FormField>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Daikin Inverter System Card */}
        <Card title="Daikin Inverter (INV HP)" className="h-fit">
          <div className="space-y-4">
            <p className="text-xs text-daikin-gray-500 mb-4">
              Data source: Daikin Engineering Dataset (mock)
            </p>

            <FormField label="System Type" htmlFor="compare-type">
              <Input
                id="compare-type"
                value={formData.compareSystem.type}
                readOnly
                className="bg-daikin-gray-50 cursor-not-allowed"
                aria-label="System type (auto-filled)"
              />
            </FormField>

            <FormField label="Capacity (tons)" htmlFor="compare-capacity">
              <Input
                id="compare-capacity"
                value={compareCapacityValue}
                readOnly
                className="bg-daikin-gray-50 cursor-not-allowed"
                aria-label="Capacity (matches baseline)"
              />
            </FormField>

            <FormField label="Units" htmlFor="compare-units">
              <NumberInput
                id="compare-units"
                value={formData.compareSystem.units}
                onChange={(e) =>
                  handleCompareChange(
                    'units',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                min={1}
                step={1}
                placeholder="1"
              />
            </FormField>

            <FormField
              label="Maintenance Cost ($/year)"
              htmlFor="compare-maintenance"
            >
              <NumberInput
                id="compare-maintenance"
                value={formData.compareSystem.maintenanceCostPerYear}
                onChange={(e) =>
                  handleCompareChange(
                    'maintenanceCostPerYear',
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                min={0}
                step={100}
                placeholder="800"
              />
            </FormField>

            {/* Advanced Toggle */}
            <div className="pt-2 border-t">
              <button
                type="button"
                onClick={() => setShowAdvancedCompare(!showAdvancedCompare)}
                className="flex items-center justify-between w-full text-sm text-daikin-gray-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-2 py-1"
                aria-expanded={showAdvancedCompare}
                aria-label="Toggle advanced settings for Daikin Inverter system"
              >
                <span>Advanced Settings</span>
                {showAdvancedCompare ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showAdvancedCompare && (
                <div
                  className="mt-4 space-y-4"
                  role="region"
                  aria-label="Advanced settings for Daikin inverter system"
                >
                  <p className="text-xs text-daikin-gray-500">
                    Enter COP values if available. COP @17°F is recommended for
                    cold-climate analyses (Climate Zones 5+).
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="EER" htmlFor="compare-eer">
                      <Input
                        id="compare-eer"
                        value={formData.compareSystem.eer || ''}
                        onChange={(e) =>
                          handleCompareChange('eer', e.target.value)
                        }
                        placeholder="Enter EER"
                      />
                    </FormField>

                    <FormField label="IEER" htmlFor="compare-ieer">
                      <Input
                        id="compare-ieer"
                        value={formData.compareSystem.ieer || ''}
                        onChange={(e) =>
                          handleCompareChange('ieer', e.target.value)
                        }
                        placeholder="Enter IEER"
                      />
                    </FormField>

                    <FormField
                      label={
                        <span className="flex items-center text-sm font-medium text-daikin-gray-600">
                          COP @ 47°F (Rated Heating)
                          <InfoTooltip
                            id="compare-cop47-tooltip"
                            content="COP @47°F: Coefficient of Performance measured at AHRI standard heating condition (47°F). Used for standard-season heating performance."
                            aria-label="Details about COP at 47 degrees Fahrenheit"
                          />
                        </span>
                      }
                      htmlFor="compare-cop_47"
                      helperText={compareCop47HelperText}
                      helperTone="informational"
                      error={errors['compare-cop47']}
                      describedByIds={['compare-cop47-tooltip']}
                    >
                      <NumberInput
                        name="cop_47"
                        value={formData.compareSystem.cop47 || ''}
                        onChange={(event) =>
                          handleCopChange(
                            'compareSystem',
                            'cop47',
                            event.target.value
                          )
                        }
                        placeholder="e.g., 3.2"
                        inputMode="decimal"
                        step={0.1}
                        min={0}
                        aria-label="COP at 47 degrees Fahrenheit (rated heating condition)"
                        data-test="cop-47-input"
                      />
                    </FormField>

                    <FormField
                      label={
                        <span className="flex items-center text-sm font-medium text-daikin-gray-600">
                          COP @ 17°F (Low-Ambient Heating)
                          <InfoTooltip
                            id="compare-cop17-tooltip"
                            content="COP @17°F: Coefficient of Performance measured at low ambient temperature. Used for cold-climate performance and part-load adjustments."
                            aria-label="Details about COP at 17 degrees Fahrenheit"
                          />
                        </span>
                      }
                      htmlFor="compare-cop_17"
                      error={errors['compare-cop17']}
                      describedByIds={['compare-cop17-tooltip']}
                    >
                      <NumberInput
                        name="cop_17"
                        value={formData.compareSystem.cop17 || ''}
                        onChange={(event) =>
                          handleCopChange(
                            'compareSystem',
                            'cop17',
                            event.target.value
                          )
                        }
                        placeholder="e.g., 2.1"
                        inputMode="decimal"
                        step={0.1}
                        min={0}
                        aria-label="COP at 17 degrees Fahrenheit (low ambient condition)"
                        data-test="cop-17-input"
                      />
                    </FormField>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Rebate Section */}
      <Card className="pt-5">
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setShowRebate(!showRebate)}
            className="flex items-center justify-between w-full text-left"
            aria-expanded={showRebate}
            aria-label="Toggle rebate section"
          >
            <h3 className="text-lg font-semibold text-primary">Rebate</h3>
            {showRebate ? (
              <ChevronUp className="w-5 h-5 text-daikin-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-daikin-gray-500" />
            )}
          </button>

          {showRebate && (
            <div
              className="space-y-4 pt-2"
              role="region"
              aria-label="Rebate settings"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="apply-rebate"
                  checked={formData.rebate.applyRebate}
                  onCheckedChange={(checked) =>
                    updateFormData({
                      rebate: {
                        ...formData.rebate,
                        applyRebate: checked === true,
                      },
                    })
                  }
                  aria-label="Apply rebate to calculation"
                />
                <label
                  htmlFor="apply-rebate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Apply Rebate
                </label>
              </div>

              {formData.rebate.applyRebate && (
                <FormField label="Rebate Amount ($)" htmlFor="rebate-amount">
                  <NumberInput
                    id="rebate-amount"
                    value={formData.rebate.amount}
                    onChange={(e) =>
                      updateFormData({
                        rebate: {
                          ...formData.rebate,
                          amount:
                            e.target.value === '' ? '' : Number(e.target.value),
                        },
                      })
                    }
                    min={0}
                    step={100}
                    placeholder="1500"
                  />
                </FormField>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {errors.calculate && (
        <div
          className="p-4 bg-destructive/10 border border-destructive rounded-md text-sm text-destructive"
          role="alert"
        >
          {errors.calculate}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <SecondaryButton
          type="button"
          onClick={handleBack}
          aria-label="Back to Project Info step"
        >
          Back to Project Info
        </SecondaryButton>
        <PrimaryButton
          type="button"
          onClick={handleCalculate}
          disabled={isCalculating || !isFormValid()}
          aria-label="Calculate savings and proceed to results"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calculating...
            </>
          ) : (
            'Calculate Savings'
          )}
        </PrimaryButton>
      </div>
    </div>
  );
}
