'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bolt, Clock, TrendingUp, Leaf } from 'lucide-react';

import { Card, MetricCard, MetricGrid } from '@/components/shared';
import { PrimaryButton, SecondaryButton } from '@/components/shared';
import { ReportPreviewModal } from '@/components/wizard/ReportPreviewModal';
import { useWizard } from '@/contexts/WizardContext';
import { type Project } from '@/lib/mockData';
import { useRouter } from 'next/navigation';
import { EnergyLineChart } from '@/components/charts/EnergyLineChart';
import { LifecycleAreaChart } from '@/components/charts/LifecycleAreaChart';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const currencyFormatterPrecise = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(target * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

interface ResultsDashboardProps {
  project: Project;
  results: Project['results'];
}

export function ResultsDashboard({ project, results }: ResultsDashboardProps) {
  const router = useRouter();
  const { resetWizard } = useWizard();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [chartsVisible, setChartsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setChartsVisible(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  const energySavingsPercentTarget = useMemo(() => {
    if (!results.baselineAnnualKWh) return 0;
    return (results.annualKWhSavings / results.baselineAnnualKWh) * 100;
  }, [results.baselineAnnualKWh, results.annualKWhSavings]);

  const paybackYears = results.simplePaybackYears;
  const lifecycleSavings = results.lifecycleSavings;
  const co2Reduction = results.co2ReductionTonsPerYear;

  const energyPercent = useCountUp(energySavingsPercentTarget);
  const annualSavings = useCountUp(results.annualCostSavings);
  const paybackValue = useCountUp(paybackYears);
  const lifecycleValue = useCountUp(lifecycleSavings);
  const co2Value = useCountUp(co2Reduction);

  const co2Factor = useMemo(() => {
    if (!results.annualKWhSavings) return 0;
    return results.co2ReductionTonsPerYear / results.annualKWhSavings;
  }, [results.co2ReductionTonsPerYear, results.annualKWhSavings]);

  const baselineCo2 = co2Factor
    ? results.baselineAnnualKWh * co2Factor
    : results.co2ReductionTonsPerYear;
  const compareCo2 = baselineCo2 - results.co2ReductionTonsPerYear;

  const formatCop = (value?: number) =>
    typeof value === 'number' && Number.isFinite(value)
      ? decimalFormatter.format(value)
      : undefined;

  const baselineCop47Value = (() => {
    const formatted47 = formatCop(project.systemBaseline.cop47);
    if (formatted47) {
      return formatted47;
    }
    const fallback17 = formatCop(project.systemBaseline.cop17);
    return fallback17 ? `— (using COP @17°F = ${fallback17})` : '—';
  })();

  const baselineCop17Value = formatCop(project.systemBaseline.cop17) ?? '—';

  const compareCop47Value = (() => {
    const formatted47 = formatCop(project.systemCompare.cop47);
    if (formatted47) {
      return formatted47;
    }
    const fallback17 = formatCop(project.systemCompare.cop17);
    return fallback17 ? `— (using COP @17°F = ${fallback17})` : '—';
  })();

  const compareCop17Value = formatCop(project.systemCompare.cop17) ?? '—';

  const lifecycleYears = project.analysisPeriodYears;
  const baselineEnergyCost = results.baselineAnnualCost * lifecycleYears;
  const compareEnergyCost = results.compareAnnualCost * lifecycleYears;
  const baselineMaintenance =
    Number(project.maintenanceCostPerYear || 0) * lifecycleYears;
  const compareMaintenance = baselineMaintenance * 0.85;
  const baselineCapex = 0;
  const compareCapex = 5000;

  const detailedRows = [
    {
      label: 'Annual Energy (kWh)',
      baseline: results.baselineAnnualKWh,
      compare: results.compareAnnualKWh,
      delta: -results.annualKWhSavings,
      formatter: (value: number) => value.toLocaleString(),
    },
    {
      label: 'Annual Cost ($)',
      baseline: results.baselineAnnualCost,
      compare: results.compareAnnualCost,
      delta: -results.annualCostSavings,
      formatter: (value: number) => currencyFormatterPrecise.format(value),
    },
    {
      label: 'Payback (years)',
      baseline: results.simplePaybackYears,
      compare: results.simplePaybackYears,
      delta: 0,
      formatter: (value: number) => decimalFormatter.format(value),
    },
    {
      label: `Lifecycle Cost (${lifecycleYears} yrs)`,
      baseline: baselineEnergyCost + baselineMaintenance + baselineCapex,
      compare: compareEnergyCost + compareMaintenance + compareCapex,
      delta:
        compareEnergyCost +
        compareMaintenance +
        compareCapex -
        (baselineEnergyCost + baselineMaintenance + baselineCapex),
      formatter: (value: number) => currencyFormatterPrecise.format(value),
    },
    {
      label: 'CO₂ (tons/year)',
      baseline: baselineCo2,
      compare: compareCo2,
      delta: compareCo2 - baselineCo2,
      formatter: (value: number) => decimalFormatter.format(value),
    },
  ];

  const handleStartNewAnalysis = () => {
    resetWizard();
    router.push('/wizard');
  };

  const kpis = [
    {
      title: 'Annual Energy Savings',
      icon: Bolt,
      value: `${decimalFormatter.format(
        energyPercent
      )}% • ${currencyFormatter.format(annualSavings)}/yr`,
      note: 'Source: Project analysis (mock)',
    },
    {
      title: 'Payback Period',
      icon: Clock,
      value: `${decimalFormatter.format(paybackValue)} years`,
      note: `Based on ${lifecycleYears}-year analysis`,
    },
    {
      title: 'Lifecycle Cost Savings',
      icon: TrendingUp,
      value: `${currencyFormatter.format(
        lifecycleValue
      )} over ${lifecycleYears} years`,
      note: 'Includes energy & maintenance',
    },
    {
      title: 'CO₂ Reduction',
      icon: Leaf,
      value: `${decimalFormatter.format(co2Value)} tons/year`,
      note: 'Source: EPA eGRID factor (mock)',
    },
  ];

  return (
    <div className="space-y-8" aria-labelledby="results-summary-heading">
      <header className="space-y-2">
        <h1
          id="results-summary-heading"
          className="text-3xl md:text-4xl font-bold leading-tight"
          style={{ color: '#246D9E' }}
        >
          Project Summary — {project.project.name}
        </h1>
        <p className="text-lg text-daikin-gray-500">
          {project.location.city}, {project.location.state} • Climate Zone{' '}
          {project.location.climateZone}
        </p>
        <p className="text-sm text-daikin-gray-500 leading-relaxed">
          Executive summary of energy, cost, and sustainability impacts for the
          proposed Daikin inverter retrofit.
        </p>
      </header>

      {/* KPI Grid */}
      <section aria-label="Key performance indicators">
        <MetricGrid>
          {kpis.map((kpi) => (
            <MetricCard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              note={kpi.note}
            />
          ))}
        </MetricGrid>
      </section>

      {/* Charts */}
      <section aria-label="Comparison charts" className="space-y-3">
        <div
          className={`flex flex-col gap-6 transition-opacity duration-500 ${
            chartsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Card title="Energy Trend" description="Annual energy consumption">
            <EnergyLineChart
              data={project.energySeries}
              metricLabel="Annual kWh"
              unit="kWh"
            />
            <p className="mt-4 text-xs text-daikin-gray-500">
              Data source: Project load model (mock)
            </p>
          </Card>

          <Card
            title="Lifecycle Cost Trend"
            description={`Stacked energy, maintenance, and capex over ${lifecycleYears} years`}
          >
            <LifecycleAreaChart
              baselineData={project.lifecycleBaselineSeries}
              invData={project.lifecycleInvSeries}
              unit="$"
            />
            <p className="mt-4 text-xs text-daikin-gray-500">
              Data source: Cost model assumptions (mock)
            </p>
          </Card>
        </div>
      </section>

      {/* Detailed Table */}
      <section aria-label="Detailed results table" className="space-y-4">
        <h2 className="text-subheading font-semibold text-brand-deep">
          Detailed Results
        </h2>
        <div className="overflow-x-auto rounded-card border border-daikin-gray-100">
          <table className="min-w-full divide-y divide-daikin-gray-100">
            <thead style={{ backgroundColor: '#F7FAFC' }}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-daikin-gray-500"
                >
                  Metric
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-daikin-gray-500"
                >
                  Baseline
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-daikin-gray-500"
                >
                  Daikin INV
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-daikin-gray-500"
                >
                  Δ (Savings)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-daikin-gray-100">
              {detailedRows.map((row) => (
                <tr
                  key={row.label}
                  className="hover:bg-daikin-gray-50/50 transition-colors"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-left text-sm font-semibold text-primary"
                  >
                    {row.label}
                  </th>
                  <td className="px-6 py-4 text-right text-sm text-daikin-gray-500 font-medium">
                    {row.formatter(row.baseline)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-daikin-gray-500 font-medium">
                    {row.formatter(row.compare)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-sm font-bold ${
                      row.delta < 0 ? 'text-accent' : 'text-daikin-gray-500'
                    }`}
                  >
                    {row.formatter(row.delta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="System assumptions" className="space-y-4">
        <h2 className="text-subheading font-semibold text-brand-deep">
          System Assumptions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card title="Baseline System" className="h-full">
            <dl className="space-y-3 text-sm text-daikin-gray-500">
              <div>
                <dt className="text-xs uppercase tracking-wide text-daikin-gray-500">
                  COP @47°F
                </dt>
                <dd className="text-sm font-semibold text-primary">
                  {baselineCop47Value}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-daikin-gray-500">
                  COP @17°F
                </dt>
                <dd className="text-sm font-semibold text-primary">
                  {baselineCop17Value}
                </dd>
              </div>
            </dl>
          </Card>
          <Card title="Daikin Inverter" className="h-full">
            <dl className="space-y-3 text-sm text-daikin-gray-500">
              <div>
                <dt className="text-xs uppercase tracking-wide text-daikin-gray-500">
                  COP @47°F
                </dt>
                <dd className="text-sm font-semibold text-primary">
                  {compareCop47Value}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-daikin-gray-500">
                  COP @17°F
                </dt>
                <dd className="text-sm font-semibold text-primary">
                  {compareCop17Value}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </section>

      {/* Actions */}
      <section
        aria-label="Actions"
        className="flex flex-col justify-end gap-3 sm:flex-row"
      >
        <SecondaryButton type="button" onClick={handleStartNewAnalysis}>
          Start New Analysis
        </SecondaryButton>
        <PrimaryButton type="button" onClick={() => setIsPdfOpen(true)}>
          Download Report (PDF)
        </PrimaryButton>
      </section>

      <ReportPreviewModal
        open={isPdfOpen}
        onOpenChange={setIsPdfOpen}
        project={project}
        results={results}
      />
    </div>
  );
}

export type { ResultsDashboardProps };
