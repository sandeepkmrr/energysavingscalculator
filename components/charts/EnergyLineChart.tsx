'use client';

import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import {
  calculateDelta,
  formatCompactValue,
  formatPercentage,
  formatValueWithUnit,
} from './chartUtils';

type SeriesKey = 'baseline' | 'inv';

export interface EnergyLineChartDatum {
  year: number;
  baseline: number;
  inv: number;
}

export interface EnergyLineChartProps {
  data: EnergyLineChartDatum[];
  metricLabel: string;
  unit: string;
  className?: string;
}

const SERIES_DEFINITIONS: Record<
  SeriesKey,
  { label: string; color: string; dataKey: SeriesKey }
> = {
  baseline: {
    label: 'Baseline',
    color: 'var(--chart-baseline, #2E9AD8)',
    dataKey: 'baseline',
  },
  inv: {
    label: 'Daikin INV',
    color: 'var(--chart-daikin, #2CA66A)',
    dataKey: 'inv',
  },
};

interface EnergyTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number | string;
  unit: string;
}

const EnergyTooltip = ({
  active,
  payload,
  label,
  unit,
}: EnergyTooltipProps) => {
  if (!active || !payload || payload.length === 0 || label === undefined) {
    return null;
  }

  const baselinePoint = payload.find(
    (entry) => entry.dataKey === SERIES_DEFINITIONS.baseline.dataKey
  );
  const invPoint = payload.find(
    (entry) => entry.dataKey === SERIES_DEFINITIONS.inv.dataKey
  );

  const baselineValue = baselinePoint?.value as number | undefined;
  const invValue = invPoint?.value as number | undefined;

  if (baselineValue === undefined || invValue === undefined) {
    return null;
  }

  const { delta, deltaPct } = calculateDelta(baselineValue, invValue);

  return (
    <div
      className="rounded-md border border-daikin-gray-100 bg-white px-4 py-3 text-sm shadow-card"
      role="status"
    >
      <p className="text-xs font-semibold text-primary mb-2">
        Year {label} — {formatValueWithUnit(invValue, unit)}
      </p>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: SERIES_DEFINITIONS.baseline.color }}
            aria-hidden="true"
          />
          <span className="text-xs text-daikin-gray-500 min-w-[70px]">
            {SERIES_DEFINITIONS.baseline.label}:
          </span>
          <span className="font-semibold text-daikin-gray-500 text-xs">
            {formatValueWithUnit(baselineValue, unit)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: SERIES_DEFINITIONS.inv.color }}
            aria-hidden="true"
          />
          <span className="text-xs text-daikin-gray-500 min-w-[70px]">
            {SERIES_DEFINITIONS.inv.label}:
          </span>
          <span className="font-semibold text-daikin-gray-500 text-xs">
            {formatValueWithUnit(invValue, unit)}
          </span>
        </div>
      </div>
      <p className="mt-3 pt-2 border-t border-daikin-gray-100 text-xs text-accent font-semibold">
        Savings: {formatValueWithUnit(delta, unit)} (
        {formatPercentage(deltaPct)})
      </p>
    </div>
  );
};

export function EnergyLineChart({
  data,
  metricLabel,
  unit,
  className,
}: EnergyLineChartProps) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<SeriesKey>>(new Set());

  const ariaLabel = useMemo(
    () =>
      `Trend of ${metricLabel} for Baseline and Daikin inverter systems over ${data.length} years`,
    [data.length, metricLabel]
  );

  const toggleSeries = (seriesKey: SeriesKey) => {
    setHiddenSeries((current) => {
      const next = new Set(current);
      if (next.has(seriesKey)) {
        next.delete(seriesKey);
      } else {
        next.add(seriesKey);
      }
      return next;
    });
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        className="flex flex-wrap items-center justify-end gap-3 pb-3"
        aria-label="Toggle data series"
      >
        {(Object.keys(SERIES_DEFINITIONS) as SeriesKey[]).map((seriesKey) => {
          const series = SERIES_DEFINITIONS[seriesKey];
          const isHidden = hiddenSeries.has(seriesKey);
          return (
            <button
              key={seriesKey}
              type="button"
              onClick={() => toggleSeries(seriesKey)}
              className={cn(
                'flex items-center gap-2 text-xs font-medium transition-opacity',
                isHidden ? 'opacity-50' : 'opacity-100 text-primary'
              )}
              aria-pressed={!isHidden}
              aria-label={`Toggle ${series.label} series`}
            >
              <span
                className="h-2 w-6 rounded-full"
                style={{
                  backgroundColor: series.color,
                  opacity: isHidden ? 0.4 : 1,
                }}
                aria-hidden="true"
              />
              {series.label}
            </button>
          );
        })}
      </div>
      <div
        className="h-[280px]"
        role="img"
        aria-label={ariaLabel}
        aria-live="polite"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 24, left: 0, bottom: 10 }}
          >
            <CartesianGrid
              stroke="var(--chart-grid, #E6EEF7)"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-grid, #E6EEF7)' }}
              tick={{ fill: 'var(--chart-axis, #6B7B8A)', fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => formatCompactValue(value)}
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-grid, #E6EEF7)' }}
              tick={{ fill: 'var(--chart-axis, #6B7B8A)', fontSize: 12 }}
            />
            <Tooltip
              content={<EnergyTooltip unit={unit} />}
              cursor={{ stroke: '#1E293B', strokeDasharray: '3 3' }}
              wrapperStyle={{ outline: 'none' }}
            />
            {(Object.keys(SERIES_DEFINITIONS) as SeriesKey[]).map(
              (seriesKey) => {
                const series = SERIES_DEFINITIONS[seriesKey];
                return (
                  <Line
                    key={seriesKey}
                    type="monotone"
                    dataKey={series.dataKey}
                    name={series.label}
                    stroke={series.color}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    hide={hiddenSeries.has(seriesKey)}
                    strokeOpacity={hiddenSeries.has(seriesKey) ? 0 : 1}
                  />
                );
              }
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export {
  calculateDelta,
  formatValueWithUnit,
  formatPercentage,
} from './chartUtils';
