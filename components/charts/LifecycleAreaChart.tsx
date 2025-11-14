'use client';

import { useId, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatCompactValue, formatValueWithUnit } from './chartUtils';

export interface LifecycleAreaDatum {
  year: number;
  energy: number;
  maintenance: number;
  capex: number;
}

export interface LifecycleAreaChartProps {
  baselineData: LifecycleAreaDatum[];
  invData: LifecycleAreaDatum[];
  unit: string;
  className?: string;
}

interface LifecycleTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number | string;
  unit: string;
}

type LifecycleStackKey = Exclude<keyof LifecycleAreaDatum, 'year'>;

const STACK_ORDER: LifecycleStackKey[] = ['energy', 'maintenance', 'capex'];

const STACK_COLORS: Record<
  LifecycleStackKey,
  { stroke: string; fill: string; label: string }
> = {
  energy: {
    stroke: 'var(--chart-baseline, #2E9AD8)',
    fill: 'rgba(46, 154, 216, 0.2)',
    label: 'Energy',
  },
  maintenance: {
    stroke: 'var(--chart-accent1, #6EC1FF)',
    fill: 'rgba(110, 193, 255, 0.25)',
    label: 'Maintenance',
  },
  capex: {
    stroke: 'var(--chart-daikin, #2CA66A)',
    fill: 'rgba(44, 166, 106, 0.15)',
    label: 'CapEx',
  },
};

const LifecycleTooltip = ({
  active,
  payload,
  label,
  unit,
}: LifecycleTooltipProps) => {
  if (!active || !payload || payload.length === 0 || label === undefined) {
    return null;
  }

  const dataPoint = payload[0]?.payload as LifecycleAreaDatum | undefined;

  if (!dataPoint) {
    return null;
  }

  const total = dataPoint.energy + dataPoint.maintenance + dataPoint.capex;

  return (
    <div className="rounded-md border border-daikin-gray-100 bg-white px-4 py-3 text-sm shadow-card">
      <p className="text-xs font-semibold text-primary mb-2">
        Year {label} — Total {formatValueWithUnit(total, unit)}
      </p>
      <dl className="space-y-2 text-xs">
        {STACK_ORDER.map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: STACK_COLORS[key].stroke }}
              aria-hidden="true"
            />
            <dt className="text-daikin-gray-500 min-w-[80px]">
              {STACK_COLORS[key].label}:
            </dt>
            <dd className="font-semibold text-daikin-gray-500">
              {formatValueWithUnit(dataPoint[key], unit)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

interface PanelProps {
  data: LifecycleAreaDatum[];
  label: string;
  unit: string;
  chartId: string;
}

function LifecyclePanel({ data, label, unit, chartId }: PanelProps) {
  return (
    <div
      className="flex h-full flex-col gap-2 rounded-lg border border-daikin-gray-100 bg-daikin-gray-50/40 p-4"
      role="img"
      aria-label={`${label} lifecycle cost composition over ${data.length} years`}
    >
      <h3 className="text-sm font-semibold text-primary">{label}</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
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
              content={<LifecycleTooltip unit={unit} />}
              wrapperStyle={{ outline: 'none' }}
            />
            {STACK_ORDER.map((key) => (
              <Area
                key={`${chartId}-${key}`}
                type="monotone"
                dataKey={key}
                stackId="total"
                stroke={STACK_COLORS[key].stroke}
                fill={STACK_COLORS[key].fill}
                strokeWidth={2}
                animationDuration={400}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LifecycleAreaChart({
  baselineData,
  invData,
  unit,
  className,
}: LifecycleAreaChartProps) {
  const chartId = useId();

  const normalizedBaseline = useMemo(
    () => baselineData.map((entry) => ({ ...entry })),
    [baselineData]
  );
  const normalizedInv = useMemo(
    () => invData.map((entry) => ({ ...entry })),
    [invData]
  );

  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
      <LifecyclePanel
        data={normalizedBaseline}
        label="Baseline System"
        unit={unit}
        chartId={`${chartId}-baseline`}
      />
      <LifecyclePanel
        data={normalizedInv}
        label="Daikin INV"
        unit={unit}
        chartId={`${chartId}-inv`}
      />
    </div>
  );
}
