'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { Bolt, Clock, TrendingUp, Leaf } from 'lucide-react';

import { Card } from '@/components/shared/Card';
import { PrimaryButton, SecondaryButton } from '@/components/shared';
import { ReportPreviewModal } from '@/components/wizard/ReportPreviewModal';
import { useWizard } from '@/contexts/WizardContext';
import { type Project } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

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

  const energyChartData = useMemo(
    () => [
      {
        name: 'Baseline',
        kWh: results.baselineAnnualKWh,
      },
      {
        name: 'Daikin INV',
        kWh: results.compareAnnualKWh,
      },
    ],
    [results.baselineAnnualKWh, results.compareAnnualKWh]
  );

  const lifecycleYears = project.analysisPeriodYears;
  const baselineEnergyCost = results.baselineAnnualCost * lifecycleYears;
  const compareEnergyCost = results.compareAnnualCost * lifecycleYears;
  const baselineMaintenance =
    Number(project.maintenanceCostPerYear || 0) * lifecycleYears;
  const compareMaintenance = baselineMaintenance * 0.85;
  const baselineCapex = 0;
  const compareCapex = 5000;

  const lifecycleChartData = useMemo(
    () => [
      {
        name: 'Baseline',
        Energy: Math.round(baselineEnergyCost),
        Maintenance: Math.round(baselineMaintenance),
        CapEx: baselineCapex,
      },
      {
        name: 'Daikin INV',
        Energy: Math.round(compareEnergyCost),
        Maintenance: Math.round(compareMaintenance),
        CapEx: compareCapex,
      },
    ],
    [
      baselineEnergyCost,
      baselineMaintenance,
      compareEnergyCost,
      compareMaintenance,
      compareCapex,
    ]
  );

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
    <div className="space-y-6" aria-labelledby="results-summary-heading">
      <header className="space-y-1">
        <h1
          id="results-summary-heading"
          className="text-headline text-primary font-semibold"
        >
          Project Summary — {project.project.name} • {project.location.city},{' '}
          {project.location.state} (Climate Zone {project.location.climateZone})
        </h1>
        <p className="text-sm text-daikin-gray-500">
          Executive summary of energy, cost, and sustainability impacts for the
          proposed Daikin inverter retrofit.
        </p>
      </header>

      {/* KPI Grid */}
      <section aria-label="Key performance indicators">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="h-full pt-5">
                <div className="flex h-full flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-daikin-gray-50 text-primary">
                      <Icon aria-hidden className="h-4 w-4" />
                    </span>
                    <p className="flex-1 text-left text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-daikin-gray-500 leading-tight">
                      {kpi.title}
                    </p>
                  </div>
                  <p className="text-3xl font-semibold leading-none text-primary">
                    {kpi.value}
                  </p>
                  <p className="text-xs leading-relaxed text-daikin-gray-500">
                    {kpi.note}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Charts */}
      <section aria-label="Comparison charts" className="space-y-3">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-500 ${
            chartsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Card
            title="Energy Use Comparison"
            description="Annual energy consumption"
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={energyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => value.toLocaleString()}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar
                  dataKey="kWh"
                  name="Annual kWh"
                  fill="#007AC2"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-4 text-xs text-daikin-gray-500">
              Data source: Project load model (mock)
            </p>
          </Card>

          <Card
            title="Lifecycle Cost Comparison"
            description={`Stacked energy, maintenance, and capital over ${lifecycleYears} years`}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={lifecycleChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) =>
                    currencyFormatterPrecise.format(value)
                  }
                />
                <Legend />
                <Bar
                  dataKey="Energy"
                  stackId="a"
                  fill="#007AC2"
                  radius={[6, 6, 0, 0]}
                />
                <Bar dataKey="Maintenance" stackId="a" fill="#3B82F6" />
                <Bar
                  dataKey="CapEx"
                  stackId="a"
                  fill="#60A5FA"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-4 text-xs text-daikin-gray-500">
              Data source: Cost model assumptions (mock)
            </p>
          </Card>
        </div>
      </section>

      {/* Detailed Table */}
      <section aria-label="Detailed results table" className="space-y-2">
        <h2 className="text-lg font-semibold text-primary">Detailed Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-daikin-gray-100">
            <thead className="bg-daikin-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-sm font-medium text-daikin-gray-500"
                >
                  Metric
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-sm font-medium text-daikin-gray-500"
                >
                  Baseline
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-sm font-medium text-daikin-gray-500"
                >
                  Daikin INV
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-sm font-medium text-daikin-gray-500"
                >
                  Δ (Savings)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-daikin-gray-100">
              {detailedRows.map((row) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className="px-4 py-3 text-left text-sm font-medium text-primary"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-3 text-right text-sm text-daikin-gray-500">
                    {row.formatter(row.baseline)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-daikin-gray-500">
                    {row.formatter(row.compare)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right text-sm ${
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
