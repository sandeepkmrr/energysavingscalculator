'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import { Modal } from '@/components/shared/Modal';
import { PrimaryButton, SecondaryButton } from '@/components/shared';
import { type Project } from '@/lib/mockData';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const rateFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});

interface ReportPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  results: Project['results'];
}

export function ReportPreviewModal({
  open,
  onOpenChange,
  project,
  results,
}: ReportPreviewModalProps) {
  const energyChartData = useMemo(
    () => [
      { name: 'Baseline', kWh: results.baselineAnnualKWh },
      { name: 'Daikin INV', kWh: results.compareAnnualKWh },
    ],
    [results.baselineAnnualKWh, results.compareAnnualKWh]
  );

  const lifecycleYears = project.analysisPeriodYears;
  const baselineEnergyCost = results.baselineAnnualCost * lifecycleYears;
  const compareEnergyCost = results.compareAnnualCost * lifecycleYears;
  const baselineMaintenance =
    Number(project.maintenanceCostPerYear || 0) * lifecycleYears;
  const compareMaintenance = baselineMaintenance * 0.85;

  const lifecycleChartData = useMemo(
    () => [
      {
        name: 'Baseline',
        Energy: Math.round(baselineEnergyCost),
        Maintenance: Math.round(baselineMaintenance),
      },
      {
        name: 'Daikin INV',
        Energy: Math.round(compareEnergyCost),
        Maintenance: Math.round(compareMaintenance),
      },
    ],
    [
      baselineEnergyCost,
      baselineMaintenance,
      compareEnergyCost,
      compareMaintenance,
    ]
  );

  const summary = `${
    project.systemCompare.type
  } saves ${currencyFormatter.format(
    results.annualCostSavings
  )}/yr and pays back in ${decimalFormatter.format(
    results.simplePaybackYears
  )} years.`;

  const kpis = [
    {
      label: 'Annual Savings',
      value: `${currencyFormatter.format(results.annualCostSavings)}/yr`,
    },
    {
      label: 'Energy Savings',
      value: `${decimalFormatter.format(
        (results.annualKWhSavings / results.baselineAnnualKWh) * 100
      )}%`,
    },
    {
      label: 'Payback',
      value: `${decimalFormatter.format(results.simplePaybackYears)} yrs`,
    },
    {
      label: 'Lifecycle Savings',
      value: `${currencyFormatter.format(results.lifecycleSavings)}`,
    },
  ];

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

  const assumptions = [
    {
      label: 'Electric Rate',
      value: `${rateFormatter.format(project.electricRate)}/kWh`,
    },
    {
      label: 'Annual Hours',
      value: project.hoursPerYear.toLocaleString(),
    },
    {
      label: 'Analysis Period',
      value: `${project.analysisPeriodYears} years`,
    },
    {
      label: 'COP @47°F (Baseline)',
      value: baselineCop47Value,
    },
    {
      label: 'COP @17°F (Baseline)',
      value: baselineCop17Value,
    },
    {
      label: 'COP @47°F (Daikin INV)',
      value: compareCop47Value,
    },
    {
      label: 'COP @17°F (Daikin INV)',
      value: compareCop17Value,
    },
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/daikin-report.pdf';
    link.download = 'daikin-energy-summary.pdf';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Energy Savings & Lifecycle Cost Summary"
      description={`Generated for ${project.project.name}`}
      footer={
        <div className="flex justify-end gap-2">
          <SecondaryButton type="button" onClick={() => onOpenChange(false)}>
            Close
          </SecondaryButton>
          <PrimaryButton type="button" onClick={handleDownload}>
            Download PDF
          </PrimaryButton>
        </div>
      }
      className="max-w-4xl"
      contentClassName="max-w-4xl"
    >
      <article className="printable relative overflow-hidden bg-white text-sm text-daikin-gray-500">
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <img
            src="/daikin-logo.svg"
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
        </div>

        <header className="relative flex items-center justify-between border-b border-daikin-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/daikin-logo.svg"
              alt="Daikin logo"
              className="h-8 w-auto"
            />
            <div>
              <h2 className="text-lg font-semibold text-primary">
                Energy Savings & Lifecycle Cost Summary
              </h2>
              <p className="text-xs text-daikin-gray-500">
                {project.project.name} • {project.location.city},{' '}
                {project.location.state} • Climate Zone{' '}
                {project.location.climateZone}
              </p>
            </div>
          </div>
          <div className="text-xs text-daikin-gray-500 text-right">
            <p>{new Date().toLocaleDateString()}</p>
          </div>
        </header>

        <section className="relative mt-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
            Executive Summary
          </h3>
          <p>{summary}</p>
        </section>

        <section className="relative mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-daikin-gray-100 bg-daikin-gray-50/60 p-3"
              >
                <p className="text-xs text-daikin-gray-500 uppercase tracking-wide">
                  {kpi.label}
                </p>
                <p className="text-lg font-semibold text-primary">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-daikin-gray-100 bg-daikin-gray-50/50 p-3">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
              Energy Use Comparison
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Bar
                    dataKey="kWh"
                    name="Annual kWh"
                    fill="#007AC2"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-lg border border-daikin-gray-100 bg-daikin-gray-50/50 p-3">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
              Lifecycle Cost Comparison
            </h4>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifecycleChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      currencyFormatter.format(value)
                    }
                  />
                  <Bar
                    dataKey="Energy"
                    stackId="a"
                    fill="#007AC2"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar dataKey="Maintenance" stackId="a" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="relative mt-4">
          <div className="rounded-lg border border-daikin-gray-100 bg-white p-4">
            <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
              Key Assumptions
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {assumptions.map((assumption) => (
                <div key={assumption.label}>
                  <dt className="text-xs text-daikin-gray-500 uppercase tracking-wide">
                    {assumption.label}
                  </dt>
                  <dd className="text-sm text-primary font-semibold">
                    {assumption.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <footer className="relative mt-6 space-y-2 border-t border-daikin-gray-100 pt-4 text-center text-xs text-daikin-gray-400">
          <p>
            Modeled using Daikin Engineering Data (EA-Pro). For sales use only.
          </p>
          <p>
            © {new Date().getFullYear()} Daikin North America LLC. Confidential
            and proprietary — do not distribute externally without
            authorization.
          </p>
        </footer>
      </article>
    </Modal>
  );
}

export type { ReportPreviewModalProps };
